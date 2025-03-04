import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { loginUser } from "@/actions/UserActions";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import InputField from "@/components/InputField";
import Checkbox from "expo-checkbox";
import { useSession } from "@/shared/ctx";
import { router } from "expo-router";
import { View, Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import Footer from "@/components/Footer";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { session, signIn } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.replace("/(auth)/(tabs)");
    }
  }, [session?.user]);

  async function handleLogin() {
    setIsLoading(true);
    try {
      const userData = await loginUser(username, password);
      if (userData && userData?.data?.status && userData?.data?.result) {
        signIn(userData.data.result);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: userData?.data?.msg || "Successfully Logged in!",
        });
        router.replace("/(auth)/(tabs)");
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: userData?.data?.msg || "Invalid username or password.",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <View
          style={[styles.box, { backgroundColor: themeColors.cardBackground }]}
        >
          <Image
            source={require("@/assets/sabar_logo.png")}
            style={styles.logo}
          />

          <InputField
            place_holder="Username*"
            keyboard_type="default"
            value={username}
            setValue={setUsername}
            return_key_type="next"
          />

          <View
            style={[
              styles.passwordContainer,
              { borderColor: themeColors.border },
            ]}
          >
            <InputField
              style={styles.passwordInput}
              place_holder="Password*"
              keyboard_type="default"
              value={password}
              setValue={setPassword}
              return_key_type="done"
              secure_text_entry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color={themeColors.textSecondary}
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              color={themeColors.primary}
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setIsChecked}
            />
            <Text style={{ color: themeColors.textSecondary }}>
              Remember me
            </Text>
          </View>

          <Button
            text="Sign In"
            handlePress={handleLogin}
            backgroundColor={themeColors.primary}
          />
        </View>
      </View>
      {isLoading && <Loader />}
      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  box: {
    width: "100%",
    maxWidth: 400,
    padding: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    width: "100%",
    marginBottom: 30,
    resizeMode: "contain",
    alignSelf: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 0,
  },
  eyeIcon: {
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
});

export default LoginScreen;
