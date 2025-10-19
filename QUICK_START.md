# Quick Start Commands

## First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Edit .env with your Firebase and OMDB keys
# (Use your favorite editor: nano, vim, code, etc.)
nano .env
```

## Running the App

```bash
# Start the development server
npm start

# Or run directly on iOS (Mac only)
npm run ios

# Or run directly on Android
npm run android
```

## Common Commands

```bash
# Clear cache and restart
npx expo start -c

# Check for TypeScript errors
npx tsc --noEmit

# View package info
npm list --depth=0

# Update dependencies
npm update
```

## Expo Dev Tools

When you run `npm start`, you'll see:

```
› Press i │ open iOS simulator
› Press a │ open Android emulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

## Testing Example IMDB URLs

Use these to test the movie fetching:

```
https://www.imdb.com/title/tt0111161/  (The Shawshank Redemption)
https://www.imdb.com/title/tt0068646/  (The Godfather)
https://www.imdb.com/title/tt0468569/  (The Dark Knight)
https://www.imdb.com/title/tt0167260/  (The Lord of the Rings)
https://www.imdb.com/title/tt0110912/  (Pulp Fiction)
```

## Development Tips

### Clear Everything
```bash
# Nuclear option - complete reset
rm -rf node_modules package-lock.json
npm install
npx expo start -c
```

### Check Environment Variables
```bash
# View your .env (make sure it's filled in)
cat .env
```

### Check Firebase Connection
```bash
# Test if Firebase config is loaded
node -e "require('dotenv').config(); console.log(Object.keys(process.env).filter(k => k.includes('FIREBASE')))"
```

### Test OMDB API Key
```bash
# Replace YOUR_KEY with your actual key
curl "http://www.omdbapi.com/?i=tt0111161&apikey=YOUR_KEY"
```

## Debugging

### Enable Debug Mode
```bash
# iOS
npm run ios -- --configuration Debug

# Android
npm run android -- --variant=debug
```

### View Logs
```bash
# React Native logs
npx react-native log-ios    # iOS
npx react-native log-android # Android
```

### Check Network Requests
- Open React Native Debugger
- Enable Network Inspect
- See all API calls

## Building for Production (Future)

```bash
# Create production build
eas build --platform ios
eas build --platform android

# Or both
eas build --platform all
```

## Useful Expo Commands

```bash
# Doctor - check for issues
npx expo-doctor

# Install package
npx expo install package-name

# Upgrade Expo SDK
npx expo upgrade

# Customize project
npx expo customize
```

## Git Commands

```bash
# Initialize git (if not done)
git init

# First commit
git add .
git commit -m "Initial commit: Movie Tracker app"

# Create .gitignore is already created
# .env is already in .gitignore
```

## File Locations

- **Environment**: `.env`
- **Firebase Config**: `src/config/firebase.ts`
- **Screens**: `src/screens/`
- **Services**: `src/services/`
- **Navigation**: `src/navigation/`

## Environment Variables Needed

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_OMDB_API_KEY=
```

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| Module not found | `rm -rf node_modules && npm install` |
| Cache issues | `npx expo start -c` |
| TypeScript errors | `npx tsc --noEmit` to check |
| App won't load | Check `.env` file exists and is filled |
| Firebase errors | Verify Firebase config in console |
| OMDB errors | Test API key with curl command |

## Next Steps

1. ✅ Run `npm install`
2. ✅ Create `.env` file
3. ✅ Add Firebase credentials
4. ✅ Add OMDB API key
5. ✅ Run `npm start`
6. ✅ Test on simulator/device
7. ✅ Create first account
8. ✅ Add first movie

## Support

- Check `SETUP_GUIDE.md` for detailed instructions
- Check `CHECKLIST.md` for configuration verification
- Check `README.md` for feature documentation
- Check `PROJECT_SUMMARY.md` for technical details

---

**Happy Coding! 🚀**
