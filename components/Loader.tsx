import React from 'react';
import { ActivityIndicator, StyleSheet, View, useColorScheme } from 'react-native';

const Loader: React.FC = () => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    return (
        <View style={styles.loader}>
            <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#972928'} /> {/* Conditional color */}
        </View>
    );
};

const styles = StyleSheet.create({
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
});

export default Loader;