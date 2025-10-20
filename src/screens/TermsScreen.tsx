import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.paragraph}>
          By using this app you agree to these terms. You must be at least 13.
          You are responsible for the content you post and you grant us a
          non-exclusive license to host and display that content in the app. Do
          not post illegal, infringing, or abusive content. We may moderate or
          remove content and suspend accounts for violations. The app is provided
          “as is” without warranties. Our liability is limited to the maximum
          extent permitted by law. These terms are governed by the laws of your
          principal place of business; disputes may be resolved by binding
          arbitration where permitted.
        </Text>
        <Text style={styles.heading}>Contact</Text>
        <Text style={styles.paragraph}>legal@example.com</Text>
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


