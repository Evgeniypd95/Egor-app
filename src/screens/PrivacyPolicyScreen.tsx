import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>

        <Text style={styles.paragraph}>
          Movie Tracker respects your privacy. This policy explains what data we collect,
          how we use it, and your rights under GDPR, CCPA, and other applicable laws.
          By using Movie Tracker, you agree to this policy.
        </Text>

        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          • Account data: email, username, profile image (optional).{'\n'}
          • App activity: movies you add, rate, or mark as watched.{'\n'}
          • Social interactions: users you follow and your public lists.{'\n'}
          • Technical data: device ID, app version, crash logs, analytics events.
        </Text>

        <Text style={styles.heading}>2. How We Use Your Data</Text>
        <Text style={styles.paragraph}>
          We use your data to operate and improve the app, personalize your experience,
          allow social features (follow, view lists), secure accounts, and comply with law.
          We do not sell or rent your personal data.
        </Text>

        <Text style={styles.heading}>3. Legal Bases (GDPR)</Text>
        <Text style={styles.paragraph}>
          We process personal data under one or more of these bases:{'\n'}
          • Contract: to provide the Movie Tracker service.{'\n'}
          • Consent: for optional features (e.g., social sharing).{'\n'}
          • Legitimate interest: to improve app stability and security.{'\n'}
          • Legal obligation: to comply with data protection laws.
        </Text>

        <Text style={styles.heading}>4. Data Storage & Processors</Text>
        <Text style={styles.paragraph}>
          Data is stored securely using Firebase (Google LLC), which may process data
          in the United States or other countries with appropriate safeguards
          (such as Standard Contractual Clauses).
        </Text>

        <Text style={styles.heading}>5. Data Retention</Text>
        <Text style={styles.paragraph}>
          We keep your data as long as your account is active. Upon account deletion or
          request, your personal data is erased or anonymized within 30 days unless
          retention is required by law.
        </Text>

        <Text style={styles.heading}>6. Your Rights</Text>
        <Text style={styles.paragraph}>
          Depending on your location, you have the right to:{'\n'}
          • Access, correct, or delete your data.{'\n'}
          • Withdraw consent at any time.{'\n'}
          • Object to or restrict processing.{'\n'}
          • Port your data to another service.{'\n'}
          To exercise these rights, contact us at privacy@example.com.
        </Text>

        <Text style={styles.heading}>7. Children’s Privacy</Text>
        <Text style={styles.paragraph}>
          Movie Tracker is not directed to children under 13 (or under 16 in the EU).
          We do not knowingly collect data from minors. If you believe a child has
          provided data, please contact us for deletion.
        </Text>

        <Text style={styles.heading}>8. Data Security</Text>
        <Text style={styles.paragraph}>
          We use encryption, secure servers, and access controls to protect your data.
          However, no online service can guarantee absolute security.
        </Text>

        <Text style={styles.heading}>9. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy occasionally. Significant changes will be
          notified in-app or by email. Continued use after updates means you accept them.
        </Text>

        <Text style={styles.heading}>10. Contact</Text>
        <Text style={styles.paragraph}>
          For privacy questions or data requests, email: privacy@example.com
        </Text>

        <Text style={styles.small}>Last updated: 2025-10-24</Text>
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
