import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PrivacySettingsScreen from '../screens/PrivacySettingsScreen';
import PublicProfileScreen from '../screens/PublicProfileScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import LegalScreen from '../screens/LegalScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsScreen from '../screens/TermsScreen';
import CommunityGuidelinesScreen from '../screens/CommunityGuidelinesScreen';
import { ProfileStackParamList } from '../types';

const Stack = createStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PrivacySettings"
        component={PrivacySettingsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PublicProfile"
        component={PublicProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Legal" component={LegalScreen} options={{ title: 'Legal' }} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
      <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Terms & Conditions' }} />
      <Stack.Screen name="CommunityGuidelines" component={CommunityGuidelinesScreen} options={{ title: 'Community Guidelines' }} />
    </Stack.Navigator>
  );
}
