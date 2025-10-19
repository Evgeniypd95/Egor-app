# Quick Setup Guide

Follow these steps to get your Movie Tracker app running:

## Step 1: Firebase Setup (15 minutes)

### Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Enter project name: `movie-tracker` (or your choice)
4. Disable Google Analytics (optional for this app)
5. Click "Create project"

### Enable Authentication
1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Click "Email/Password" under Sign-in providers
4. Toggle "Enable" switch
5. Click "Save"

### Create Firestore Database
1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose a location close to you
5. Click "Enable"

### Get Firebase Configuration
1. Click the gear icon next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon (</>)
5. Enter app nickname: "Movie Tracker"
6. Click "Register app"
7. Copy the firebaseConfig object values

Your config will look like:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "movie-tracker-xxx.firebaseapp.com",
  projectId: "movie-tracker-xxx",
  storageBucket: "movie-tracker-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:..."
};
```

## Step 2: OMDB API Key (5 minutes)

1. Go to https://www.omdbapi.com/apikey.aspx
2. Select "FREE! (1,000 daily limit)"
3. Enter your email
4. Check your email for activation link
5. Click the activation link
6. Copy your API key from the page

## Step 3: Configure Environment Variables

1. Open the `.env.example` file in the project root
2. Create a new file called `.env` (copy from .env.example)
3. Fill in your values:

```env
# From Firebase Config
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=movie-tracker-xxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=movie-tracker-xxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=movie-tracker-xxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:...

# From OMDB
EXPO_PUBLIC_OMDB_API_KEY=your_8_digit_key
```

## Step 4: Install and Run

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm start
```

This will open Expo Dev Tools in your browser.

### Run on iOS Simulator (Mac only)
- Press `i` in the terminal
- Or click "Run on iOS simulator" in Expo Dev Tools

### Run on Android Emulator
- Press `a` in the terminal
- Or click "Run on Android device/emulator" in Expo Dev Tools

### Run on Physical Device
1. Install "Expo Go" app from App Store or Play Store
2. Scan the QR code shown in terminal/Expo Dev Tools

## Step 5: Test the App

1. **Sign Up**: Create a new account with email/password
2. **Add Movie**:
   - Go to Add tab
   - Paste: `https://www.imdb.com/title/tt0111161/`
   - Click "Fetch Movie"
   - Set rating and date
   - Click "Save Movie"
3. **View Movies**: Check the Movies tab
4. **See Stats**: View statistics in Stats tab

## Common Issues

### "Firebase: Error (auth/network-request-failed)"
- Check your internet connection
- Verify Firebase config in `.env` is correct
- Make sure Authentication is enabled in Firebase Console

### "OMDB API Error"
- Verify your API key is activated (check email)
- Make sure key is correctly copied to `.env`
- Try accessing: `http://www.omdbapi.com/?i=tt0111161&apikey=YOUR_KEY`

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

### TypeScript errors
```bash
# Check for type errors
npx tsc --noEmit
```

## Firestore Security Rules (Production)

Before deploying, update your Firestore rules:

1. Go to Firebase Console > Firestore Database > Rules
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

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

3. Click "Publish"

## Next Steps

- Add more movies to see statistics
- Explore different sorting and filtering options
- Check out the widgets on the home screen
- Review your statistics and charts

## Getting Help

If you encounter issues:
1. Check the error message carefully
2. Verify all environment variables are set correctly
3. Ensure Firebase and OMDB services are properly configured
4. Try clearing cache: `npx expo start -c`
5. Check that you're using Node.js v16 or later

Enjoy tracking your movies!
