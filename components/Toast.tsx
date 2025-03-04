import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { View, Text } from "./Themed";
import Colors from "@/constants/Colors";
import { ToastConfigParams, ToastType } from "react-native-toast-message";

// Define props type
interface CustomToastProps {
  text1?: string;
  text2?: string;
  type?: ToastType;
  visibilityTime?: number; // Optional, defaults to 5000ms
}

const CustomToast: React.FC<CustomToastProps> = ({
  text1,
  text2,
  type = "default",
}) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  // Define background and text colors based on toast type
  const backgroundColors: Record<ToastType, string> = {
    success: themeColors.success,
    error: themeColors.danger,
    warning: themeColors.warning,
    info: themeColors.info,
    default: themeColors.cardBackground,
  };

  const textColors: Record<ToastType, string> = {
    success: "#ffffff",
    error: "#ffffff",
    warning: "#ffffff",
    info: "#ffffff",
    default: themeColors.text,
  };

  return (
    <View
      style={[
        styles.toastContainer,
        {
          backgroundColor: backgroundColors[type],
          borderColor: themeColors.border,
        },
      ]}
    >
      <Text style={[styles.toastText1, { color: textColors[type] }]}>
        {text1}
      </Text>
      {text2 && (
        <Text style={[styles.toastText2, { color: textColors[type] }]}>
          {text2}
        </Text>
      )}
    </View>
  );
};

// Define type-safe toast config with 5-second duration
export const toastConfig: Record<
  ToastType,
  (params: ToastConfigParams<any>) => JSX.Element
> = {
  success: (params) => <CustomToast {...params} visibilityTime={5000} />,
  error: (params) => <CustomToast {...params} visibilityTime={5000} />,
  warning: (params) => <CustomToast {...params} visibilityTime={5000} />,
  info: (params) => <CustomToast {...params} visibilityTime={5000} />,
  default: (params) => <CustomToast {...params} visibilityTime={5000} />,
};

const styles = StyleSheet.create({
  toastContainer: {
    padding: 10,
    marginHorizontal: 20,
    elevation: 4,
    borderWidth: 1,
    minWidth: 300,
    borderRadius: 5,
  },
  toastText1: {
    fontSize: 16,
    fontWeight: "bold",
  },
  toastText2: {
    fontSize: 14,
  },
});

export default CustomToast;
