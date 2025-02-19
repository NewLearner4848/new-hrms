import { StyleSheet, Alert, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import Column from "@/components/Column";
import Button from "@/components/Button";
import { useFocusEffect } from '@react-navigation/native';
import { reFormatDateTime } from "@/shared/utils";
import * as LocalAuthentication from "expo-local-authentication";
import { fetchClocking } from "@/actions/UserActions";
import React from "react";
import { useRouter } from "expo-router";
import { useSession } from "@/shared/ctx";

const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const { session, addClockingData } = useSession();
  const router = useRouter();

  const fetchClockingData = async () => {
    const clockingStatus = await fetchClocking(
      session?.user?.user_id,
      session?.user?.token
    );
    
    if (clockingStatus.status && clockingStatus.data) {
      // Check for data
      addClockingData(clockingStatus.data?.result as any);
    } else if (!clockingStatus.status) {
      console.error(clockingStatus.msg);
      Alert.alert(
        "Error",
        clockingStatus.msg || "Failed to fetch clocking data."
      );
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchClockingData();
    }, [])
  );

  const handleAuthentication = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to Clock In",
      });

      const clockInOrOut =
        !session?.clockData ||
        !session?.clockData.clock_in ||
        (session?.clockData.clock_in && session?.clockData.clock_out)
          ? "clock_in"
          : "clock_out";

      if (success) {
        router.push({ pathname: "/(auth)/(tabs)/two", params: { clockInOrOut } });
      } else {
        // router.push({ pathname: "/(auth)/(tabs)/two", params: { clockInOrOut } });
        Alert.alert('Error', 'Authentication Failed'); // Optional alert
      }
    } catch (error: any) {
      console.error("Authentication failed:", error);
      Alert.alert("Error", "Authentication failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.flexBox}>
        <Column
          number={
            session?.clockData
              ? session?.clockData.clock_in
                ? reFormatDateTime(session?.clockData.clock_in)
                : "00:00"
              : "00:00"
          }
          text={"Last Clock In Time"}
        />
        <Column
          number={
            session?.clockData
              ? session?.clockData.clock_out
                ? reFormatDateTime(session?.clockData.clock_out)
                : "00:00"
              : "00:00"
          }
          text={"Last Clock Out Time"}
        />
      </View>
      <Button
        backgroundColor={
          !session?.clockData ||
          !session?.clockData.clock_in ||
          (session?.clockData.clock_in && session?.clockData.clock_out)
            ? isDarkMode
              ? "#005000"
              : "green"
            : isDarkMode
            ? "#8b0000"
            : "red"
        } // Conditional colors
        text={
          !session?.clockData ||
          !session?.clockData.clock_in ||
          (session?.clockData.clock_in && session?.clockData.clock_out)
            ? "Clock In"
            : "Clock Out"
        }
        handlePress={handleAuthentication}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 20,
  },
  flexBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
});

export default HomeScreen;
