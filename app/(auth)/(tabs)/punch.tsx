import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Platform } from "react-native";
import { Text, View } from "@/components/Themed";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { ClockInOut } from "@/actions/UserActions";
import Loader from "@/components/Loader";
import { useSession } from "@/shared/ctx";
import { router, useLocalSearchParams } from "expo-router";
import Button from "@/components/Button";
import Toast from 'react-native-toast-message';

const ClockIn: React.FC = () => {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const { session } = useSession();
  const { clockInOrOut } = useLocalSearchParams<{ clockInOrOut: string }>();
  const [locationPermission, requestPermissionLocation] =
    Location.useForegroundPermissions();
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  const fetchLocation = async (mountedState: boolean) => {
    try {
      setLocationLoading(true);
      if (!locationPermission || !locationPermission.granted) {
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.High,
      });

      if (currentLocation.mocked && Platform.OS === "android") {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Location might be manipulated. Please check.',
          position: 'bottom',
          visibilityTime: 3000,
        });
        router.back();
        return;
      }

      if (mountedState) setLocation(currentLocation.coords);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Location Error',
        text2: 'Something went wrong. Please try again.',
        position: 'bottom',
        visibilityTime: 3000,
      });
      router.back();
    } finally {
      if (mountedState) setLocationLoading(false);
    }
  };
  useEffect(() => {
    let isMounted = true;

    fetchLocation(isMounted);

    return () => {
      isMounted = false;
    };
  }, [locationPermission]);

  if (!locationPermission || !locationPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the location.
        </Text>
        <Button
          handlePress={requestPermissionLocation}
          text="Grant Location Permission"
        />
      </View>
    );
  }

  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera.
        </Text>
        <Button
          handlePress={requestPermission}
          text="Grant Camera Permission"
        />
      </View>
    );
  }

  const handleCancelPress = () => {
    router.back();
  };

  const handleSubmitPress = async () => {
    if (!cameraRef.current) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Camera is not ready.',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    if (locationLoading || !location) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Waiting for location. Please try again.',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const photo = await cameraRef.current.takePictureAsync();

      if (photo) {
        const response = await ClockInOut({
          image: photo.uri,
          type: clockInOrOut || "clock_in",
          latitude: location?.latitude,
          longitude: location?.longitude,
          user: session?.user?.user_id,
          token: session?.user?.token,
        });

        if (response?.data?.status) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: response?.data?.msg || 'Clocking successful.',
            position: 'bottom',
            visibilityTime: 3000,
          });
          router.back();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: response?.data?.msg || 'Clocking failed.',
            position: 'bottom',
            visibilityTime: 3000,
          });
        }
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Camera Error',
        text2: error.message,
        position: 'bottom',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {locationLoading ? (
        <Loader />
      ) : (
        <>
          {/* Camera View */}
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing={"front"}
              ref={cameraRef}
            ></CameraView>
          </View>
          {/* Buttons */}
          <Button handlePress={handleSubmitPress} text="Submit" />
          <Button
            handlePress={handleCancelPress}
            text="Cancel"
            backgroundColor="red"
          />{" "}
        </>
      )}

      {isLoading && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  cameraContainer: {
    width: "100%",
    height: "65%",
    marginBottom: 30,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
});

export default ClockIn;
