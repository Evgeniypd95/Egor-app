import { Timestamp } from 'firebase/firestore';

// User type matching Firestore schema
export interface User {
  uid: string;
  email: string;
  displayName: string;
  profileUrl: string;
  publicProfileEnabled: boolean;
  createdAt: Timestamp;
  followers?: string[]; // Array of user IDs who follow this user
  following?: string[]; // Array of user IDs this user follows
}

// Movie type matching Firestore schema
export interface Movie {
  id: string;
  userId: string;
  imdbId: string;
  imdbUrl: string;
  title: string;
  year: string;
  poster: string;
  director: string;
  actors: string;
  plot: string;
  genre: string;
  runtime: string;
  imdbRating: number;
  userRating: number;
  watchedDate: Timestamp;
  notes?: string;
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// OMDB API response type
export interface OMDBMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

// Statistics types
export interface MovieStats {
  totalMovies: number;
  averageRating: number;
  moviesThisMonth: number;
  moviesThisYear: number;
  topGenres: { [genre: string]: number };
  ratingDistribution: { [rating: number]: number };
}

// Following types
export interface FollowRelationship {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Timestamp;
}

export interface UserSearchResult {
  uid: string;
  displayName: string;
  profileUrl: string;
  publicProfileEnabled: boolean;
  followersCount?: number;
  isFollowing?: boolean;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  AddMovie: undefined;
  Movies: undefined;
  Discover: undefined;
  Statistics: undefined;
  Profile: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  PrivacySettings: undefined;
  PublicProfile: undefined;
  UserProfile: { userId: string };
};

export type MoviesStackParamList = {
  MoviesList: undefined;
  MovieDetails: { movieId: string };
};
