import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  ScrollView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';

export default function PublicProfileScreen({ navigation }: any) {
  const { userData } = useAuth();
  const { movies, stats } = useMovies();

  const publicMovies = movies.filter((m) => m.isPublic);
  const profileUrl = `https://movietracker.app/u/${userData?.profileUrl}`;

  const handleCopyLink = async () => {
    console.log('[PUBLIC_PROFILE] Copy link pressed');
    await Clipboard.setStringAsync(profileUrl);
    Alert.alert('Copied!', 'Profile link copied to clipboard');
  };

  const handleShare = async () => {
    console.log('[PUBLIC_PROFILE] Share pressed');
    try {
      await Share.share({
        message: `Check out my movie collection! ${profileUrl}`,
        url: profileUrl,
      });
    } catch (error: any) {
      console.error('[PUBLIC_PROFILE] Share error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Public Profile</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.content}>
          {/* Profile Info */}
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData?.displayName?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text style={styles.displayName}>{userData?.displayName}</Text>
            <Text style={styles.profileUrlText}>@{userData?.profileUrl}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{publicMovies.length}</Text>
              <Text style={styles.statLabel}>Public Movies</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalMovies}</Text>
              <Text style={styles.statLabel}>Total Movies</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.averageRating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>

          {/* Profile Link */}
          <View style={styles.linkSection}>
            <Text style={styles.sectionTitle}>Your Profile Link</Text>
            <View style={styles.linkBox}>
              <Text style={styles.linkText} numberOfLines={1}>
                {profileUrl}
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
                <Text style={styles.copyButtonText}>📋 Copy Link</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <Text style={styles.shareButtonText}>📤 Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              📌 Share this link with friends to show them your movie collection!
            </Text>
            <Text style={styles.infoText}>
              🔒 Only movies marked as "public" will be visible to others.
            </Text>
          </View>

          {/* Preview */}
          {publicMovies.length === 0 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ You don't have any public movies yet. Mark some movies as public to share your
                collection!
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  profileUrlText: {
    fontSize: 16,
    color: '#666',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  linkSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  linkBox: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  copyButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#f0f8ff',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});
