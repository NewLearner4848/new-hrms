import React from 'react';
import { StyleSheet, TextInput, TextInputProps, useColorScheme } from "react-native";

interface InputFieldProps {
    place_holder: string;
    keyboard_type?: TextInputProps['keyboardType'];
    value: string;
    setValue: (text: string) => void;
    return_key_type?: TextInputProps['returnKeyType'];
    secure_text_entry?: boolean;
    // Add other TextInput props as needed
}

const InputField: React.FC<InputFieldProps> = ({
    place_holder,
    keyboard_type,
    value,
    setValue,
    return_key_type,
    secure_text_entry,
}) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    return (
        <TextInput
            style={[
                styles.input,
                isDarkMode && styles.inputDark, // Apply dark mode styles conditionally
            ]}
            placeholder={place_holder}
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'} // Dark mode placeholder color
            keyboardType={keyboard_type}
            returnKeyType={return_key_type}
            value={value}
            secureTextEntry={secure_text_entry}
            onChangeText={setValue}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginBottom: 30,
        fontSize: 16,
        color: 'black',  // Default text color (light mode)
        backgroundColor: 'white', // Default background color (light mode)
    },
    inputDark: {  // Styles for dark mode
        color: 'white', // Dark mode text color
        backgroundColor: '#1e1e1e', // Dark mode background color (or similar)
        borderColor: '#555', // Dark mode border color (optional)
    },
});

export default InputField;