import { OMDBMovie } from '../types';

const OMDB_API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;
const OMDB_API_URL = 'https://www.omdbapi.com/';

// Extract IMDB ID from URL
export const extractImdbId = (url: string): string | null => {
  try {
    // Match patterns like:
    // https://www.imdb.com/title/tt0111161/
    // https://imdb.com/title/tt0111161
    // tt0111161
    const match = url.match(/(?:title\/)?(tt\d+)/);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};

// Fetch movie data from OMDB API
export const fetchMovieByImdbId = async (imdbId: string): Promise<OMDBMovie | null> => {
  console.log('[OMDB] Fetching movie:', imdbId);
  console.log('[OMDB] API Key present:', !!OMDB_API_KEY);
  try {
    if (!OMDB_API_KEY) {
      console.error('[OMDB] API key is missing!');
      throw new Error('OMDB API key is not configured');
    }

    const url = `${OMDB_API_URL}?i=${imdbId}&apikey=${OMDB_API_KEY}&plot=full`;
    console.log('[OMDB] Request URL:', url.replace(OMDB_API_KEY, 'HIDDEN'));

    const response = await fetch(url);
    console.log('[OMDB] Response status:', response.status);

    if (!response.ok) {
      console.error('[OMDB] HTTP error:', response.status);
      throw new Error('Failed to fetch movie data from OMDB');
    }

    const data = await response.json();
    console.log('[OMDB] Response data:', data);

    if (data.Response === 'False') {
      console.error('[OMDB] OMDB error:', data.Error);
      throw new Error(data.Error || 'Movie not found');
    }

    console.log('[OMDB] Movie fetched successfully:', data.Title);
    return data as OMDBMovie;
  } catch (error: any) {
    console.error('[OMDB] Fetch error:', error.message);
    throw new Error(error.message || 'Failed to fetch movie data');
  }
};

// Search movies by title (optional feature)
export const searchMoviesByTitle = async (title: string): Promise<OMDBMovie[]> => {
  try {
    if (!OMDB_API_KEY) {
      throw new Error('OMDB API key is not configured');
    }

    const response = await fetch(`${OMDB_API_URL}?s=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`);

    if (!response.ok) {
      throw new Error('Failed to search movies');
    }

    const data = await response.json();

    if (data.Response === 'False') {
      return [];
    }

    // Fetch full details for each movie
    const movies = await Promise.all(
      data.Search.map(async (movie: any) => {
        return await fetchMovieByImdbId(movie.imdbID);
      })
    );

    return movies.filter((movie): movie is OMDBMovie => movie !== null);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to search movies');
  }
};

// Validate IMDB URL
export const isValidImdbUrl = (url: string): boolean => {
  const imdbId = extractImdbId(url);
  return imdbId !== null && imdbId.startsWith('tt');
};
