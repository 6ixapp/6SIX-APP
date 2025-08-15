import HeaderText from '@/src/components/common/HeaderText';
import CategoryTabSelector from '@/src/components/feature/Home/CategoryTabSelector';
import PostTabSelector from '@/src/components/feature/Home/PostTabSelector';
import { PostsList } from '@/src/components/feature/Post/PostList';
import FlexiblePostComponent from '@/src/components/feature/Post/PostModal';
import ProfileImage from '@/src/components/feature/Profile/ProfileImage';
import { CategoryTabs } from '@/src/constants/types/categoryTabs';
import { PostTabs } from '@/src/constants/types/postTabs.types';
import { useAuth } from '@/src/context/AuthContext';
import { logger } from '@/src/service/logger.service';
import { fetchUserProfile } from '@/src/service/profile.service';
import { usePostModalStore } from '@/src/store/postModalStore';
import { useUserStore } from '@/src/store/userStore';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const HomeScreen: FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { user: userProfile, setUser } = useUserStore();
  const { showPostModal } = useLocalSearchParams<{ showPostModal?: string }>();
  const [postTabs, setPostTabs] = useState<PostTabs>(PostTabs.AllPosts);
  const [categoryTabs, setCategoryTabs] = useState<CategoryTabs[]>([]);
  const { isHomePostModalVisible, setHomePostModalVisible } = usePostModalStore();
  const modalScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showPostModal) {
      setHomePostModalVisible(true);
    }
  }, [showPostModal]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          const profileResponse = await fetchUserProfile(user.id);
          if (profileResponse.success && profileResponse.data) {
            setUser(profileResponse.data);
          }
        }
      } catch (e) {
        logger.error('loadData useEffect: Index.tsx', 'Error loading data:', e as string);
      }
    };

    loadData();
  }, [user]);


  const toggleCategoryTab = (tab: CategoryTabs) => {
    setCategoryTabs(prev =>
      prev.includes(tab)
        ? prev.filter(t => t !== tab)
        : [...prev, tab]
    );
  };

  const showModal = () => {
    setHomePostModalVisible(true);
    Animated.spring(modalScaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 40,
      friction: 10,
    }).start();
  };

  const hideModal = (didPost?: boolean) => {
    Animated.timing(modalScaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setHomePostModalVisible(false);
      if (didPost) {
      }
    });
  };


  const tabs = Object.values(CategoryTabs);
  const degrees = ['1°', '2°', '3°'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <HeaderText title='Six' />
        <TouchableOpacity onPress={() => router.push('/(protected)/profile')}>
          <ProfileImage
            imageUrl={userProfile?.profile_photos?.[0]}
            name={userProfile?.name || ''}
            size={40}
          />
        </TouchableOpacity>
      </View>



      {/* Share input */}
      {!isHomePostModalVisible &&
        <TouchableOpacity
          style={styles.shareContainer}
          onPress={showModal}
        >
          <Text style={styles.shareInput}>
            Share something
          </Text>
        </TouchableOpacity>
      }

      {isHomePostModalVisible && (
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => { }}>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ scale: modalScaleAnim }]
                }
              ]}
            >
              <FlexiblePostComponent
                isModal={false}
                visible={isHomePostModalVisible}
                onClose={hideModal}
                postTabs={postTabs}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      )}

      <View style={styles.filterContainer}>
        {/* PostTabs section */}
        <PostTabSelector
          degrees={degrees}
          selectedTab={postTabs}
          onSelectTab={setPostTabs}
        />

        {/* Category tabs */}
        <CategoryTabSelector
          onToggle={toggleCategoryTab}
          selectedTabs={categoryTabs}
          tabs={tabs}
        />
      </View>

      {user &&
        <PostsList
          userId={user?.id}
          postTabs={postTabs}
          categoryTabs={categoryTabs}
        />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  shareContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  shareInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 20,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    paddingVertical: 16
  },
  modalOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '90%',
  }
});

export default HomeScreen;