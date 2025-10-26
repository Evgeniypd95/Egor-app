import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useMovies } from "../context/MovieContext";
import { searchMoviesByTitle } from "../services/omdbService";
import { addMovie, checkMovieExists } from "../services/movieService";
import { OMDBMovie } from "../types";

export default function AddMovieScreen({ navigation }: any) {
  const { user, userData } = useAuth();
  const { refreshMovies } = useMovies();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchResults, setSearchResults] = useState<OMDBMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<OMDBMovie | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [watchedDate, setWatchedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userRating, setUserRating] = useState("");
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSearchMovies = async () => {
    console.log("[ADD_MOVIE] Search button pressed");
    console.log("[ADD_MOVIE] Search query:", searchQuery);

    if (!searchQuery.trim()) {
      console.log("[ADD_MOVIE] Empty search query");
      Alert.alert("Error", "Please enter a movie title to search");
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      console.log("[ADD_MOVIE] Searching for movies...");
      const results = await searchMoviesByTitle(searchQuery);
      console.log("[ADD_MOVIE] Search results count:", results.length);
      setSearchResults(results);

      if (results.length === 0) {
        Alert.alert("No Results", "No movies found for your search query");
      }
    } catch (error: any) {
      console.error("[ADD_MOVIE] Search error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMovie = async (movie: OMDBMovie) => {
    console.log("[ADD_MOVIE] Movie selected:", movie.Title);

    // Check if movie already exists
    if (user) {
      const exists = await checkMovieExists(user.uid, movie.imdbID);
      if (exists) {
        console.log("[ADD_MOVIE] Movie already exists");
        Alert.alert(
          "Already Added",
          "This movie is already in your collection",
        );
        return;
      }
    }

    setSelectedMovie(movie);
  };

  const handleSaveMovie = async () => {
    console.log("[ADD_MOVIE] Save button pressed");
    if (!selectedMovie || !user) {
      console.error("[ADD_MOVIE] Missing selectedMovie or user");
      return;
    }

    const rating = parseFloat(userRating);
    console.log("[ADD_MOVIE] User rating:", rating);

    if (isNaN(rating) || rating < 1 || rating > 10) {
      console.log("[ADD_MOVIE] Invalid rating");
      Alert.alert("Error", "Please enter a rating between 1 and 10");
      return;
    }

    try {
      setSaving(true);
      console.log("[ADD_MOVIE] Saving movie to Firestore...");

      // Extract Rotten Tomatoes rating if available
      const rottenTomatoesRating = selectedMovie.Ratings?.find(
        (rating) => rating.Source === "Rotten Tomatoes",
      )?.Value;

      await addMovie({
        userId: user.uid,
        userDisplayName: userData?.displayName,
        imdbId: selectedMovie.imdbID,
        imdbUrl: `https://www.imdb.com/title/${selectedMovie.imdbID}/`,
        title: selectedMovie.Title,
        year: selectedMovie.Year,
        poster: selectedMovie.Poster,
        director: selectedMovie.Director,
        actors: selectedMovie.Actors,
        plot: selectedMovie.Plot,
        genre: selectedMovie.Genre,
        runtime: selectedMovie.Runtime,
        imdbRating: parseFloat(selectedMovie.imdbRating) || 0,
        userRating: rating,
        rottenTomatoesRating,
        watchedDate: Timestamp.fromDate(watchedDate),
        notes,
        isPublic,
      });

      console.log("[ADD_MOVIE] Movie saved successfully");
      await refreshMovies();
      console.log("[ADD_MOVIE] Movies refreshed");

      Alert.alert("Success", "Movie added to your collection!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setSearchQuery("");
            setSearchResults([]);
            setSelectedMovie(null);
            setHasSearched(false);
            setUserRating("");
            setNotes("");
            setWatchedDate(new Date());
            navigation.navigate("Movies");
          },
        },
      ]);
    } catch (error: any) {
      console.error("[ADD_MOVIE] Save error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBackToSearch = () => {
    setSelectedMovie(null);
    setUserRating("");
    setNotes("");
    setWatchedDate(new Date());
  };

  const renderMovieItem = (movie: OMDBMovie) => (
    <TouchableOpacity
      key={movie.imdbID}
      style={styles.movieItem}
      onPress={() => handleSelectMovie(movie)}
    >
      {movie.Poster && movie.Poster !== "N/A" ? (
        <Image source={{ uri: movie.Poster }} style={styles.poster} />
      ) : (
        <View style={styles.posterPlaceholder}>
          <Text style={styles.posterPlaceholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{movie.Title}</Text>
        <Text style={styles.movieYear}>({movie.Year})</Text>
        <Text style={styles.movieGenre}>{movie.Genre}</Text>
        <Text style={styles.movieDirector}>Directed by {movie.Director}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>IMDB Rating:</Text>
          <Text style={styles.ratingValue}>{movie.imdbRating}/10</Text>
        </View>
        <Text style={styles.moviePlot} numberOfLines={2}>
          {movie.Plot}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (selectedMovie) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToSearch}
              >
                <Text style={styles.backButtonText}>← Back to Search</Text>
              </TouchableOpacity>

              <View style={styles.selectedMovieInfo}>
                {selectedMovie.Poster !== "N/A" && (
                  <Image
                    source={{ uri: selectedMovie.Poster }}
                    style={styles.posterLarge}
                  />
                )}
                <Text style={styles.movieTitleLarge}>
                  {selectedMovie.Title}
                </Text>
                <Text style={styles.movieMeta}>
                  {selectedMovie.Year} • {selectedMovie.Runtime} • IMDB:{" "}
                  {selectedMovie.imdbRating}
                </Text>
                <Text style={styles.movieDirectorLarge}>
                  Directed by {selectedMovie.Director}
                </Text>
                <Text style={styles.moviePlotLarge}>{selectedMovie.Plot}</Text>

                <View style={styles.formSection}>
                  <Text style={styles.label}>Date Watched</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateText}>
                      {watchedDate.toLocaleDateString()}
                    </Text>
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
                    <View
                      style={[
                        styles.checkbox,
                        isPublic && styles.checkboxChecked,
                      ]}
                    >
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
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>Search Movies</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Search for movies (e.g., The Shawshank Redemption)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="words"
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.searchButton, loading && styles.buttonDisabled]}
                onPress={handleSearchMovies}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Search</Text>
                )}
              </TouchableOpacity>
            </View>

            {searchResults.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={styles.sectionTitle}>
                  Search Results ({searchResults.length})
                </Text>
                <View style={styles.moviesList}>
                  {searchResults.map(renderMovieItem)}
                </View>
              </View>
            )}

            {!loading && searchResults.length === 0 && hasSearched && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No movies found. Try a different search term.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 24,
    color: "#1a1a1a",
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  searchButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#34C759",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
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
    backgroundColor: "#eee",
  },
  posterLarge: {
    width: 200,
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  posterPlaceholder: {
    width: 70,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  posterPlaceholderText: {
    fontSize: 10,
    color: "#888",
  },
  movieInfo: {
    flex: 1,
  },
  selectedMovieInfo: {
    alignItems: "center",
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  movieTitleLarge: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1a1a1a",
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
  movieDirector: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  movieDirectorLarge: {
    fontSize: 16,
    color: "#444",
    marginBottom: 12,
  },
  movieMeta: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  moviePlot: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  moviePlotLarge: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
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
  formSection: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  dateButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  dateText: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#1a1a1a",
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
