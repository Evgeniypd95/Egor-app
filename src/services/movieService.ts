import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Movie } from '../types';

// Add a new movie
export const addMovie = async (movieData: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'movies'), {
      ...movieData,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Failed to add movie: ${error.message}`);
  }
};

// Get all movies for a user
export const getUserMovies = async (userId: string): Promise<Movie[]> => {
  try {
    const q = query(
      collection(db, 'movies'),
      where('userId', '==', userId),
      orderBy('watchedDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const movies: Movie[] = [];
    querySnapshot.forEach((doc) => {
      movies.push({ id: doc.id, ...doc.data() } as Movie);
    });
    return movies;
  } catch (error: any) {
    throw new Error(`Failed to fetch movies: ${error.message}`);
  }
};

// Get a single movie by ID
export const getMovieById = async (movieId: string): Promise<Movie | null> => {
  try {
    const docRef = doc(db, 'movies', movieId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Movie;
    }
    return null;
  } catch (error: any) {
    throw new Error(`Failed to fetch movie: ${error.message}`);
  }
};

// Update a movie
export const updateMovie = async (
  movieId: string,
  updates: Partial<Omit<Movie, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const docRef = doc(db, 'movies', movieId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(`Failed to update movie: ${error.message}`);
  }
};

// Delete a movie
export const deleteMovie = async (movieId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'movies', movieId));
  } catch (error: any) {
    throw new Error(`Failed to delete movie: ${error.message}`);
  }
};

// Get public movies for a user (for public profile)
export const getPublicMovies = async (userId: string): Promise<Movie[]> => {
  try {
    const q = query(
      collection(db, 'movies'),
      where('userId', '==', userId),
      where('isPublic', '==', true),
      orderBy('watchedDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const movies: Movie[] = [];
    querySnapshot.forEach((doc) => {
      movies.push({ id: doc.id, ...doc.data() } as Movie);
    });
    return movies;
  } catch (error: any) {
    throw new Error(`Failed to fetch public movies: ${error.message}`);
  }
};

// Check if movie already exists for user
export const checkMovieExists = async (userId: string, imdbId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'movies'),
      where('userId', '==', userId),
      where('imdbId', '==', imdbId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error: any) {
    throw new Error(`Failed to check movie: ${error.message}`);
  }
};
