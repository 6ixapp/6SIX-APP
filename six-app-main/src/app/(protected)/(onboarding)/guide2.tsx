import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Guide2 = () => {  
    const router = useRouter();

    const handleNext = () => {
        router.push('/guide3');
    };

    return (
        <TouchableOpacity 
            style={styles.container} 
            activeOpacity={0.8}
            onPress={handleNext}
        >
            <View style={styles.content}>
                <Text style={styles.title}>
                    Six maps your network using your contacts
                </Text>
                <View style={styles.degreesContainer}>
                    <Text style={styles.degreeItem}>
                        <Text style={styles.degreeHighlight}>1°</Text> - contacts
                    </Text>
                    <Text style={styles.degreeItem}>
                        <Text style={styles.degreeHighlight}>2°</Text> - mutuals
                    </Text>
                    <Text style={styles.degreeItem}>
                        <Text style={styles.degreeHighlight}>3°</Text> - friends of mutuals
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    content: {
        marginTop: 60,
        marginBottom: 30
    },
    title: {
        fontSize: 28,
        fontWeight: '500',
        color: '#000',
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 34,
    },
    degreesContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    degreeItem: {
        fontSize: 18,
        color: '#666',
        marginBottom: 16,
        lineHeight: 24,
    },
    degreeHighlight: {
        color: '#9191ff',
        fontWeight: '600',
    }
});

export default Guide2;