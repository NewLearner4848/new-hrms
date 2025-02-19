import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, useColorScheme } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSession } from '@/shared/ctx';

interface LogoutButtonProps {
  style?: StyleProp<ViewStyle>; // Add style prop
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ style }) => {
    const { signOut } = useSession();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const handleLogout = () => {
        signOut();
    };

    return (
        <TouchableOpacity onPress={handleLogout} style={[{ marginRight: 15 }, style]}> {/* Combine styles */}
            <FontAwesome 
                name="sign-out" 
                size={20} 
                style={{
                    marginBottom: -3,
                    padding: 3,
                    borderWidth: 1,
                    borderColor: isDarkMode ? '#fff' : '#972928',
                    borderRadius: 3,
                }} 
                color={isDarkMode ? '#fff' : '#972928'} 
            />
        </TouchableOpacity>
    );
};

export default LogoutButton;