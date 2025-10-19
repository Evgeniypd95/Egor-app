# Pre-Launch Checklist

Use this checklist to ensure everything is configured correctly before running the app.

## ✅ Dependencies Installation

- [ ] Run `npm install` successfully
- [ ] No peer dependency warnings that need resolution
- [ ] Node modules folder exists and populated

## ✅ Firebase Configuration

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password provider)
- [ ] Firestore database created
- [ ] Firebase config values copied to `.env`
- [ ] All 6 Firebase environment variables set:
  - [ ] EXPO_PUBLIC_FIREBASE_API_KEY
  - [ ] EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
  - [ ] EXPO_PUBLIC_FIREBASE_PROJECT_ID
  - [ ] EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
  - [ ] EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - [ ] EXPO_PUBLIC_FIREBASE_APP_ID

## ✅ OMDB API Configuration

- [ ] OMDB API key requested
- [ ] Email verified and key activated
- [ ] API key added to `.env`:
  - [ ] EXPO_PUBLIC_OMDB_API_KEY

## ✅ Environment Setup

- [ ] `.env` file exists (copied from `.env.example`)
- [ ] All environment variables filled in (no "your_xxx_here" placeholders)
- [ ] `.env` file added to `.gitignore` (already done)

## ✅ Development Environment

- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm or yarn installed
- [ ] Expo CLI available (`npx expo --version`)
- [ ] iOS Simulator installed (Mac only) OR Android Emulator setup
- [ ] OR Expo Go app installed on physical device

## ✅ File Structure

Verify these key files exist:
- [ ] `App.tsx` - Main app entry point
- [ ] `app.json` - Expo configuration
- [ ] `tsconfig.json` - TypeScript configuration
- [ ] `babel.config.js` - Babel configuration
- [ ] `package.json` - Dependencies
- [ ] `.env` - Environment variables (not `.env.example`)

## ✅ Source Code Structure

Check these directories exist:
- [ ] `src/config/` - Firebase config
- [ ] `src/context/` - Auth and Movie contexts
- [ ] `src/navigation/` - Navigation setup
- [ ] `src/screens/` - All screen components
- [ ] `src/services/` - API services
- [ ] `src/types/` - TypeScript types

## ✅ Testing Before First Run

1. Environment variables check:
```bash
cat .env
```
Ensure no variables say "your_xxx_here"

2. TypeScript check:
```bash
npx tsc --noEmit
```
Should complete without errors (warnings are OK)

3. Check Firebase config:
- Open `src/config/firebase.ts`
- Verify it reads from environment variables

## ✅ First Run

- [ ] Run `npm start`
- [ ] Expo Dev Tools opens in browser
- [ ] No immediate crash errors
- [ ] Able to scan QR code or press `i` for iOS / `a` for Android

## ✅ First Test

Once app loads:

1. **Sign Up**
   - [ ] Can navigate to signup screen
   - [ ] Can enter email and password
   - [ ] Signup succeeds and navigates to home screen

2. **Add Movie**
   - [ ] Navigate to Add tab
   - [ ] Paste IMDB URL: `https://www.imdb.com/title/tt0111161/`
   - [ ] Click "Fetch Movie"
   - [ ] Movie details load (The Shawshank Redemption)
   - [ ] Can set rating and date
   - [ ] Can save movie
   - [ ] Movie appears in Movies tab

3. **View Data**
   - [ ] Movies tab shows added movie
   - [ ] Can tap movie to see details
   - [ ] Statistics tab shows updated stats
   - [ ] Home tab shows correct widget data

4. **Sign Out & Sign In**
   - [ ] Can sign out from Profile tab
   - [ ] Returns to login screen
   - [ ] Can sign in with same credentials
   - [ ] Movies persist after sign in

## 🔧 If Something Doesn't Work

### Authentication Issues
```bash
# Verify Firebase config
node -e "require('dotenv').config(); console.log(process.env)"
```

### OMDB API Issues
Test your API key:
```bash
curl "http://www.omdbapi.com/?i=tt0111161&apikey=YOUR_KEY"
```

### Module Not Found
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Cache Issues
```bash
# Clear Expo cache
npx expo start -c
```

### TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit

# If errors exist, review the error messages
```

## 📱 Device-Specific Checks

### iOS (Mac only)
- [ ] Xcode installed
- [ ] iOS Simulator available
- [ ] Can run `npm run ios`

### Android
- [ ] Android Studio installed
- [ ] Android emulator configured
- [ ] Can run `npm run android`

### Physical Device
- [ ] Expo Go app installed
- [ ] Same WiFi network as development machine
- [ ] Can scan QR code

## 🚀 Production Readiness (Future)

Not needed for development, but for future reference:

- [ ] Update Firestore security rules (see SETUP_GUIDE.md)
- [ ] Add proper app icons (assets/)
- [ ] Update app.json with proper bundle identifiers
- [ ] Test on multiple devices
- [ ] Configure app signing (iOS/Android)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics (optional)

## ✨ All Done!

If you've checked all the boxes above, you're ready to use the Movie Tracker app!

Start the app:
```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code for physical device

Happy movie tracking! 🎬
