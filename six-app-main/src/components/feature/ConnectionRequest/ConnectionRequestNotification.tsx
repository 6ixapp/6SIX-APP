import { supabase } from '@/src/db/supabase';
import { logger } from '@/src/service/logger.service';
import { fetchPostRequests } from '@/src/service/request.service';
import { useConnectionRequestStore } from '@/src/store/connectionRequest';
import { useUserStore } from '@/src/store/userStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ConnectionRequestNotification = () => {
    const router = useRouter();
    const { user } = useUserStore();
    const { requests, setRequests } = useConnectionRequestStore()
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user?.id) return;

        loadRequests();

        // Subscribe to post_reactions changes where post_owner_id === user.id
        const subscription = supabase
            .channel('public:post_reactions')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'post_reactions',
                    filter: `post_owner_id=eq.${user.id}`,
                },  
                (payload) => {
                    loadRequests();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user?.id]);


    const loadRequests = async () => {
        if (!user?.id || !user?.name) return;

        try {
            setIsLoading(true);
            const response = await fetchPostRequests(user.id, user.name);
            if (response.success) {
                setRequests(response.data);
            }
        } catch (error) {
            logger.error('loadRequests', 'Error loading requests:', error as string);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => router.push('/request')}
            disabled={isLoading}
        >
            <View style={styles.content}>
                <Image
                    source={require('@/src/assets/images/icon.png')}
                    style={styles.avatar}
                />
                <View style={styles.messageContainer}>
                    <Text style={styles.title}>Six</Text>
                    <Text style={styles.message}>
                        You have {requests.length} new connection {requests.length === 1 ? 'request' : 'requests'}
                    </Text>
                </View>
                {isLoading && (
                    <ActivityIndicator size="small" color="#666" style={styles.loader} />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        marginHorizontal: 1,
        marginVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    messageContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'TimesNewRomanBold',
    },
    message: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'TimesNewRomanRegular',
    },
    loader: {
        marginLeft: 8,
    },
});

export default ConnectionRequestNotification;