# Movie Tracker App

A React Native mobile app for tracking movies watched. Users can paste IMDB links, the app fetches movie metadata, and users can add their watch date and personal rating. Features customizable widgets, statistics, and shareable public profiles.

## Features

### Core Features (Implemented)
- **Authentication**: Email/password authentication with Firebase
- **Add Movies**: Paste IMDB URL to fetch complete movie metadata
- **Movie Management**: View, edit, and delete movies
- **Statistics Dashboard**: Comprehensive statistics with charts
- **Home Widgets**: Quick stats and insights on home screen
- **Movie List**: Grid/list view with search and sort functionality

### Tech Stack
- **Frontend**: React Native with Expo
- **Backend**: Firebase (Authentication, Firestore)
- **API**: OMDB API for IMDB data
- **State Management**: React Context API
- **Navigation**: React Navigation v7
- **Charts**: react-native-chart-kit

## Setup Instructions

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Firebase account
- OMDB API key (free)

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** with Email/Password provider
4. Create a **Firestore Database** (start in test mode for development)
5. Get your Firebase config from Project Settings > General > Your apps
6. Register a web app if you haven't already

### 3. OMDB API Key

1. Go to [OMDB API](https://www.omdbapi.com/apikey.aspx)
2. Request a free API key
3. Verify your email to activate the key

### 4. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# OMDB API Configuration
EXPO_PUBLIC_OMDB_API_KEY=your_omdb_api_key_here
```

### 5. Firestore Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Movies collection
    match /movies/{movieId} {
      allow read: if request.auth != null &&
                     (resource.data.userId == request.auth.uid ||
                      resource.data.isPublic == true);
      allow create: if request.auth != null &&
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null &&
                               resource.data.userId == request.auth.uid;
    }
  }
}
```

### 6. Run the App

```bash
# Start the Expo development server
npm start

# Or run directly on iOS
npm run ios

# Or run directly on Android
npm run android
```

## Project Structure

```
src/
├── config/          # Firebase configuration
├── context/         # React Context (Auth, Movies)
├── navigation/      # Navigation setup
├── screens/         # App screens
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── ForgotPasswordScreen.tsx
│   ├── HomeScreen.tsx
│   ├── AddMovieScreen.tsx
│   ├── MoviesListScreen.tsx
│   ├── MovieDetailsScreen.tsx
│   ├── StatisticsScreen.tsx
│   └── ProfileScreen.tsx
├── services/        # API services
│   ├── authService.ts
│   ├── movieService.ts
│   └── omdbService.ts
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## Usage Guide

### Adding a Movie

1. Tap the **Add** tab
2. Paste an IMDB URL (e.g., `https://www.imdb.com/title/tt0111161/`)
3. Tap **Fetch Movie**
4. Review the movie details
5. Select watch date
6. Add your rating (1-10)
7. Optionally add notes
8. Toggle public visibility
9. Tap **Save Movie**

### Viewing Statistics

Navigate to the **Stats** tab to see:
- Total movies watched
- Average rating
- Monthly progress chart
- Rating distribution
- Genre breakdown
- Top directors

### Managing Movies

- **Search**: Use the search bar on Movies screen
- **Sort**: Sort by date, rating, or title
- **View Details**: Tap any movie card
- **Delete**: Open movie details and tap Delete
- **Edit**: (Coming soon)

## Data Models

### User Collection
```typescript
{
  uid: string
  email: string
  displayName: string
  profileUrl: string
  publicProfileEnabled: boolean
  createdAt: timestamp
}
```

### Movies Collection
```typescript
{
  id: string
  userId: string
  imdbId: string
  imdbUrl: string
  title: string
  year: string
  poster: string
  director: string
  actors: string
  plot: string
  genre: string
  runtime: string
  imdbRating: number
  userRating: number
  watchedDate: timestamp
  notes?: string
  isPublic: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Future Enhancements

### Phase 2 Features (To Be Implemented)
- [ ] Edit movie functionality
- [ ] Public profile web viewer
- [ ] Share movies on social media
- [ ] Export data (CSV, JSON)
- [ ] Advanced filtering (by genre, year, director)
- [ ] Movie recommendations
- [ ] Watch with friends feature
- [ ] Custom lists/collections
- [ ] Dark mode
- [ ] Push notifications

## Troubleshooting

### Common Issues

**1. Firebase Connection Error**
- Verify your Firebase config in `.env`
- Check that Firestore is enabled
- Ensure Authentication is enabled with Email/Password

**2. OMDB API Error**
- Verify your API key is active
- Check you haven't exceeded the daily limit (1,000 requests/day for free tier)
- Ensure the IMDB URL is valid

**3. App Won't Start**
- Clear Expo cache: `npx expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that all peer dependencies are installed

**4. TypeScript Errors**
- Run `npx tsc --noEmit` to check for type errors
- Ensure all imports are correct

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT License - Feel free to use this project for learning or personal use.

## Acknowledgments

- Movie data provided by [OMDB API](https://www.omdbapi.com/)
- Icons by [React Native](https://reactnative.dev/)
- Built with [Expo](https://expo.dev/)
- Backend by [Firebase](https://firebase.google.com/)
