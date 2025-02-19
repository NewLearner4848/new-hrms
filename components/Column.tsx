import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { Text, View } from './Themed';
import Colors from "@/constants/Colors";

interface ColumnProps {
  number: string | number;
  text: string;
}

const Column: React.FC<ColumnProps> = ({ number, text }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <View style={[styles.column, { backgroundColor: Colors[colorScheme ?? "light"].tint }]}>
      <Text
        numberOfLines={2}
        adjustsFontSizeToFit
        style={[styles.bigFont, { color: Colors[colorScheme ?? "light"].text }]}
      >
        {String(number)}
      </Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.para, { color: Colors[colorScheme ?? "light"].text }]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    shadowColor: "#000", // Shadow props for all platforms
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android
    marginHorizontal: 5,
  },
  bigFont: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  para: {
    fontSize: 12,
    textAlign: "center",
  },
});

export default Column;
