import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MoviesListScreen from '../screens/MoviesListScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import { MoviesStackParamList } from '../types';

const Stack = createStackNavigator<MoviesStackParamList>();

export default function MoviesStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MoviesList"
        component={MoviesListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MovieDetails"
        component={MovieDetailsScreen}
        options={{
          title: 'Movie Details',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
}
