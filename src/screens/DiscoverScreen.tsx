import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { searchUsers, followUser, unfollowUser, getFollowingUsers } from '../services/userService';
import { UserSearchResult } from '../types';

export default function DiscoverScreen({ navigation }: any) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [followingUsers, setFollowingUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'following'>('search');

  useEffect(() => {
    if (user) {
      loadFollowingUsers();
    }
  }, [user]);

  const loadFollowingUsers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const following = await getFollowingUsers(user.uid);
      setFollowingUsers(following);
    } catch (error: any) {
      console.error('[DISCOVER] Error loading following users:', error);
      Alert.alert('Error', 'Failed to load following users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    if (!user || !term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const results = await searchUsers(term, user.uid);
      setSearchResults(results);
    } catch (error: any) {
      console.error('[DISCOVER] Search error:', error);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string, displayName: string) => {
    if (!user) return;

    try {
      await followUser(user.uid, userId);
      Alert.alert('Success', `Now following ${displayName}`);
      
      // Update search results
      setSearchResults(prev => 
        prev.map(user => 
          user.uid === userId 
            ? { ...user, isFollowing: true, followersCount: (user.followersCount || 0) + 1 }
            : user
        )
      );
      
      // Reload following users
      loadFollowingUsers();
    } catch (error: any) {
      console.error('[DISCOVER] Follow error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleUnfollow = async (userId: string, displayName: string) => {
    if (!user) return;

    try {
      await unfollowUser(user.uid, userId);
      Alert.alert('Success', `Unfollowed ${displayName}`);
      
      // Update search results
      setSearchResults(prev => 
        prev.map(user => 
          user.uid === userId 
            ? { ...user, isFollowing: false, followersCount: Math.max((user.followersCount || 1) - 1, 0) }
            : user
        )
      );
      
      // Update following users
      setFollowingUsers(prev => prev.filter(user => user.uid !== userId));
    } catch (error: any) {
      console.error('[DISCOVER] Unfollow error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'following') {
      await loadFollowingUsers();
    }
    setRefreshing(false);
  };

  const renderUserItem = ({ item }: { item: UserSearchResult }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('Profile', { screen: 'UserProfile', params: { userId: item.uid } })}
    >
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.displayName}>{item.displayName}</Text>
          <Text style={styles.profileUrl}>@{item.profileUrl}</Text>
          <Text style={styles.followersCount}>
            {item.followersCount || 0} followers
          </Text>
        </View>
      </View>
      
      {item.uid !== user?.uid && (
        <TouchableOpacity
          style={[
            styles.followButton,
            item.isFollowing ? styles.unfollowButton : styles.followButtonActive
          ]}
          onPress={() => 
            item.isFollowing 
              ? handleUnfollow(item.uid, item.displayName)
              : handleFollow(item.uid, item.displayName)
          }
        >
          <Text style={[
            styles.followButtonText,
            item.isFollowing ? styles.unfollowButtonText : styles.followButtonTextActive
          ]}>
            {item.isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {activeTab === 'search' 
          ? 'Search for users to follow' 
          : 'You\'re not following anyone yet'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
          
          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'search' && styles.activeTab]}
              onPress={() => setActiveTab('search')}
            >
              <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
                Search
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'following' && styles.activeTab]}
              onPress={() => setActiveTab('following')}
            >
              <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>
                Following ({followingUsers.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'search' && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or username..."
              value={searchTerm}
              onChangeText={(text) => {
                setSearchTerm(text);
                handleSearch(text);
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}

        <FlatList
          data={activeTab === 'search' ? searchResults : followingUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.uid}
          ListEmptyComponent={!loading ? renderEmptyState : null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  listContainer: {
    flexGrow: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  profileUrl: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  followersCount: {
    fontSize: 12,
    color: '#999',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  followButtonActive: {
    backgroundColor: '#007AFF',
  },
  unfollowButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  followButtonTextActive: {
    color: '#fff',
  },
  unfollowButtonText: {
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
