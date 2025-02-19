import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { Stack } from "expo-router";
import HeaderLogo from "@/components/HeaderLogo";
import LogoutButton from "@/components/LogoutButton";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: Colors[colorScheme ?? "light"].tint }]}>
        <HeaderLogo />
        <LogoutButton />
      </View>

      <Stack
        screenOptions={{
          headerShown: false, // Hide default header
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="two" options={{ title: "Clock In/Out" }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },
  breadcrumbContainer: {
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  breadcrumbText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
