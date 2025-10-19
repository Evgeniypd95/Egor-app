import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { MovieProvider } from './src/context/MovieContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <MovieProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </MovieProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
