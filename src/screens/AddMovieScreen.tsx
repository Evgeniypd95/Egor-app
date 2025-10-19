import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';
import { extractImdbId, fetchMovieByImdbId, isValidImdbUrl } from '../services/omdbService';
import { addMovie, checkMovieExists } from '../services/movieService';
import { OMDBMovie } from '../types';

export default function AddMovieScreen({ navigation }: any) {
  const { user } = useAuth();
  const { refreshMovies } = useMovies();
  const [imdbUrl, setImdbUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [movieData, setMovieData] = useState<OMDBMovie | null>(null);
  const [watchedDate, setWatchedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userRating, setUserRating] = useState('');
  const [notes, setNotes] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleFetchMovie = async () => {
    if (!imdbUrl.trim()) {
      Alert.alert('Error', 'Please enter an IMDB URL');
      return;
    }

    if (!isValidImdbUrl(imdbUrl)) {
      Alert.alert('Error', 'Please enter a valid IMDB URL');
      return;
    }

    const imdbId = extractImdbId(imdbUrl);
    if (!imdbId) {
      Alert.alert('Error', 'Could not extract IMDB ID from URL');
      return;
    }

    // Check if movie already exists
    if (user) {
      const exists = await checkMovieExists(user.uid, imdbId);
      if (exists) {
        Alert.alert('Already Added', 'This movie is already in your collection');
        return;
      }
    }

    try {
      setLoading(true);
      const data = await fetchMovieByImdbId(imdbId);
      if (data) {
        setMovieData(data);
      } else {
        Alert.alert('Error', 'Movie not found');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMovie = async () => {
    if (!movieData || !user) return;

    const rating = parseFloat(userRating);
    if (isNaN(rating) || rating < 1 || rating > 10) {
      Alert.alert('Error', 'Please enter a rating between 1 and 10');
      return;
    }

    try {
      setSaving(true);
      await addMovie({
        userId: user.uid,
        imdbId: movieData.imdbID,
        imdbUrl,
        title: movieData.Title,
        year: movieData.Year,
        poster: movieData.Poster,
        director: movieData.Director,
        actors: movieData.Actors,
        plot: movieData.Plot,
        genre: movieData.Genre,
        runtime: movieData.Runtime,
        imdbRating: parseFloat(movieData.imdbRating) || 0,
        userRating: rating,
        watchedDate: Timestamp.fromDate(watchedDate),
        notes,
        isPublic,
      });

      await refreshMovies();
      Alert.alert('Success', 'Movie added to your collection!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setImdbUrl('');
            setMovieData(null);
            setUserRating('');
            setNotes('');
            setWatchedDate(new Date());
            navigation.navigate('Movies');
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Add Movie</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="IMDB URL (e.g., https://www.imdb.com/title/tt0111161/)"
              value={imdbUrl}
              onChangeText={setImdbUrl}
              autoCapitalize="none"
              editable={!loading && !movieData}
            />
            <TouchableOpacity
              style={[styles.fetchButton, loading && styles.buttonDisabled]}
              onPress={handleFetchMovie}
              disabled={loading || !!movieData}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Fetch Movie</Text>
              )}
            </TouchableOpacity>
          </View>

          {movieData && (
            <View style={styles.movieInfo}>
              {movieData.Poster !== 'N/A' && (
                <Image source={{ uri: movieData.Poster }} style={styles.poster} />
              )}
              <Text style={styles.movieTitle}>{movieData.Title}</Text>
              <Text style={styles.movieMeta}>
                {movieData.Year} • {movieData.Runtime} • IMDB: {movieData.imdbRating}
              </Text>
              <Text style={styles.movieDirector}>Directed by {movieData.Director}</Text>
              <Text style={styles.moviePlot}>{movieData.Plot}</Text>

              <View style={styles.formSection}>
                <Text style={styles.label}>Date Watched</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>{watchedDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={watchedDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setWatchedDate(selectedDate);
                      }
                    }}
                    maximumDate={new Date()}
                  />
                )}

                <Text style={styles.label}>Your Rating (1-10)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="8.5"
                  value={userRating}
                  onChangeText={setUserRating}
                  keyboardType="decimal-pad"
                />

                <Text style={styles.label}>Notes (optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Your thoughts about the movie..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                />

                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setIsPublic(!isPublic)}
                >
                  <View style={[styles.checkbox, isPublic && styles.checkboxChecked]}>
                    {isPublic && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>Make this public</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveButton, saving && styles.buttonDisabled]}
                  onPress={handleSaveMovie}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Save Movie</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setMovieData(null);
                    setImdbUrl('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a1a1a',
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  fetchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  movieInfo: {
    alignItems: 'center',
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  movieMeta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  movieDirector: {
    fontSize: 16,
    color: '#444',
    marginBottom: 12,
  },
  moviePlot: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  formSection: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  dateButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#1a1a1a',
  },
});
