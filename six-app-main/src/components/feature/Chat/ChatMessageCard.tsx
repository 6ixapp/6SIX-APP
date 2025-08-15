import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ConnectionModal from '../../common/ConnectionModal';
import ProfileImage from '../Profile/ProfileImage';

interface MessageType {
    id: string;
    sender_id: string;
    name: string;
    profile_photos?: string[];
    message: string;
    timestamp: Date;
    isOwnMessage?: boolean;
    other_user_id?: string;
    keyword_summary?: string[];
    unread_count?: number;
    connection_degree?: number;
    connection_mutuals?: number;
}

interface ChatMessageCardProps {
    message: MessageType;
    onRemoveConnection?: (chatUserId: string) => void;
    onRemoveChat?: (chatId: string, chatUserId: string) => void;    
}

const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
};

const   ChatMessageCard = ({ message, onRemoveConnection, onRemoveChat }: ChatMessageCardProps) => {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const cardRef = useRef<any>(null);

    const handleLongPress = () => {
        setModalVisible(true);
    };

    const handleRemoveConnection = () => {
        if (onRemoveConnection) {
            onRemoveConnection(message.sender_id);    
        }
    };

    const handleRemoveChat = () => {
        if (onRemoveChat) {
            onRemoveChat(message.id, message.sender_id);
        }
    };

    const renderMessageContent = () => {
        return (
            <Text style={[styles.messageText, message.unread_count && message.unread_count > 0 ? styles.unreadMsgText : {}]} numberOfLines={1}>
                {message.message}
            </Text>
        );
    }
    

    return (
        <View>
            <TouchableOpacity
                ref={cardRef}
                style={styles.messageCard}
                onPress={() => router.push({
                    pathname: '/chat/[id]',
                    params: {
                        id: message.id,
                        name: message.name,
                        profile_photos: message.profile_photos,
                        sender_id: message.sender_id,
                        keyword_summary: message.keyword_summary,
                        connection_degree: message.connection_degree?.toString(),
                        connection_mutuals: message.connection_mutuals?.toString()
                    }
                })}
                onLongPress={handleLongPress}
                delayLongPress={500}
            >
                <ProfileImage
                    imageUrl={message.profile_photos?.[0] || null}
                    name={message.name || 'User'}
                    size={60}
                />
                <View style={styles.messageContent}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>{message.name}</Text>
                        <Text style={styles.timeText}>
                            {getTimeAgo(message.timestamp)}
                        </Text>
                    </View>
                    <View style={styles.messageContainer}>
                        {renderMessageContent()}
                        <View style={[styles.unreadCountContainer, {
                            backgroundColor: message.unread_count && message.unread_count > 0 ? '#9191ff' : '#fff'
                        }]}>
                            <Text style={styles.unreadCountText}>{message.unread_count && message.unread_count > 99 ? '99+' : message.unread_count}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <ConnectionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                handleRemoveConnection={handleRemoveConnection}
                handleRemoveChat={handleRemoveChat}
                userName={message.name}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    messageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    name: {
        fontSize: 18,
        fontWeight: '500',
        marginRight: 5,
    },
    messageContent: {
        flex: 1,
        marginLeft: 15,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    messageText: {
        fontSize: 14,
        color: '#666',
        marginTop: 3,
        width: '80%',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    timeText: {
        fontSize: 12,
        color: '#999',
        marginLeft: 'auto',
    },
    unreadCountContainer: {
        backgroundColor: '#9191ff',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,

    },
    unreadCountText: {
        color: '#fff',
        fontSize: 12,
    },
    unreadMsgText: {
        color: '#000',
        fontWeight: '500',
    }
});

export default ChatMessageCard;