import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CommunityGuidelinesScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Community Guidelines</Text>
        <Text style={styles.paragraph}>
          Be respectful. No harassment, hate, spam, or illegal content. Share
          only content you have the right to share. Report abuse via the Report
          link or email contact.movietracker@gmail.com.
        </Text>
        <Text style={styles.heading}>Enforcement</Text>
        <Text style={styles.paragraph}>
          We may remove content and suspend accounts that violate these
          guidelines.
        </Text>
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
});


