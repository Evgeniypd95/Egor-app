import React, { createContext, useContext, useEffect, useState } from 'react';
import { Movie, MovieStats } from '../types';
import { getUserMovies } from '../services/movieService';
import { useAuth } from './AuthContext';

interface MovieContextType {
  movies: Movie[];
  loading: boolean;
  refreshMovies: () => Promise<void>;
  stats: MovieStats;
}

const MovieContext = createContext<MovieContextType>({
  movies: [],
  loading: true,
  refreshMovies: async () => {},
  stats: {
    totalMovies: 0,
    averageRating: 0,
    moviesThisMonth: 0,
    moviesThisYear: 0,
    topGenres: {},
    ratingDistribution: {},
  },
});

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MovieStats>({
    totalMovies: 0,
    averageRating: 0,
    moviesThisMonth: 0,
    moviesThisYear: 0,
    topGenres: {},
    ratingDistribution: {},
  });

  const refreshMovies = async () => {
    console.log('[MOVIE_CONTEXT] Refreshing movies...');
    if (!user) {
      console.log('[MOVIE_CONTEXT] No user, clearing movies');
      setMovies([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('[MOVIE_CONTEXT] Fetching movies for user:', user.uid);
      const fetchedMovies = await getUserMovies(user.uid);
      console.log('[MOVIE_CONTEXT] Fetched', fetchedMovies.length, 'movies');
      setMovies(fetchedMovies);
      calculateStats(fetchedMovies);
    } catch (error) {
      console.error('[MOVIE_CONTEXT] Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (moviesList: Movie[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const moviesThisMonth = moviesList.filter((movie) => {
      const watchedDate = movie.watchedDate.toDate();
      return watchedDate.getMonth() === currentMonth && watchedDate.getFullYear() === currentYear;
    }).length;

    const moviesThisYear = moviesList.filter((movie) => {
      const watchedDate = movie.watchedDate.toDate();
      return watchedDate.getFullYear() === currentYear;
    }).length;

    const totalRating = moviesList.reduce((sum, movie) => sum + movie.userRating, 0);
    const averageRating = moviesList.length > 0 ? totalRating / moviesList.length : 0;

    const topGenres: { [genre: string]: number } = {};
    const ratingDistribution: { [rating: number]: number } = {};

    moviesList.forEach((movie) => {
      // Count genres
      const genres = movie.genre.split(',').map((g) => g.trim());
      genres.forEach((genre) => {
        topGenres[genre] = (topGenres[genre] || 0) + 1;
      });

      // Count rating distribution
      const rating = Math.floor(movie.userRating);
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
    });

    setStats({
      totalMovies: moviesList.length,
      averageRating: parseFloat(averageRating.toFixed(1)),
      moviesThisMonth,
      moviesThisYear,
      topGenres,
      ratingDistribution,
    });
  };

  useEffect(() => {
    refreshMovies();
  }, [user]);

  return (
    <MovieContext.Provider value={{ movies, loading, refreshMovies, stats }}>
      {children}
    </MovieContext.Provider>
  );
};
