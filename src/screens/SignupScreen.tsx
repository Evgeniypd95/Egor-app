import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { signUp } from '../services/authService';

interface SignupScreenProps {
  navigation: any;
}

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(true);

  const handleSignup = async () => {
    console.log('[SIGNUP] Signup button pressed');
    if (!displayName || !email || !password || !confirmPassword) {
      console.log('[SIGNUP] Missing fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      console.log('[SIGNUP] Passwords do not match');
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      console.log('[SIGNUP] Password too short');
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (!accepted) {
      Alert.alert('Terms Required', 'Please accept the Terms & Conditions and Privacy Policy to continue');
      return;
    }

    try {
      setLoading(true);
      console.log('[SIGNUP] Calling signUp...');
      await signUp(email, password, displayName);
      console.log('[SIGNUP] Signup successful');
      // Navigation will be handled by auth state change
    } catch (error: any) {
      console.error('[SIGNUP] Signup failed:', error);
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start tracking your movies today</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              editable={!loading}
            />

            <View style={styles.legalBox}>
              <TouchableOpacity onPress={() => setAccepted(!accepted)} style={styles.checkboxRow}>
                <View style={[styles.checkbox, accepted && styles.checkboxChecked]} />
                <Text style={styles.checkboxLabel}>I agree to the </Text>
                <Text style={styles.link} onPress={() => navigation.navigate('Terms')}>Terms</Text>
                <Text style={styles.checkboxLabel}> and </Text>
                <Text style={styles.link} onPress={() => navigation.navigate('PrivacyPolicy')}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 48,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 32,
  },
  legalBox: {
    marginTop: 8,
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#333',
  },
  link: {
    fontSize: 13,
    color: '#007AFF',
  },
  secondaryButton: {
    alignItems: 'center',
    padding: 16,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
});
