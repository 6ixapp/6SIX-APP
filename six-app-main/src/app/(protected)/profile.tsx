import SharingCard from '@/src/components/common/SharingCard';
import EditProfileModal from '@/src/components/feature/Profile/EditProfileModal';
import ProfileHeader from '@/src/components/feature/Profile/ProfileHeader';
import ProfileImageCarousel from '@/src/components/feature/Profile/ProfileImageCarousel';
import ProfileInfo from '@/src/components/feature/Profile/ProfileInfo';
import SyncingIndicator from '@/src/components/feature/Profile/SyncingIndicator';
import { useProfile } from '@/src/hooks/useProfile';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
    const { 
        userProfile,
        isLoading,
        uploadingPhotoIndex,
        isEditModalVisible,
        isLoadingContacts,
        isSyncing, 
        pickImage,
        handleEditProfile,
        handleSyncContacts,
        logout,
        setIsEditModalVisible,
        getProfilePhotos,
    } = useProfile();

    const handleImagePress = (index: number) => {
        pickImage(index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <ProfileHeader
                    onSyncContacts={handleSyncContacts}
                    onEditProfile={() => setIsEditModalVisible(true)}
                    onLogout={logout}
                    isLoading={isLoading}
                    isSyncing={isSyncing}
                    isLoadingContacts={isLoadingContacts}
                />

                <ProfileImageCarousel
                    profilePhotos={getProfilePhotos()}
                    isLoading={isLoading}
                    uploadingPhotoIndex={uploadingPhotoIndex}
                    onImagePress={handleImagePress}
                    disabled={isSyncing || isLoadingContacts}
                />

                <ProfileInfo
                    name={userProfile?.name}
                    traits={userProfile?.keyword_summary}
                />

                <View style={styles.sharingCardContainer}>
                    <SharingCard />
                </View>

                <SyncingIndicator
                    isSyncing={isSyncing}
                    isLoadingContacts={isLoadingContacts}
                />
            </ScrollView>

            <EditProfileModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                onSave={handleEditProfile}
                initialName={userProfile?.name || ''}
                initialTraits={userProfile?.keyword_summary || ['', '', '']}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    sharingCardContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 50,
    },
});

export default Profile;