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
import {
  extractImdbId,
  fetchMovieByImdbId,
  fetchMovieByTitle,
  isValidImdbUrl,
} from "../services/omdbService";
import { addMovie, checkMovieExists } from "../services/movieService";
import { OMDBMovie } from "../types";

export default function AddMovieScreen({ navigation }: any) {
  const { user } = useAuth();
  const { refreshMovies } = useMovies();
  const [imdbUrl, setImdbUrl] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [searchMode, setSearchMode] = useState<"url" | "title">("url");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [movieData, setMovieData] = useState<OMDBMovie | null>(null);
  const [watchedDate, setWatchedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userRating, setUserRating] = useState("");
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleFetchMovie = async () => {
    console.log("[ADD_MOVIE] Fetch button pressed");
    console.log("[ADD_MOVIE] Search mode:", searchMode);

    if (searchMode === "url") {
      console.log("[ADD_MOVIE] IMDB URL:", imdbUrl);

      if (!imdbUrl.trim()) {
        console.log("[ADD_MOVIE] Empty URL");
        Alert.alert("Error", "Please enter an IMDB URL");
        return;
      }

      if (!isValidImdbUrl(imdbUrl)) {
        console.log("[ADD_MOVIE] Invalid URL format");
        Alert.alert("Error", "Please enter a valid IMDB URL");
        return;
      }

      const imdbId = extractImdbId(imdbUrl);
      console.log("[ADD_MOVIE] Extracted IMDB ID:", imdbId);

      if (!imdbId) {
        console.error("[ADD_MOVIE] Could not extract IMDB ID");
        Alert.alert("Error", "Could not extract IMDB ID from URL");
        return;
      }

      // Check if movie already exists
      if (user) {
        const exists = await checkMovieExists(user.uid, imdbId);
        if (exists) {
          console.log("[ADD_MOVIE] Movie already exists");
          Alert.alert(
            "Already Added",
            "This movie is already in your collection",
          );
          return;
        }
      }

      try {
        setLoading(true);
        console.log("[ADD_MOVIE] Fetching movie data by ID...");
        const data = await fetchMovieByImdbId(imdbId);
        if (data) {
          console.log("[ADD_MOVIE] Movie data received:", data.Title);
          setMovieData(data);
        } else {
          console.error("[ADD_MOVIE] No data returned");
          Alert.alert("Error", "Movie not found");
        }
      } catch (error: any) {
        console.error("[ADD_MOVIE] Fetch error:", error);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Search by title
      console.log("[ADD_MOVIE] Movie title:", movieTitle);

      if (!movieTitle.trim()) {
        console.log("[ADD_MOVIE] Empty title");
        Alert.alert("Error", "Please enter a movie title");
        return;
      }

      try {
        setLoading(true);
        console.log("[ADD_MOVIE] Fetching movie data by title...");
        const data = await fetchMovieByTitle(movieTitle);
        if (data) {
          console.log("[ADD_MOVIE] Movie data received:", data.Title);

          // Check if movie already exists
          if (user) {
            const exists = await checkMovieExists(user.uid, data.imdbID);
            if (exists) {
              console.log("[ADD_MOVIE] Movie already exists");
              Alert.alert(
                "Already Added",
                "This movie is already in your collection",
              );
              setLoading(false);
              return;
            }
          }

          setMovieData(data);
          // Set the IMDB URL for saving
          setImdbUrl(`https://www.imdb.com/title/${data.imdbID}/`);
        } else {
          console.error("[ADD_MOVIE] No data returned");
          Alert.alert("Error", "Movie not found");
        }
      } catch (error: any) {
        console.error("[ADD_MOVIE] Fetch error:", error);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveMovie = async () => {
    console.log("[ADD_MOVIE] Save button pressed");
    if (!movieData || !user) {
      console.error("[ADD_MOVIE] Missing movieData or user");
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

      console.log("[ADD_MOVIE] Movie saved successfully");
      await refreshMovies();
      console.log("[ADD_MOVIE] Movies refreshed");

      Alert.alert("Success", "Movie added to your collection!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setImdbUrl("");
            setMovieTitle("");
            setMovieData(null);
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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>Add Movie</Text>

            <View style={styles.searchModeContainer}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  searchMode === "url" && styles.modeButtonActive,
                ]}
                onPress={() => setSearchMode("url")}
                disabled={loading || !!movieData}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    searchMode === "url" && styles.modeButtonTextActive,
                  ]}
                >
                  By IMDB URL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  searchMode === "title" && styles.modeButtonActive,
                ]}
                onPress={() => setSearchMode("title")}
                disabled={loading || !!movieData}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    searchMode === "title" && styles.modeButtonTextActive,
                  ]}
                >
                  By Title
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              {searchMode === "url" ? (
                <TextInput
                  style={styles.input}
                  placeholder="IMDB URL (e.g., https://www.imdb.com/title/tt0111161/)"
                  value={imdbUrl}
                  onChangeText={setImdbUrl}
                  autoCapitalize="none"
                  editable={!loading && !movieData}
                />
              ) : (
                <TextInput
                  style={styles.input}
                  placeholder="Movie title (e.g., The Shawshank Redemption)"
                  value={movieTitle}
                  onChangeText={setMovieTitle}
                  autoCapitalize="words"
                  editable={!loading && !movieData}
                />
              )}
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
                {movieData.Poster !== "N/A" && (
                  <Image
                    source={{ uri: movieData.Poster }}
                    style={styles.poster}
                  />
                )}
                <Text style={styles.movieTitle}>{movieData.Title}</Text>
                <Text style={styles.movieMeta}>
                  {movieData.Year} • {movieData.Runtime} • IMDB:{" "}
                  {movieData.imdbRating}
                </Text>
                <Text style={styles.movieDirector}>
                  Directed by {movieData.Director}
                </Text>
                <Text style={styles.moviePlot}>{movieData.Plot}</Text>

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

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setMovieData(null);
                      setImdbUrl("");
                      setMovieTitle("");
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 10, // Reduced top padding since SafeAreaView handles status bar
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10, // Additional top margin for better spacing
    marginBottom: 24,
    color: "#1a1a1a",
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  fetchButton: {
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
  cancelButton: {
    borderWidth: 2,
    borderColor: "#FF3B30",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  cancelButtonText: {
    color: "#FF3B30",
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
  movieInfo: {
    alignItems: "center",
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  movieMeta: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  movieDirector: {
    fontSize: 16,
    color: "#444",
    marginBottom: 12,
  },
  moviePlot: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
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
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
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
  searchModeContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  modeButtonTextActive: {
    color: "#007AFF",
  },
});
