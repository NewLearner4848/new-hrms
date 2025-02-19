import axios from "axios";
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { baseUrl } from '../shared/constants';
import { calculateDistance, formatDate, formatDateTime } from "../shared/utils";

interface ClockInOutParams {
  image: string | null;
  type: string;
  latitude: number | undefined;
  longitude: number | undefined;
  user: number;
  token: string;
}

interface LeaveParams {
  user_id: number;
  token: string;
  start_date: Date;
  end_date: Date;
  reason: string;
  remarks: string;
  leave_type_id: number;
  leaveType: string;
}

interface ApiResponse<T> {
  data?: T;
  status: boolean;
  msg?: string;
}

interface UserLocation {
    result: {
        field_staff: string;
        latitude: number;
        longitude: number;
    },
    dept_head: string;
}

interface ClockingData {
    result: any;
}

interface LeaveData {
    // Define the structure of your leave data here
    leaves: {
        start_date: string;
        end_date: string;
        leave_type: string;
        // ... other properties
    }[];
}


export const loginUser = async (username: string, password: string): Promise<ApiResponse<any>> => {
    try {
        const response = await axios.post(`${baseUrl}/login`, { username, password });
        return { data: response.data, status: true };
    } catch (error: any) {
        return { status: false, msg: error.message };
    }
};

const fetchLocation = async (userId: number, token: string): Promise<ApiResponse<UserLocation>> => {
    try {
        const head = {
            'Authorization': `Bearer ${token}`,
        };

        const response = await axios.get(`${baseUrl}/getLocation/${userId}`, { headers: head });

        if (response.data) {
            return { data: response.data, status: true };
        } else {
            return { status: false, msg: 'Unexpected Error' };
        }
    } catch (error: any) {
        return { status: false, msg: error.message };
    }
};

export const ClockInOut = async ({ image, type, latitude, longitude, user, token }: ClockInOutParams): Promise<ApiResponse<any>> => {
    const userLocationResponse = await fetchLocation(user, token);

    if (!userLocationResponse.status) {
        return userLocationResponse;
    }

    const userLocation = userLocationResponse.data!;

    if (!userLocation.result.field_staff || userLocation.result.field_staff === 'No') {
        if (!userLocation.result.latitude || !userLocation.result.longitude) {
            return { status: false, msg: 'Location not found in Database. Please contact Administrator' };
        } else {
            const isAllowed = calculateDistance(
                latitude ?? 0,
                longitude ?? 0,
                userLocation.result.latitude,
                userLocation.result.longitude,
                userLocation.dept_head === 'Yes' ? 600 : 300,
            );
            if (!isAllowed) {
                return { status: false, msg: 'Clocking not allowed outside the office.' };
            }
        }
    }

    return compressBase64Image({ image, type, latitude, longitude, user, token });
};

const compressBase64Image = async ({ image, type, latitude, longitude, user, token }: ClockInOutParams): Promise<ApiResponse<any>> => {
    try {
        if (image) {
            const { uri } = await ImageManipulator.manipulateAsync(
                image,
                [{ resize: { width: 300 } }],
                { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
            );

            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
            const base64Image = `data:image/jpeg;base64, ${base64}`;
            return sendImageToAPI(base64Image, type, latitude ?? 0, longitude ?? 0, user, token);
        }
        return { status: false, msg: "No image provided" };
    } catch (error: any) {
        return { status: false, msg: error.message };
    }
};

const sendImageToAPI = async (compressedBase64: string, clock_state: string, latitude: number, longitude: number, user: number, token: string): Promise<ApiResponse<any>> => {
    try {
        const requestData = JSON.stringify({
            user_id: user,
            clock_state: clock_state,
            punch_time: formatDateTime(new Date()),
            latitude: latitude,
            longitude: longitude,
            photo: compressedBase64,
        });

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        const response = await axios.post(`${baseUrl}/set_clocking`, requestData, { headers });

        return { data: response.data, status: true };

    } catch (error: any) {
        return { status: false, msg: error.message };
    }
};

export const fetchLeaves = async (IdOfUser: number, AuthToken: string): Promise<ApiResponse<LeaveData>> => {
    try {
        const head = {
            'Authorization': `Bearer ${AuthToken}`,
        };

        const response = await axios.get(`${baseUrl}/leave/${IdOfUser}`, { headers: head });

        if (response.data) {
            return { data: response.data, status: true };
        } else {
            return { status: false, msg: 'Unexpected Error' };
        }
    } catch (error: any) {
        return { status: false, msg: error.message };
    }
};

export const applyLeave = async ({ user_id, token, start_date, end_date, reason, remarks, leave_type_id, leaveType }: LeaveParams): Promise<ApiResponse<any>> => {
    try {
        const headersOfRequest = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        const leaveApplicationData = JSON.stringify({
            user_id: user_id,
            leave_type_id: leave_type_id,
            start_date: formatDate(start_date.toISOString()),
            end_date: formatDate(end_date.toISOString()),
            leave_type: leaveType,
            reason: reason,
            remarks: remarks,
        });

        const response = await axios.post(`${baseUrl}/leave`, leaveApplicationData, { headers: headersOfRequest });

        if (response.data) {
            return { data: response.data, status: true };
        } else {
            return { status: false, msg: 'Unexpected response format' };
        }
    } catch (error: any) {
        return { status: false, msg: error.message };
    }
};

export const fetchClocking = async (IdOfUser: number, AuthToken: string): Promise<ApiResponse<ClockingData>> => {
    try {
        const head = {
            'Authorization': `Bearer ${AuthToken}`,
        };

        const response = await axios.get(`${baseUrl}/get_clocking/${IdOfUser}`, { headers: head });

        if (response.data) {
            return { data: response.data, status: true };
        } else {
            return { status: false, msg: 'Unexpected Error' };
        }
    } catch (error: any) {
        return { status: false, msg: error.message };
    }
};