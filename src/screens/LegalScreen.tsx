import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LegalScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Legal & Policies</Text>
          <Text style={styles.subtitle}>Read how we protect you and set the rules</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('PrivacyPolicy')}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('Terms')}>
            <Text style={styles.linkText}>Terms & Conditions</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('CommunityGuidelines')}>
            <Text style={styles.linkText}>Community Guidelines</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 6 },
  section: { paddingHorizontal: 20 },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  linkText: { fontSize: 16, color: '#1a1a1a' },
  arrow: { fontSize: 22, color: '#999' },
});


