# Movie Tracker App - Setup & Run Guide

A React Native app for tracking movies you've watched with ratings, statistics, IMDB integration, and social features to discover and follow other movie enthusiasts.

## Quick Start (5 Steps)

### Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
npx expo install expo-asset expo-font
```

### Step 2: Setup Firebase

1. Go to https://console.firebase.google.com/
2. Create a new project (name: movie-tracker)
3. Enable **Authentication**:
   - Click "Authentication" → "Get started"
   - Enable "Email/Password" sign-in method
4. Create **Firestore Database**:
   - Click "Firestore Database" → "Create database"
   - Start in "test mode"
5. Get your config:
   - Click gear icon → "Project settings"
   - Scroll to "Your apps" → Click web icon (</>)
   - Copy the config values

### Step 3: Setup OMDB API

1. Go to https://www.omdbapi.com/apikey.aspx
2. Request FREE API key (1,000 requests/day)
3. Check email and click activation link
4. Copy your API key

### Step 4: Create .env File

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Firebase (from step 2)
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=movie-tracker-xxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=movie-tracker-xxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=movie-tracker-xxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:...

# OMDB (from step 3)
EXPO_PUBLIC_OMDB_API_KEY=your_8_digit_key
```

### Step 5: Run the App

**Option A: iOS Simulator (Mac only - RECOMMENDED)**
```bash
npm start
# When menu appears, press 'i'
```

**Option B: Android Emulator**
```bash
npm start
# When menu appears, press 'a'
```

**Option C: Your Phone**
1. Install "Expo Go" app from App Store or Play Store
2. Make sure phone is on same WiFi as computer
3. Run `npm start`
4. Scan the QR code with your phone

## ⚠️ Important Notes

### DO NOT Press 'w' for Web!
This is a **mobile app** using native components. Web mode will NOT work.

When you see:
```
› Press i │ open iOS simulator     ← Choose this (Mac)
› Press a │ open Android emulator
› Press w │ open web               ← DON'T use this!
```

### SDK Version Issues

If you get "SDK mismatch" error:
- **Use iOS Simulator** (supports any SDK version)
- **OR update Expo Go** app on your phone to latest version
- **OR** run directly: `npm run ios` or `npm run android`

### Missing Asset Files Error

The app will show warnings about missing icons - this is OK for development! The app will still work.

## Testing the App

1. **Sign Up**: Create a new account
2. **Add Movie**:
   - Go to "Add" tab
   - Paste: `https://www.imdb.com/title/tt0111161/`
   - Click "Fetch Movie"
   - Add rating and save
3. **View Stats**: Check the Statistics tab

## Features

### Core Movie Tracking
- **Authentication**: Email/password login & signup
- **Add Movies**: Paste IMDB URL, auto-fetch metadata
- **Ratings**: Rate movies 1-10, add notes
- **Statistics**: Charts showing your watching habits
- **Widgets**: Quick stats on home screen
- **Search & Sort**: Find movies easily

### Social Features
- **Discover Users**: Search for other movie enthusiasts by name or username
- **Follow System**: Follow users to see their public movie collections
- **Public Profiles**: Share your movie collection with friends
- **User Profiles**: View other users' public movies and stats
- **Privacy Controls**: Toggle public profile, control movie visibility

### Profile Management
- **Profile Settings**: Edit name, manage privacy
- **Following List**: See who you're following
- **Followers**: See who follows you

## Troubleshooting

### Port 8081 Already in Use
```bash
pkill -f "expo"
npm start
```

### Cannot Find Module Error
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npx expo install expo-asset expo-font
npx expo start --clear
```

### App Won't Load
1. Make sure `.env` file exists and is filled in
2. Check Firebase and OMDB credentials are correct
3. Try: `npx expo start --clear`

### Web Bundle Error (500)
**Don't use web mode!** Press 'i' for iOS or 'a' for Android instead.

## Firebase Security Rules (For Production)

Update Firestore rules before deploying:

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

    match /follows/{followId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
                       request.resource.data.followerId == request.auth.uid;
      allow delete: if request.auth != null &&
                       resource.data.followerId == request.auth.uid;
    }
  }
}
```

## Tech Stack

- React Native + Expo
- TypeScript
- Firebase (Auth + Firestore)
- OMDB API
- React Navigation
- react-native-chart-kit

## Project Structure

```
src/
├── config/         # Firebase setup
├── context/        # Auth & Movie state
├── navigation/     # Navigation setup
├── screens/        # All app screens
├── services/       # API services
└── types/          # TypeScript types
```

## Commands Reference

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Clear cache
npx expo start --clear

# Check for errors
npx tsc --noEmit
```

## Support

**Common Issue**: App won't start
- ✅ Check `.env` file is created and filled
- ✅ Firebase Authentication enabled
- ✅ Firestore Database created
- ✅ OMDB API key activated
- ✅ Using iOS/Android, NOT web

**Still stuck?**
1. Delete `node_modules` and reinstall
2. Clear Expo cache: `npx expo start --clear`
3. Make sure using iOS Simulator or Android Emulator, NOT web

---

**Ready to track your movies!** 🎬
