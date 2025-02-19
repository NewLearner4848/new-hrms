import React from "react";
import { View, Text, StyleSheet, useColorScheme, Image } from "react-native";
import { useSession } from "@/shared/ctx";
import Colors from "@/constants/Colors";

const UserCard: React.FC = () => {
  const { session } = useSession();
  const colorScheme = useColorScheme();

  if (!session?.user) {
    return (
      <View style={styles.card}>
        <Text>No User Logged In</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: Colors[colorScheme ?? "light"].tint },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/avatar.png")}
          style={styles.image} // Combine styles
          resizeMode="contain"
        />
      </View>
      <Text
        style={[styles.bigFont, { color: Colors[colorScheme ?? "light"].text }]}
      >
        {session?.user.user_details[0].full_name.toUpperCase()}
      </Text>
      <Text
        style={[
          styles.para,
          { color: Colors[colorScheme ?? "light"].textSecondary },
        ]}
      >
        Department: {session?.user.user_details[0].department_name}
      </Text>
      <Text
        style={[
          styles.para,
          { color: Colors[colorScheme ?? "light"].textSecondary },
        ]}
      >
        Office Shift: {session?.user.user_details[0].shift_name}
      </Text>
      <Text
        style={[styles.para, { color: Colors[colorScheme ?? "light"].text }]}
      >
        Time: {session?.user.user_details[0].in_time} -{" "}
        {session?.user.user_details[0].out_time}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 5,
    shadowColor: "#000", // Shadow props for all platforms
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android
    marginHorizontal: 5,
    marginBottom: 25,
  },
  bigFont: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  para: {
    textAlign: "center",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
});

export default UserCard;
