import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, useColorScheme } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSession } from '@/shared/ctx';
import Colors from '@/constants/Colors';

interface LogoutButtonProps {
  style?: StyleProp<ViewStyle>; // Add style prop
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ style }) => {
    const { signOut } = useSession();
    const colorScheme = useColorScheme();

    const handleLogout = () => {
        signOut();
    };

    return (
        <TouchableOpacity onPress={handleLogout} style={[{ marginRight: 15 }, style]}> {/* Combine styles */}
            <FontAwesome 
                name="sign-out" 
                size={20}
                color={Colors[colorScheme ?? "light"].text} 
            />
        </TouchableOpacity>
    );
};

export default LogoutButton;