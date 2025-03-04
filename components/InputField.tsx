import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  useColorScheme,
} from "react-native";
import Colors from "@/constants/Colors";

interface InputFieldProps extends TextInputProps {
  place_holder: string;
  keyboard_type?: TextInputProps["keyboardType"];
  value: string;
  setValue: (text: string) => void;
  return_key_type?: TextInputProps["returnKeyType"];
  secure_text_entry?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  place_holder,
  keyboard_type,
  value,
  setValue,
  return_key_type,
  secure_text_entry,
  style,
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <TextInput
      style={[
        styles.input,
        {
          borderColor: themeColors.border,
          backgroundColor: themeColors.inputBackground,
          color: themeColors.text,
        },
        style,
      ]}
      placeholder={place_holder}
      placeholderTextColor={themeColors.textSecondary}
      keyboardType={keyboard_type}
      returnKeyType={return_key_type}
      value={value}
      secureTextEntry={secure_text_entry}
      onChangeText={setValue}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
});

export default InputField;
