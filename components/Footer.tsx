import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import Constants from "expo-constants";
import Colors from "@/constants/Colors";

const Footer: React.FC = () => {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].tint }]}>
      <Text
        style={[styles.text, { color: Colors[colorScheme ?? "light"].text }]}
      >
        Version {Constants.expoConfig?.version}
      </Text>
      <Text
        style={[styles.text, { color: Colors[colorScheme ?? "light"].text }]}
      >
        © {new Date().getFullYear()} Shree Mahakali Software Pvt Ltd
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 5,
    borderTopWidth: 1,
  },
  text: {
    fontSize: 12,
  },
});

export default Footer;
