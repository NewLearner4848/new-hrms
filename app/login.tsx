import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Alert, useColorScheme } from 'react-native';
import { loginUser } from '@/actions/UserActions';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import InputField from '@/components/InputField';
import Checkbox from 'expo-checkbox';
import { useSession } from '@/shared/ctx';
import { router } from 'expo-router';
import { View, Text } from '@/components/Themed';

const LoginScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [isChecked, setIsChecked] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
            if (userData && userData.status && 'result' in userData.data) {
              signIn(userData.data.result);
              router.replace("/(auth)/(tabs)");
            } else {
                Alert.alert('Login Failed', userData?.msg || 'Invalid username or password.');
            }
        } catch (error: any) { // Type the error
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Image
                    source={require('@/resources/hrms-app-logo.png')}
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
                        color={isDarkMode ? '#fff' : '#972928'} // Conditional checkbox color
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={setIsChecked}
                    />
                    <Text>Remember me</Text>
                </View>
                <Button text={'Sign In'} handlePress={handleLogin} backgroundColor={isDarkMode ? '#551a8b' : '#972928'} />
            </View>
            {isLoading && <Loader />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    box: {
        width: '100%',
        padding: 20,
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    logo: {
        width: '100%',
        height: 40,
        marginBottom: 40,
        resizeMode: 'contain',
    },

    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    checkbox: {
        marginRight: 10,
    },

});

export default LoginScreen;