import React, { useEffect, useState } from "react";
import { StyleSheet, Image, useColorScheme } from "react-native";
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
import Toast from 'react-native-toast-message';

const LoginScreen: React.FC = () => {
  const colorScheme = useColorScheme();

  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
        router.replace("/(auth)/(tabs)");
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: userData?.data?.msg || 'Invalid username or password.',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
        position: 'bottom',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.box}>
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
          <InputField
            place_holder="Password*"
            keyboard_type="default"
            value={password}
            setValue={setPassword}
            return_key_type="done"
            secure_text_entry={true}
          />
          <View style={styles.checkboxContainer}>
            <Checkbox
              color={Colors[colorScheme ?? "light"].textSecondary} // Conditional checkbox color
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setIsChecked}
            />
            <Text>Remember me</Text>
          </View>
          <Button
            text={"Sign In"}
            handlePress={handleLogin}
            backgroundColor={Colors[colorScheme ?? "light"].button}
          />
        </View>
        {isLoading && <Loader />}
      </View>
      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  box: {
    width: "100%",
    padding: 20,
  },

  logo: {
    width: "100%",
    height: 60,
    marginBottom: 40,
    resizeMode: "contain",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  checkbox: {
    marginRight: 10,
  },
});

export default LoginScreen;
