import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { getMovieById, deleteMovie } from "../services/movieService";
import { useMovies } from "../context/MovieContext";
import { Movie } from "../types";

interface MovieDetailsScreenProps {
  route: any;
  navigation: any;
}

export default function MovieDetailsScreen({
  route,
  navigation,
}: MovieDetailsScreenProps) {
  const { movieId } = route.params;
  const { refreshMovies } = useMovies();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadMovie();
  }, [movieId]);

  const loadMovie = async () => {
    try {
      setLoading(true);
      const data = await getMovieById(movieId);
      setMovie(data);
    } catch (error: any) {
      Alert.alert("Error", error.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Movie", "Are you sure you want to delete this movie?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteMovie(movieId);
            await refreshMovies();
            navigation.goBack();
          } catch (error: any) {
            Alert.alert("Error", error.message);
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Movie not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {movie.poster !== "N/A" && (
        <Image source={{ uri: movie.poster }} style={styles.poster} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.meta}>
          {movie.year} • {movie.runtime}
        </Text>
        <Text style={styles.genre}>{movie.genre}</Text>

        <View style={styles.ratingsContainer}>
          <View style={styles.ratingCard}>
            <Text style={styles.ratingLabel}>Your Rating</Text>
            <Text style={styles.ratingValue}>{movie.userRating}/10</Text>
          </View>
          <View style={styles.ratingCard}>
            <Text style={styles.ratingLabel}>IMDB Rating</Text>
            <Text style={styles.ratingValue}>{movie.imdbRating}/10</Text>
          </View>
          {movie.rottenTomatoesRating && (
            <View style={[styles.ratingCard]}>
              <Text style={[styles.ratingLabel]}>R. Tomatoes</Text>
              <Text style={[styles.ratingValue]}>
                {movie.rottenTomatoesRating}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Watched On</Text>
          <Text style={styles.sectionText}>
            {movie.watchedDate.toDate().toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Director</Text>
          <Text style={styles.sectionText}>{movie.director}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cast</Text>
          <Text style={styles.sectionText}>{movie.actors}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plot</Text>
          <Text style={styles.sectionText}>{movie.plot}</Text>
        </View>

        {movie.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Notes</Text>
            <Text style={styles.sectionText}>{movie.notes}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditMovie", { movieId })}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, deleting && styles.buttonDisabled]}
            onPress={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.deleteButtonText}>Delete</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  poster: {
    width: "100%",
    height: 500,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  meta: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  genre: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 20,
  },
  ratingsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  ratingCard: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ratingLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  sectionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
