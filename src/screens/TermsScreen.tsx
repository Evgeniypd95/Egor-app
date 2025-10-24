import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms & Conditions</Text>

        <Text style={styles.paragraph}>
          Welcome to Movie Tracker. By downloading or using this app, you agree to
          these Terms & Conditions ("Terms"). If you do not agree, please do not use
          the app.
        </Text>

        <Text style={styles.heading}>1. Eligibility</Text>
        <Text style={styles.paragraph}>
          You must be at least 13 years old (or 16 in the EU) to use Movie Tracker.
          By using the app, you confirm that you meet this requirement and that you
          are legally able to enter into this agreement.
        </Text>

        <Text style={styles.heading}>2. Your Account</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your login
          information and for all activity under your account. If you believe your
          account has been compromised, please contact us immediately.
        </Text>

        <Text style={styles.heading}>3. User Content</Text>
        <Text style={styles.paragraph}>
          You may create and share content such as movie ratings, lists, and comments.
          By posting, you grant Movie Tracker a non-exclusive, worldwide, royalty-free
          license to host, display, and distribute your content within the app.
          You remain the owner of your content.
        </Text>

        <Text style={styles.heading}>4. Acceptable Use</Text>
        <Text style={styles.paragraph}>
          You agree not to post or share any content that is illegal, harmful,
          infringing, harassing, hateful, or otherwise violates the rights of others.
          We reserve the right to remove content, restrict access, or suspend accounts
          that violate these Terms or applicable law.
        </Text>

        <Text style={styles.heading}>5. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          All trademarks, app code, logos, and design elements of Movie Tracker are
          owned by the app operator or its licensors. You may not copy, modify,
          reverse engineer, or distribute the app or its content without permission.
        </Text>

        <Text style={styles.heading}>6. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          Movie Tracker may use third-party providers such as Firebase (Google LLC)
          for hosting, authentication, and analytics. Use of those services is
          governed by their own terms and privacy policies.
        </Text>

        <Text style={styles.heading}>7. Disclaimers</Text>
        <Text style={styles.paragraph}>
          Movie Tracker is provided “as is” and “as available.” We make no warranties
          regarding availability, reliability, or accuracy of data. We are not liable
          for any loss or damage resulting from your use of the app.
        </Text>

        <Text style={styles.heading}>8. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          To the maximum extent permitted by law, our total liability for any claims
          arising from or related to the app will not exceed the amount you paid (if
          any) to use the service in the last 12 months.
        </Text>

        <Text style={styles.heading}>9. Termination</Text>
        <Text style={styles.paragraph}>
          You may stop using the app at any time. We may suspend or terminate your
          access if you violate these Terms or misuse the service. Upon termination,
          your right to use the app ends immediately.
        </Text>

        <Text style={styles.heading}>10. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms are governed by the laws of England and Wales (or, if you reside
          outside the UK, the laws of your country of residence). Disputes will be
          resolved through binding arbitration or the competent courts of that
          jurisdiction, where permitted by law.
        </Text>

        <Text style={styles.heading}>11. Changes to These Terms</Text>
        <Text style={styles.paragraph}>
          We may update these Terms periodically. If we make significant changes,
          we will notify you in-app or by email. Continued use after changes take
          effect means you accept the new Terms.
        </Text>

        <Text style={styles.heading}>12. Contact</Text>
        <Text style={styles.paragraph}>
          For legal or support inquiries, contact us at contact.movietracker@gmail.com
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
