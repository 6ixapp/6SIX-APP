import { PostTabs } from '@/src/constants/types/postTabs.types';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  degrees: string[];
  selectedTab: PostTabs;
  onSelectTab: (tab: PostTabs) => void;
};

const PostTabSelector = ({ degrees, selectedTab, onSelectTab }: Props) => {
  return (
    <View style={styles.tabsSection}>
      {/* <View style={styles.tabsLeft}> */}
        <TouchableOpacity onPress={() => onSelectTab(PostTabs.AllPosts)}>
          {selectedTab === PostTabs.AllPosts ? (
            <LinearGradient
              colors={['#ff66c4', '#5170ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tabButtonActive}
            >
              <Text style={styles.tabTextActive}>Posts</Text>
            </LinearGradient>
          ) : (
            <View style={styles.tabButtonInactive}>
              <Text style={styles.tabTextInactive}>Posts</Text>
            </View>
          )}
        </TouchableOpacity>
      {/* </View> */}

      {/* <View style={styles.tabsRight}> */}
        {degrees.map((degree, index) => {
          const tabKey = (index + 1).toString() as PostTabs;
          const isActive = selectedTab === tabKey;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectTab(tabKey)}
              style={[
                styles.degreeButton,
                isActive && styles.degreeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.degreeText,
                  isActive && styles.degreeTextActive,
                ]}
              >
                {degree}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    // </View>
  );
};

const styles = StyleSheet.create({
    tabsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tabsLeft: {
    flexDirection: 'row',
  },
  tabsRight: {
    flexDirection: 'row',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  tabButtonActive: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabButtonInactive: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabTextInactive: {
    color: '#333',
    textAlign: 'center',
  },
  degreeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 8,
  },
  degreeButtonActive: {
    backgroundColor: '#E5E7EB',
  },
  degreeText: {
    color: '#333',
    textAlign: 'center',
  },
  degreeTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },

})

export default PostTabSelector;