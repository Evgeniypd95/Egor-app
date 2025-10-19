import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function PrivacySettingsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [publicProfileEnabled, setPublicProfileEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!user) return;
    console.log('[PRIVACY] Loading settings...');
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setPublicProfileEnabled(data.publicProfileEnabled || false);
        console.log('[PRIVACY] Settings loaded:', data.publicProfileEnabled);
      }
    } catch (error: any) {
      console.error('[PRIVACY] Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublicProfile = async (value: boolean) => {
    console.log('[PRIVACY] Toggling public profile:', value);
    if (!user) return;

    setPublicProfileEnabled(value);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        publicProfileEnabled: value,
      });
      console.log('[PRIVACY] Public profile updated:', value);

      if (value) {
        Alert.alert(
          'Public Profile Enabled',
          'Your profile is now public. People can view your public movies via your profile link.'
        );
      }
    } catch (error: any) {
      console.error('[PRIVACY] Update error:', error);
      setPublicProfileEnabled(!value); // Revert on error
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Privacy Settings</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Public Profile</Text>
                <Text style={styles.settingDescription}>
                  Allow others to view your public movies and statistics
                </Text>
              </View>
              <Switch
                value={publicProfileEnabled}
                onValueChange={handleTogglePublicProfile}
                disabled={loading}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={publicProfileEnabled ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ About Privacy</Text>
            <Text style={styles.infoText}>
              • When public profile is enabled, people with your profile link can see movies you
              marked as "public"
            </Text>
            <Text style={styles.infoText}>
              • Movies marked as private are never visible to others
            </Text>
            <Text style={styles.infoText}>
              • You can control visibility for each movie individually
            </Text>
          </View>

          {publicProfileEnabled && (
            <TouchableOpacity
              style={styles.viewProfileButton}
              onPress={() => navigation.navigate('PublicProfile')}
            >
              <Text style={styles.viewProfileButtonText}>View My Public Profile</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#f0f8ff',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF20',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#007AFF',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  viewProfileButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewProfileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
