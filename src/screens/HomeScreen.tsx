import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { stats, loading, refreshMovies } = useMovies();
  const { userData } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshMovies} />
        }
      >
        <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {userData?.displayName || 'User'}!</Text>
        <Text style={styles.subGreeting}>Track your movie journey</Text>
      </View>

      {/* Stats Widget */}
      <View style={styles.widgetContainer}>
        <Text style={styles.widgetTitle}>Your Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalMovies}</Text>
            <Text style={styles.statLabel}>Total Movies</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.averageRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.moviesThisMonth}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.moviesThisYear}</Text>
            <Text style={styles.statLabel}>This Year</Text>
          </View>
        </View>
      </View>

      {/* Top Genres Widget */}
      {Object.keys(stats.topGenres).length > 0 && (
        <View style={styles.widgetContainer}>
          <Text style={styles.widgetTitle}>Top Genres</Text>
          <View style={styles.genreList}>
            {Object.entries(stats.topGenres)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([genre, count]) => (
                <View key={genre} style={styles.genreItem}>
                  <Text style={styles.genreText}>{genre}</Text>
                  <View style={styles.genreBadge}>
                    <Text style={styles.genreCount}>{count}</Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.widgetContainer}>
        <Text style={styles.widgetTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            console.log('[HOME] Add Movie button pressed');
            navigation.navigate('AddMovie');
          }}
        >
          <Text style={styles.actionButtonText}>Add New Movie</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#007AFF', // Match header color
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  widgetContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  widgetTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  genreList: {
    gap: 12,
  },
  genreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  genreText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  genreBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  genreCount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
