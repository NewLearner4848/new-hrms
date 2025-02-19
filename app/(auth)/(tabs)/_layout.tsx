import React from "react";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { View } from "@/components/Themed";
import Footer from "@/components/Footer";

export default function Layout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false, // Hide default header
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="two" options={{ title: "Clock In/Out" }} />
      </Stack>
      <Footer />
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
});
