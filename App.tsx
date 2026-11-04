import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { EnrichedHtmlEditorCard } from './src/components/EnrichedHtmlEditorCard';
import { TenTapEditorCard } from './src/components/TenTapEditorCard';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* App Header */}
            <View style={styles.header}>
              <Text style={styles.appTitle}>Rich Text Editor Comparison</Text>
              <Text style={styles.appDescription}>
                Direct side-by-side comparison of Software Mansion's pure native editor vs
                10Tap's WebView-based editor on physical devices.
              </Text>

              {/* Evaluation Target Chips */}
              <View style={styles.chipRow}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>⚡ Typing Fluidity</Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>🔲 Trailing Space Boundaries</Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>🔄 Toggle States</Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>⌨️ Caret & Keyboard</Text>
                </View>
              </View>
            </View>

            {/* Stacked Editor A: react-native-enriched-html */}
            <EnrichedHtmlEditorCard />

            {/* Stacked Editor B: @10play/tentap-editor */}
            <TenTapEditorCard />

            {/* Evaluation Guidelines Card */}
            <View style={styles.guideCard}>
              <Text style={styles.guideTitle}>📋 Physical Device Testing Checklist</Text>
              <Text style={styles.guideItem}>
                • <Text style={styles.guideBold}>Typing Latency:</Text> Type rapidly on Android soft
                keyboard to test input lag and character dropping.
              </Text>
              <Text style={styles.guideItem}>
                • <Text style={styles.guideBold}>Space Boundary:</Text> Type a word followed by space,
                toggle Bold/Italic, and observe if trailing space or cursor jumps.
              </Text>
              <Text style={styles.guideItem}>
                • <Text style={styles.guideBold}>List Enter Key:</Text> Create bullet items, press
                Enter to verify list item creation, and press Enter again on empty item to exit.
              </Text>
              <Text style={styles.guideItem}>
                • <Text style={styles.guideBold}>Live HTML Sync:</Text> Inspect the generated HTML
                boxes below each editor to compare semantic output.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0f1d',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  appDescription: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
    lineHeight: 18,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
  },
  guideCard: {
    backgroundColor: '#131c31',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e2e4a',
    padding: 16,
    marginTop: 4,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#60a5fa',
    marginBottom: 10,
  },
  guideItem: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
    marginBottom: 6,
  },
  guideBold: {
    fontWeight: '700',
    color: '#f1f5f9',
  },
});
