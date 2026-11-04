import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  EnrichedTextInput,
  type EnrichedTextInputInstance,
  type OnChangeStateEvent,
} from 'react-native-enriched-html';
import { HtmlPreviewBox } from './HtmlPreviewBox';

const INITIAL_ENRICHED_HTML =
  '<p>Testing <b>pure native</b> typing fluidity with <i>react-native-enriched-html</i>.</p>';

export const EnrichedHtmlEditorCard: React.FC = () => {
  const editorRef = useRef<EnrichedTextInputInstance | null>(null);
  const [html, setHtml] = useState<string>(INITIAL_ENRICHED_HTML);
  const [activeState, setActiveState] = useState<OnChangeStateEvent | null>(null);

  const isBold = !!activeState?.bold?.isActive;
  const isItalic = !!activeState?.italic?.isActive;
  const isUnderline = !!activeState?.underline?.isActive;
  const isStrike = !!activeState?.strikeThrough?.isActive;
  const isH1 = !!activeState?.h1?.isActive;
  const isBulletList = !!activeState?.unorderedList?.isActive;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>1. react-native-enriched-html</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Software Mansion (Native)</Text>
          </View>
        </View>
        <Text style={styles.cardSubtitle}>
          Zero WebViews • Native UITextView (iOS) & EditText Spannables (Android)
        </Text>
      </View>

      {/* Pure Native Basic Toolbar */}
      <View style={styles.toolbar}>
        {/* Bold */}
        <TouchableOpacity
          style={[styles.toolButton, isBold && styles.toolButtonActive]}
          onPress={() => editorRef.current?.toggleBold()}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Bold"
        >
          <Text style={[styles.toolLabel, styles.boldLabel, isBold && styles.toolLabelActive]}>
            B
          </Text>
        </TouchableOpacity>

        {/* Italic */}
        <TouchableOpacity
          style={[styles.toolButton, isItalic && styles.toolButtonActive]}
          onPress={() => editorRef.current?.toggleItalic()}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Italic"
        >
          <Text style={[styles.toolLabel, styles.italicLabel, isItalic && styles.toolLabelActive]}>
            I
          </Text>
        </TouchableOpacity>

        {/* Underline */}
        <TouchableOpacity
          style={[styles.toolButton, isUnderline && styles.toolButtonActive]}
          onPress={() => editorRef.current?.toggleUnderline()}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Underline"
        >
          <Text
            style={[
              styles.toolLabel,
              styles.underlineLabel,
              isUnderline && styles.toolLabelActive,
            ]}
          >
            U
          </Text>
        </TouchableOpacity>

        {/* Strikethrough */}
        <TouchableOpacity
          style={[styles.toolButton, isStrike && styles.toolButtonActive]}
          onPress={() => editorRef.current?.toggleStrikeThrough()}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Strikethrough"
        >
          <Text style={[styles.toolLabel, styles.strikeLabel, isStrike && styles.toolLabelActive]}>
            S
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* H1 */}
        <TouchableOpacity
          style={[styles.toolButton, styles.toolButtonWide, isH1 && styles.toolButtonActive]}
          onPress={() => editorRef.current?.toggleH1()}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Heading 1"
        >
          <Text style={[styles.toolLabel, styles.h1Label, isH1 && styles.toolLabelActive]}>
            H1
          </Text>
        </TouchableOpacity>

        {/* Bullet List */}
        <TouchableOpacity
          style={[
            styles.toolButton,
            styles.toolButtonWide,
            isBulletList && styles.toolButtonActive,
          ]}
          onPress={() => editorRef.current?.toggleUnorderedList()}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Bullet List"
        >
          <Text
            style={[
              styles.toolLabel,
              styles.listLabel,
              isBulletList && styles.toolLabelActive,
            ]}
          >
            • List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Native Editor Surface */}
      <View style={styles.editorContainer}>
        <EnrichedTextInput
          ref={editorRef}
          defaultValue={INITIAL_ENRICHED_HTML}
          placeholder="Start typing in native editor..."
          placeholderTextColor="#64748b"
          scrollEnabled={false}
          onChangeState={(e) => {
            // Pure native event forwarding — no custom shadow state machine
            setActiveState(e.nativeEvent);
          }}
          onChangeHtml={(e) => {
            setHtml(e.nativeEvent.value);
          }}
          style={styles.editorInput}
        />
      </View>

      {/* Live Generated HTML Output */}
      <HtmlPreviewBox
        html={html}
        label="1. react-native-enriched-html output"
        accentColor="#38bdf8"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  badge: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 4,
    marginBottom: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  toolButton: {
    minWidth: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 6,
  },
  toolButtonWide: {
    minWidth: 44,
  },
  toolButtonActive: {
    backgroundColor: '#38bdf8',
  },
  toolLabel: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  toolLabelActive: {
    color: '#0f172a',
    fontWeight: '700',
  },
  boldLabel: {
    fontWeight: '800',
  },
  italicLabel: {
    fontStyle: 'italic',
  },
  underlineLabel: {
    textDecorationLine: 'underline',
  },
  strikeLabel: {
    textDecorationLine: 'line-through',
  },
  h1Label: {
    fontSize: 13,
    fontWeight: '800',
  },
  listLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#334155',
    marginHorizontal: 2,
  },
  editorContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 120,
    padding: 12,
  },
  editorInput: {
    color: '#f8fafc',
    fontSize: 15,
    lineHeight: 22,
    minHeight: 100,
  },
});
