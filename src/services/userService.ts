import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, UserSearchResult, FollowRelationship } from '../types';

// Search users by display name or profile URL
export const searchUsers = async (searchTerm: string, currentUserId: string): Promise<UserSearchResult[]> => {
  try {
    console.log('[USER_SERVICE] Searching users with term:', searchTerm);
    
    if (!searchTerm.trim()) {
      return [];
    }

    // Search by display name (case insensitive)
    const displayNameQuery = query(
      collection(db, 'users'),
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff'),
      where('publicProfileEnabled', '==', true),
      limit(20)
    );

    // Search by profile URL (case insensitive)
    const profileUrlQuery = query(
      collection(db, 'users'),
      where('profileUrl', '>=', searchTerm.toLowerCase()),
      where('profileUrl', '<=', searchTerm.toLowerCase() + '\uf8ff'),
      where('publicProfileEnabled', '==', true),
      limit(20)
    );

    const [displayNameSnapshot, profileUrlSnapshot] = await Promise.all([
      getDocs(displayNameQuery),
      getDocs(profileUrlQuery)
    ]);

    const usersMap = new Map<string, UserSearchResult>();

    // Process display name results
    displayNameSnapshot.forEach((doc) => {
      const userData = doc.data() as User;
      if (userData.uid !== currentUserId) {
        usersMap.set(userData.uid, {
          uid: userData.uid,
          displayName: userData.displayName,
          profileUrl: userData.profileUrl,
          publicProfileEnabled: userData.publicProfileEnabled,
          followersCount: userData.followers?.length || 0,
        });
      }
    });

    // Process profile URL results
    profileUrlSnapshot.forEach((doc) => {
      const userData = doc.data() as User;
      if (userData.uid !== currentUserId) {
        usersMap.set(userData.uid, {
          uid: userData.uid,
          displayName: userData.displayName,
          profileUrl: userData.profileUrl,
          publicProfileEnabled: userData.publicProfileEnabled,
          followersCount: userData.followers?.length || 0,
        });
      }
    });

    // Check which users the current user is following
    const followingQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', currentUserId)
    );
    const followingSnapshot = await getDocs(followingQuery);
    const followingIds = new Set<string>();
    followingSnapshot.forEach((doc) => {
      const followData = doc.data() as FollowRelationship;
      followingIds.add(followData.followingId);
    });

    // Add following status to results
    const results = Array.from(usersMap.values()).map(user => ({
      ...user,
      isFollowing: followingIds.has(user.uid)
    }));

    console.log('[USER_SERVICE] Found', results.length, 'users');
    return results;
  } catch (error: any) {
    console.error('[USER_SERVICE] Search error:', error);
    throw new Error(`Failed to search users: ${error.message}`);
  }
};

// Get user by profile URL
export const getUserByProfileUrl = async (profileUrl: string): Promise<User | null> => {
  try {
    console.log('[USER_SERVICE] Getting user by profile URL:', profileUrl);
    
    const q = query(
      collection(db, 'users'),
      where('profileUrl', '==', profileUrl),
      where('publicProfileEnabled', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { uid: doc.id, ...doc.data() } as User;
    }
    
    return null;
  } catch (error: any) {
    console.error('[USER_SERVICE] Get user by profile URL error:', error);
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

// Follow a user
export const followUser = async (followerId: string, followingId: string): Promise<void> => {
  try {
    console.log('[USER_SERVICE] Following user:', { followerId, followingId });
    
    // Check if already following
    const existingFollowQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', followerId),
      where('followingId', '==', followingId)
    );
    const existingFollowSnapshot = await getDocs(existingFollowQuery);
    
    if (!existingFollowSnapshot.empty) {
      throw new Error('Already following this user');
    }

    // Create follow relationship
    const followData: Omit<FollowRelationship, 'id'> = {
      followerId,
      followingId,
      createdAt: Timestamp.now(),
    };
    
    await addDoc(collection(db, 'follows'), followData);

    // Update follower's following list
    const followerDoc = doc(db, 'users', followerId);
    const followerSnapshot = await getDoc(followerDoc);
    if (followerSnapshot.exists()) {
      const followerData = followerSnapshot.data() as User;
      const following = followerData.following || [];
      if (!following.includes(followingId)) {
        await updateDoc(followerDoc, {
          following: [...following, followingId]
        });
      }
    }

    // Update following user's followers list
    const followingDoc = doc(db, 'users', followingId);
    const followingSnapshot = await getDoc(followingDoc);
    if (followingSnapshot.exists()) {
      const followingData = followingSnapshot.data() as User;
      const followers = followingData.followers || [];
      if (!followers.includes(followerId)) {
        await updateDoc(followingDoc, {
          followers: [...followers, followerId]
        });
      }
    }

    console.log('[USER_SERVICE] Successfully followed user');
  } catch (error: any) {
    console.error('[USER_SERVICE] Follow error:', error);
    throw new Error(`Failed to follow user: ${error.message}`);
  }
};

// Unfollow a user
export const unfollowUser = async (followerId: string, followingId: string): Promise<void> => {
  try {
    console.log('[USER_SERVICE] Unfollowing user:', { followerId, followingId });
    
    // Find and delete follow relationship
    const followQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', followerId),
      where('followingId', '==', followingId)
    );
    const followSnapshot = await getDocs(followQuery);
    
    if (followSnapshot.empty) {
      throw new Error('Not following this user');
    }

    // Delete the follow relationship
    const followDoc = followSnapshot.docs[0];
    await deleteDoc(followDoc.ref);

    // Update follower's following list
    const followerDoc = doc(db, 'users', followerId);
    const followerSnapshot = await getDoc(followerDoc);
    if (followerSnapshot.exists()) {
      const followerData = followerSnapshot.data() as User;
      const following = followerData.following || [];
      const updatedFollowing = following.filter(id => id !== followingId);
      await updateDoc(followerDoc, {
        following: updatedFollowing
      });
    }

    // Update following user's followers list
    const followingDoc = doc(db, 'users', followingId);
    const followingSnapshot = await getDoc(followingDoc);
    if (followingSnapshot.exists()) {
      const followingData = followingSnapshot.data() as User;
      const followers = followingData.followers || [];
      const updatedFollowers = followers.filter(id => id !== followerId);
      await updateDoc(followingDoc, {
        followers: updatedFollowers
      });
    }

    console.log('[USER_SERVICE] Successfully unfollowed user');
  } catch (error: any) {
    console.error('[USER_SERVICE] Unfollow error:', error);
    throw new Error(`Failed to unfollow user: ${error.message}`);
  }
};

// Get users that the current user is following
export const getFollowingUsers = async (userId: string): Promise<UserSearchResult[]> => {
  try {
    console.log('[USER_SERVICE] Getting following users for:', userId);
    
    const followQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const followSnapshot = await getDocs(followQuery);
    const followingIds = followSnapshot.docs.map(doc => doc.data().followingId);
    
    if (followingIds.length === 0) {
      return [];
    }

    // Get user data for each followed user
    const users: UserSearchResult[] = [];
    for (const followingId of followingIds) {
      const userDoc = await getDoc(doc(db, 'users', followingId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        users.push({
          uid: userData.uid,
          displayName: userData.displayName,
          profileUrl: userData.profileUrl,
          publicProfileEnabled: userData.publicProfileEnabled,
          followersCount: userData.followers?.length || 0,
          isFollowing: true,
        });
      }
    }

    console.log('[USER_SERVICE] Found', users.length, 'following users');
    return users;
  } catch (error: any) {
    console.error('[USER_SERVICE] Get following error:', error);
    throw new Error(`Failed to get following users: ${error.message}`);
  }
};

// Get followers of a user
export const getFollowers = async (userId: string): Promise<UserSearchResult[]> => {
  try {
    console.log('[USER_SERVICE] Getting followers for:', userId);
    
    const followQuery = query(
      collection(db, 'follows'),
      where('followingId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const followSnapshot = await getDocs(followQuery);
    const followerIds = followSnapshot.docs.map(doc => doc.data().followerId);
    
    if (followerIds.length === 0) {
      return [];
    }

    // Get user data for each follower
    const users: UserSearchResult[] = [];
    for (const followerId of followerIds) {
      const userDoc = await getDoc(doc(db, 'users', followerId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        users.push({
          uid: userData.uid,
          displayName: userData.displayName,
          profileUrl: userData.profileUrl,
          publicProfileEnabled: userData.publicProfileEnabled,
          followersCount: userData.followers?.length || 0,
          isFollowing: false, // We don't need to check this for followers
        });
      }
    }

    console.log('[USER_SERVICE] Found', users.length, 'followers');
    return users;
  } catch (error: any) {
    console.error('[USER_SERVICE] Get followers error:', error);
    throw new Error(`Failed to get followers: ${error.message}`);
  }
};

// Check if user is following another user
export const isFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  try {
    const followQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', followerId),
      where('followingId', '==', followingId)
    );
    
    const followSnapshot = await getDocs(followQuery);
    return !followSnapshot.empty;
  } catch (error: any) {
    console.error('[USER_SERVICE] Check following error:', error);
    return false;
  }
};
