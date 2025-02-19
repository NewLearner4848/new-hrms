import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Alert, Platform } from "react-native";
import { Text, View } from "@/components/Themed";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { ClockInOut } from "@/actions/UserActions";
import Loader from "@/components/Loader";
import { useSession } from "@/shared/ctx";
import { router, useLocalSearchParams } from "expo-router";
import Button from "@/components/Button";

const ClockIn: React.FC = () => {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSession();
  const { clockInOrOut } = useLocalSearchParams<{ clockInOrOut: string }>();

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          router.back();
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        if (currentLocation.mocked && Platform.OS === "android") {
          Alert.alert(
            "ERROR",
            "Oops! Something is wrong! Your location might be manipulated. Please check."
          );
          router.back();
        } else {
          setLocation(currentLocation.coords);
        }
      } catch (error: any) {
        Alert.alert("Location Error", error.message);
        router.back();
      }
    })();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera.
        </Text>
        <Button handlePress={requestPermission} text="Grant Permission" />
      </View>
    );
  }

  const handleCancelPress = () => {
    router.back();
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleSubmitPress = async () => {
    if (!cameraRef.current) {
      Alert.alert("Error", "Camera is not ready.");
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

        if (response?.status) {
          Alert.alert("Success", response?.msg || "Clocking successful.");
          router.back();
        } else {
          Alert.alert("Error", response?.msg || "Clocking failed.");
        }
      }
    } catch (error: any) {
      Alert.alert("Camera Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        </CameraView>
      </View>

      {/* Buttons */}
      <Button handlePress={handleSubmitPress} text="Submit" />
      <Button
        handlePress={handleCancelPress}
        text="Cancel"
        backgroundColor="red"
      />

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
