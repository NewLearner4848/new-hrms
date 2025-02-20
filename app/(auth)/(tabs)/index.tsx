import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  useColorScheme,
} from "react-native";
import { View } from "@/components/Themed";
import Column from "@/components/Column";
import Button from "@/components/Button";
import { useFocusEffect } from "@react-navigation/native";
import { reFormatDateTime } from "@/shared/utils";
import * as LocalAuthentication from "expo-local-authentication";
import { fetchClocking } from "@/actions/UserActions";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useSession } from "@/shared/ctx";
import UserCard from "@/components/UserCard";
import Toast from 'react-native-toast-message';

const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [refreshing, setRefreshing] = useState(false);
  const { session, addClockingData } = useSession();
  const router = useRouter();

  const fetchClockingData = async () => {
    try {
      setRefreshing(true);
      const clockingStatus = await fetchClocking(
        session?.user?.user_id,
        session?.user?.token
      );

      if (clockingStatus?.status) {
        if (clockingStatus?.data?.status && clockingStatus?.data?.result) {
          addClockingData(clockingStatus.data?.result as any);
        } else {
          addClockingData(null);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: clockingStatus.msg || 'Failed to fetch clocking data.',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching clocking data:", error);
    } finally {
      setRefreshing(false);
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
        router.push({
          pathname: "/(auth)/(tabs)/punch",
          params: { clockInOrOut },
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Authentication Failed',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Failed',
        text2: error.message,
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchClockingData}
          />
        }
      >
        <UserCard />
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
      </ScrollView>
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
