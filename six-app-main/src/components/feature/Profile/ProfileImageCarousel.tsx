import { Feather } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get('window');

interface ProfileImageCarouselProps {
    profilePhotos: (string | null)[];
    isLoading: boolean;
    uploadingPhotoIndex: number | null;
    onImagePress: (index: number) => void;
    disabled?: boolean;
    showUploadPlaceholders?: boolean;
}

const ProfileImageCarousel: React.FC<ProfileImageCarouselProps> = ({
    profilePhotos,
    isLoading,
    uploadingPhotoIndex,
    onImagePress,
    disabled = false,
    showUploadPlaceholders = true
}) => {
    const carouselRef = useRef<ICarouselInstance>(null);
    const itemWidth = screenWidth * 0.85; 

    // Filter out null/empty photos if not showing placeholders
    const validPhotos = showUploadPlaceholders 
        ? profilePhotos 
        : profilePhotos.filter(photo => photo && photo.trim() !== '');

    // Ensure we always have 3 items for editing mode, or just show valid photos for read-only
    const carouselData = showUploadPlaceholders 
        ? [
            profilePhotos[0] || null,
            profilePhotos[1] || null,
            profilePhotos[2] || null,
          ]
        : validPhotos;

    const renderProfileImage = (imageUrl: string | null, index: number) => {
        const isUploading = uploadingPhotoIndex === index;
        
        if (isUploading) {
            return (
                <View style={styles.uploadContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.uploadText}>Uploading...</Text>
                </View>
            );
        }

        if (imageUrl) {
            return (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.profileImage}
                />
            );
        }

        // Only show upload placeholder if showUploadPlaceholders is true
        if (showUploadPlaceholders) {
            return (
                <View style={styles.uploadContainer}>
                    <Feather name="upload" size={50} color="#666" />
                    <Text style={styles.uploadText}>Upload Photo {index + 1}</Text>
                </View>
            );
        }

        // Return null if no placeholder should be shown
        return null;
    };

    return (
        <View style={styles.carouselContainer}>
            <Carousel
                ref={carouselRef}
                data={carouselData}
                height={350}
                loop={false}
                pagingEnabled={true}
                snapEnabled={true}
                width={itemWidth}
                style={styles.carousel}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                }}
                renderItem={({ item, index }: { item: string | null; index: number }) => (
                    <TouchableOpacity
                        style={styles.imageContainer}
                        onPress={() => onImagePress(index)}
                        disabled={disabled || isLoading}
                    >
                        {renderProfileImage(item, index)}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        alignItems: 'center',
        marginTop: 50,
        height: 350,
    },
    carousel: {
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    uploadContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    uploadText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
        fontFamily: 'TimesNewRomanRegular',
        textAlign: 'center',
    },
});

export default ProfileImageCarousel; 