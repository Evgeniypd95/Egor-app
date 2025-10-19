import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import AddMovieScreen from '../screens/AddMovieScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import MoviesStackNavigator from './MoviesStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          paddingBottom: 20, // Extra padding for iOS home indicator
          paddingTop: 8,
          height: 85, // Increased height for safe area
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="Movies"
        component={MoviesStackNavigator}
        options={{
          tabBarLabel: 'Movies',
          tabBarIcon: ({ color }) => <TabIcon emoji="🎬" color={color} />,
        }}
      />
      <Tab.Screen
        name="AddMovie"
        component={AddMovieScreen}
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: ({ color }) => <TabIcon emoji="➕" color={color} />,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color }) => <TabIcon emoji="🔍" color={color} />,
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color }) => <TabIcon emoji="📊" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Simple emoji icon component
const TabIcon = ({ emoji, color }: { emoji: string; color: string }) => (
  <View style={{ opacity: color === '#007AFF' ? 1 : 0.6 }}>
    <Text style={{ fontSize: 24 }}>{emoji}</Text>
  </View>
);
