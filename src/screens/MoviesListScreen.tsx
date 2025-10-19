import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useMovies } from '../context/MovieContext';
import { Movie } from '../types';

export default function MoviesListScreen({ navigation }: any) {
  const { movies, loading, refreshMovies } = useMovies();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'title'>('date');

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.watchedDate.seconds - a.watchedDate.seconds;
      case 'rating':
        return b.userRating - a.userRating;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const renderMovie = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
    >
      {item.poster !== 'N/A' ? (
        <Image source={{ uri: item.poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Text style={styles.noPosterText}>No Image</Text>
        </View>
      )}
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.movieYear}>{item.year}</Text>
        <View style={styles.ratingContainer}>
          <View style={styles.rating}>
            <Text style={styles.ratingLabel}>Your Rating:</Text>
            <Text style={styles.ratingValue}>{item.userRating}/10</Text>
          </View>
          <Text style={styles.watchDate}>
            {item.watchedDate.toDate().toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}
            onPress={() => setSortBy('date')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>
              Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
            onPress={() => setSortBy('rating')}
          >
            <Text
              style={[styles.sortButtonText, sortBy === 'rating' && styles.sortButtonTextActive]}
            >
              Rating
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'title' && styles.sortButtonActive]}
            onPress={() => setSortBy('title')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'title' && styles.sortButtonTextActive]}>
              Title
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {sortedMovies.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No movies found' : 'No movies yet'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {searchQuery ? 'Try a different search' : 'Add your first movie to get started!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedMovies}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshMovies} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 8,
  },
  movieCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    width: '100%',
    height: 220,
    backgroundColor: '#e0e0e0',
  },
  noPoster: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    color: '#999',
    fontSize: 14,
  },
  movieInfo: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  movieYear: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    gap: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#666',
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  watchDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
