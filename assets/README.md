# Assets

Place your app assets in this directory:

- **icon.png** - App icon (1024x1024px)
- **splash.png** - Splash screen image (2048x2048px)
- **adaptive-icon.png** - Android adaptive icon (1024x1024px)
- **favicon.png** - Web favicon (48x48px or larger)

## Temporary Placeholders

For development, you can use placeholder images. The app will work without these files but Expo may show warnings.

To generate proper icons:
1. Create your app icon design
2. Use https://easyappicon.com/ or similar tool
3. Generate all required sizes
4. Replace the files in this directory

## Icon Requirements

### iOS
- 1024x1024px PNG
- No transparency
- No rounded corners (iOS adds them automatically)

### Android
- 1024x1024px PNG (adaptive icon)
- Can have transparency
- Design should be within safe area (center 66% of canvas)

### Splash Screen
- 2048x2048px or larger
- Will be centered and resized
- Background color defined in app.json
