import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const formatDate = (date: string) => {
    const originalDate = new Date(date)
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, '0');
    const day = String(originalDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number, radius: number) => {
    const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111320;
    return distance <= radius;
};

export const reFormatDateTime = (date: string) => {
    const inputDateTime = new Date(date);

    const day = inputDateTime.getDate();
    const month = inputDateTime.getMonth() + 1;
    const year = inputDateTime.getFullYear();

    let hours = inputDateTime.getHours();
    const minutes = inputDateTime.getMinutes();

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${(minutes < 10 ? '0' : '') + minutes} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
}

export async function setStorageItemAsync(key: string, value: string | null) {
    if (Platform.OS === "web") {
        try {
            if (value === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            console.error("Local storage is unavailable:", e);
        }
    } else {
        if (value == null) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    }
}

export async function getStorageItemAsync(key: string) {
    if (Platform.OS === "web") {
        return localStorage.getItem(key);
    } else {
        return await SecureStore.getItemAsync(key);
    }
}