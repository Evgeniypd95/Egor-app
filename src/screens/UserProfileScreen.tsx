import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import {
  getUserByProfileUrl,
  followUser,
  unfollowUser,
  isFollowing,
} from "../services/userService";
import { getUserData } from "../services/authService";
import { getPublicMovies } from "../services/movieService";
import { User, Movie } from "../types";

interface UserProfileScreenProps {
  route: {
    params: {
      userId: string;
    };
  };
  navigation: any;
}

export default function UserProfileScreen({
  route,
  navigation,
}: UserProfileScreenProps) {
  const { user } = useAuth();
  const { userId } = route.params;
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [publicMovies, setPublicMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log("[USER_PROFILE] Loading profile for userId:", userId);

      // Get user data - try both user ID and profile URL
      let userData: User | null = null;

      // First try to get by user ID (if userId is actually a UID)
      try {
        console.log("[USER_PROFILE] Trying to get user by UID...");
        userData = await getUserData(userId);
        console.log("[USER_PROFILE] User found by UID:", userData?.displayName);
      } catch (error) {
        console.log("[USER_PROFILE] Not a user ID, trying profile URL");
      }

      // If not found by user ID, try by profile URL
      if (!userData) {
        console.log("[USER_PROFILE] Trying to get user by profile URL...");
        userData = await getUserByProfileUrl(userId);
        console.log(
          "[USER_PROFILE] User found by profile URL:",
          userData?.displayName,
        );
      }

      if (!userData) {
        console.log("[USER_PROFILE] User not found with either method");
        Alert.alert("Error", "User not found or profile is private");
        navigation.goBack();
        return;
      }

      // Check if user has public profile enabled
      console.log(
        "[USER_PROFILE] User public profile enabled:",
        userData.publicProfileEnabled,
      );
      if (!userData.publicProfileEnabled) {
        Alert.alert("Error", "This user's profile is private");
        navigation.goBack();
        return;
      }

      setUserProfile(userData);

      // Get public movies
      const movies = await getPublicMovies(userData.uid);
      setPublicMovies(movies);

      // Check if current user is following this user
      const following = await isFollowing(user.uid, userData.uid);
      setIsFollowingUser(following);
    } catch (error: any) {
      console.error("[USER_PROFILE] Error loading profile:", error);
      Alert.alert("Error", "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user || !userProfile) return;

    try {
      setFollowLoading(true);

      if (isFollowingUser) {
        await unfollowUser(user.uid, userProfile.uid);
        setIsFollowingUser(false);
        Alert.alert("Success", `Unfollowed ${userProfile.displayName}`);
      } else {
        await followUser(user.uid, userProfile.uid);
        setIsFollowingUser(true);
        Alert.alert("Success", `Now following ${userProfile.displayName}`);
      }
    } catch (error: any) {
      console.error("[USER_PROFILE] Follow error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setFollowLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserProfile();
    setRefreshing(false);
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View style={styles.movieItem}>
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieYear}>({item.year})</Text>
        <Text style={styles.movieGenre}>{item.genre}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Rating:</Text>
          <Text style={styles.ratingValue}>{item.userRating}/10</Text>
        </View>
        {item.notes && (
          <Text style={styles.movieNotes} numberOfLines={2}>
            "{item.notes}"
          </Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile.displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.displayName}>{userProfile.displayName}</Text>
            <Text style={styles.profileUrl}>@{userProfile.profileUrl}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{publicMovies.length}</Text>
                <Text style={styles.statLabel}>Movies</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {userProfile.followers?.length || 0}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {userProfile.following?.length || 0}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>

            {user && user.uid !== userProfile.uid && (
              <TouchableOpacity
                style={[
                  styles.followButton,
                  isFollowingUser
                    ? styles.unfollowButton
                    : styles.followButtonActive,
                ]}
                onPress={handleFollow}
                disabled={followLoading}
              >
                {followLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={isFollowingUser ? "#666" : "#fff"}
                  />
                ) : (
                  <Text
                    style={[
                      styles.followButtonText,
                      isFollowingUser
                        ? styles.unfollowButtonText
                        : styles.followButtonTextActive,
                    ]}
                  >
                    {isFollowingUser ? "Following" : "Follow"}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Movies Section */}
          <View style={styles.moviesSection}>
            <Text style={styles.sectionTitle}>
              Public Movies ({publicMovies.length})
            </Text>

            {publicMovies.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No public movies yet</Text>
              </View>
            ) : (
              <View style={styles.moviesList}>
                {publicMovies.map((movie) => (
                  <TouchableOpacity
                    key={movie.id}
                    onPress={() =>
                      navigation.navigate("Movies", {
                        screen: "MovieDetails",
                        params: { movieId: movie.id },
                      })
                    }
                  >
                    <View style={styles.movieItem}>
                      {movie.poster && movie.poster !== "N/A" ? (
                        <Image
                          source={{ uri: movie.poster }}
                          style={styles.poster}
                        />
                      ) : (
                        <View style={styles.posterPlaceholder}>
                          <Text style={styles.posterPlaceholderText}>
                            No Image
                          </Text>
                        </View>
                      )}
                      <View style={styles.movieInfo}>
                        <Text style={styles.movieTitle}>{movie.title}</Text>
                        <Text style={styles.movieYear}>({movie.year})</Text>
                        <Text style={styles.movieGenre}>{movie.genre}</Text>
                        <View style={styles.ratingContainer}>
                          <Text style={styles.ratingLabel}>
                            {userProfile.displayName + "'s"} Rating:
                          </Text>
                          <Text style={styles.ratingValue}>
                            {movie.userRating}/10
                          </Text>
                        </View>
                        {movie.notes && (
                          <Text style={styles.movieNotes} numberOfLines={2}>
                            "{movie.notes}"
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  profileUrl: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  followButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
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
    fontSize: 16,
    fontWeight: '600',
  },
  followButtonTextActive: {
    color: '#fff',
  },
  unfollowButtonText: {
    color: '#666',
  },
  moviesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  moviesList: {
    gap: 12,
  },
  movieItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e1e5e9",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  poster: {
    width: 70,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  posterPlaceholder: {
    width: 70,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterPlaceholderText: {
    fontSize: 10,
    color: '#888',
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  movieGenre: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  movieNotes: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
