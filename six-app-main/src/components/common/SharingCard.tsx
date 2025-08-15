import { logger } from '@/src/service/logger.service';
import { Octicons } from '@expo/vector-icons';
import React from 'react';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SharingCardProps {
    contactsCount?: number;
}

const SharingCard: React.FC<SharingCardProps> = ({ contactsCount = 0 }) => {
    const handleShare = async () => {
        try {
            await Share.share({
                message: 'Join me on Six! https://sixsocialapp.com'
            });
        } catch (error) {
            logger.error('SharingCard: handleShare', 'Error sharing:', error as string);
        }
    };

    return (
        <View style={styles.inviteContainer}>
            <View style={styles.inviteContent}>
                <View style={styles.inviteIconContainer}>
                    <Octicons name="person-add" size={24} color="#9191ff" />
                </View>
                <View style={styles.inviteTextContainer}>
                    <Text style={styles.inviteTitle}>Invite your contacts</Text>
                    <Text style={styles.inviteSubtitle}>
                        Help your network{'\n'}
                        grow on Six
                    </Text>
                    {contactsCount > 0 && (
                        <Text style={styles.contactCount}>
                            {contactsCount} contacts found
                        </Text>
                    )}
                </View>
            </View>
            <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
            >
                <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    inviteContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        padding: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        gap: 10
    },
    inviteContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inviteIconContainer: {
        marginRight: 15,
    },
    inviteTextContainer: {
        flex: 1,
        marginRight: 16,
    },
    inviteTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 4,
    },
    inviteSubtitle: {
        fontSize: 14,
        color: '#888',
        lineHeight: 18,
    },
    shareButton: {
        backgroundColor: '#9191ff',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    shareButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    contactCount: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
})

export default SharingCard