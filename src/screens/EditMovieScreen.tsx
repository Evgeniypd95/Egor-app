import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Timestamp } from 'firebase/firestore';
import { getMovieById, updateMovie } from '../services/movieService';
import { Movie } from '../types';

interface EditMovieScreenProps {
  route: { params: { movieId: string } };
  navigation: any;
}

export default function EditMovieScreen({ route, navigation }: EditMovieScreenProps) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userRating, setUserRating] = useState('');
  const [notes, setNotes] = useState('');
  const [watchedDate, setWatchedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    load();
  }, [movieId]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getMovieById(movieId);
      if (!data) {
        Alert.alert('Error', 'Movie not found');
        navigation.goBack();
        return;
      }
      setMovie(data);
      setUserRating(String(data.userRating ?? ''));
      setNotes(data.notes || '');
      setWatchedDate(data.watchedDate.toDate());
    } catch (e: any) {
      Alert.alert('Error', e.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!movie) return;
    const ratingNum = parseInt(userRating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 10) {
      Alert.alert('Invalid rating', 'Please enter a number between 1 and 10');
      return;
    }
    try {
      setSaving(true);
      await updateMovie(movie.id, {
        userRating: ratingNum,
        notes,
        watchedDate: Timestamp.fromDate(watchedDate),
      });
      Alert.alert('Saved', 'Movie updated', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !movie) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Edit Movie</Text>
        <Text style={styles.subtitle}>{movie.title} ({movie.year})</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Your Rating (1-10)</Text>
          <TextInput
            style={styles.input}
            value={userRating}
            onChangeText={setUserRating}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Watched Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateButtonText}>{watchedDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={watchedDate}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) setWatchedDate(date);
              }}
            />
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            placeholder="Optional notes"
          />
        </View>

        <TouchableOpacity style={[styles.saveButton, saving && styles.disabled]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  content: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#666', marginBottom: 8 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  textArea: { height: 120, textAlignVertical: 'top' },
  dateButton: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e0e0e0' },
  dateButtonText: { fontSize: 16, color: '#1a1a1a' },
  saveButton: { backgroundColor: '#34C759', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.6 },
});


