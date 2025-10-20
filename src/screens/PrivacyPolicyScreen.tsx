import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We collect and process account data (email, display name), app usage, and
          content you choose to make public. We use Firebase (Google LLC) to provide
          authentication and database services. Data is retained while your
          account remains active and deleted upon request. We do not sell your
          personal data. You may access, correct, export, or delete your data and
          object to certain processing where applicable.
        </Text>
        <Text style={styles.heading}>Controllers & Processors</Text>
        <Text style={styles.paragraph}>
          Controller: App operator. Processor: Google LLC (Firebase). Data may be
          stored in the United States with appropriate safeguards.
        </Text>
        <Text style={styles.heading}>Children</Text>
        <Text style={styles.paragraph}>This app is not directed to children under 13.</Text>
        <Text style={styles.heading}>Contact</Text>
        <Text style={styles.paragraph}>For privacy requests: privacy@example.com</Text>
        <Text style={styles.small}>Last updated: 2025-10-20</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  heading: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginTop: 16, marginBottom: 8 },
  paragraph: { fontSize: 14, color: '#333', lineHeight: 22 },
  small: { fontSize: 12, color: '#888', marginTop: 20 },
});


