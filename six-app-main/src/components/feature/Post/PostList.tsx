import { CategoryTabs } from '@/src/constants/types/categoryTabs';
import { PostTabs } from '@/src/constants/types/postTabs.types';
import { logger } from '@/src/service/logger.service';
import { fetchPostsByDegree } from '@/src/service/post.service';
import { usePostStore } from '@/src/store/postStore';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import PostCard from './PostCard';

interface PostsListProps {
  userId: string;
  postTabs: PostTabs;
  categoryTabs: CategoryTabs[];
}

interface PaginationState {
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  totalFetched: number;
}

export const PostsList: React.FC<PostsListProps> = ({
  userId,
  postTabs,
  categoryTabs,
}) => {
  const { posts, setPosts, addPosts, clearPosts } = usePostStore();
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    hasMore: true,
    isLoading: false,
    isLoadingMore: false,
    totalFetched: 0
  });
  const [error, setError] = useState<string | null>(null);

  const isLoadingRef = useRef(false);
  const lastScrollY = useRef(0);

  const degreeFilter = useMemo(() => {
    const degreeMap = {
      [PostTabs.FirstDegree]: 1,
      [PostTabs.SecondDegree]: 2,
      [PostTabs.ThirdDegree]: 3,
      [PostTabs.AllPosts]: 0,
    };
    return degreeMap[postTabs] ?? 0;
  }, [postTabs]);

  const filteredPosts = useMemo(() => {
    if (categoryTabs.length === 0) return posts;
    return posts.filter(post => categoryTabs.includes(post.category));
  }, [posts, categoryTabs]);

  const loadPosts = useCallback(async (page: number = 1, isLoadMore: boolean = false) => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setPagination(prev => ({ ...prev, isLoading: !isLoadMore, isLoadingMore: isLoadMore }));
    setError(null);

    try {
      const response = await fetchPostsByDegree(userId, degreeFilter, page, 20);

      if (response?.success && response.data) {
        const { posts: newPosts, pagination: paginationInfo } = response.data;

        page === 1 ? setPosts(newPosts) : addPosts(newPosts);

        setPagination(prev => ({
          ...prev,
          currentPage: paginationInfo.currentPage,
          hasMore: paginationInfo.hasMore,
          totalFetched: paginationInfo.totalFetched,
          isLoading: false,
          isLoadingMore: false
        }));
      } else {
        throw new Error('Failed to load posts');
      }
    } catch (err) {
      logger.error('PostsList', 'Error loading posts:', err as string);
      setError('Error loading posts');
      setPagination(prev => ({ ...prev, isLoading: false, isLoadingMore: false, hasMore: false }));
    } finally {
      isLoadingRef.current = false;
    }
  }, [userId, degreeFilter, setPosts, addPosts]);

  const loadMorePosts = useCallback(() => {
    if (pagination.hasMore && !isLoadingRef.current) {
      loadPosts(pagination.currentPage + 1, true);
    }
  }, [loadPosts, pagination.hasMore, pagination.currentPage]);

  const handleRefresh = useCallback(async () => {
    clearPosts();
    setRefreshing(true);
    try {
      await loadPosts(1, false);
    } finally {
      setRefreshing(false);
    }
  }, [loadPosts, setRefreshing, clearPosts]);

  const isNearBottom = useCallback((nativeEvent: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const distanceFromEnd = contentSize.height - (layoutMeasurement.height + contentOffset.y);
    const scrollPercentage = (contentOffset.y + layoutMeasurement.height) / contentSize.height;
    const isScrollingDown = contentOffset.y > lastScrollY.current;

    lastScrollY.current = contentOffset.y;

    return isScrollingDown && (distanceFromEnd < 300 || scrollPercentage >= 0.85);
  }, []);

  const handleScroll = useCallback(({ nativeEvent }: any) => {
    if (isNearBottom(nativeEvent)) {
      loadMorePosts();
    }
  }, [isNearBottom, loadMorePosts]);

  useEffect(() => {
    clearPosts();
    setPagination({
      currentPage: 1,
      hasMore: true,
      isLoading: false,
      isLoadingMore: false,
      totalFetched: 0
    });
    setError(null);
    isLoadingRef.current = false;
    loadPosts(1, false);
  }, [userId, degreeFilter]);

  if (pagination.isLoading && posts.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={[styles.statusText, styles.errorText]}>
          Failed to load posts. Pull to refresh.
        </Text>
      </View>
    );
  }

  if (filteredPosts.length === 0 && !pagination.isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.statusText}>
          {categoryTabs.length > 0 ? 'No posts found for selected categories' : 'No posts found'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={true}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#333']}
          tintColor="#333"
        />
      }
    >
      {filteredPosts.map((post, index) => (
        <PostCard key={`${post.id}-${index}`} post={post} />
      ))}

      {pagination.isLoadingMore && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="small" color="#999" />
        </View>
      )}

      {!pagination.hasMore && filteredPosts.length > 0 && (
        <View style={styles.loadingIndicator}>
          <Text style={styles.endText}>You've reached the end</Text>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  statusText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#ff4444',
  },
  loadingIndicator: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endText: {
    color: '#999',
    fontSize: 14,
  },
  bottomPadding: {
    height: 50,
  },
});
