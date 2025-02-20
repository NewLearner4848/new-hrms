import React from 'react';
import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle, useColorScheme } from 'react-native';
import { Text } from './Themed';
import Colors from '@/constants/Colors';

interface ButtonProps {
    handlePress: () => void;
    text: string;
    backgroundColor?: string;
    style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({ handlePress, text, backgroundColor, style }) => {
    const colorScheme = useColorScheme();

    const buttonStyle = [
        styles.button,
        { backgroundColor: backgroundColor || Colors[colorScheme ?? "light"].button }, // Default based on theme
        style,
    ];

    return (
        <TouchableOpacity onPress={handlePress} style={buttonStyle}>
            <Text>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 30,
    },
});

export default Button;