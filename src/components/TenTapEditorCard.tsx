import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  RichText,
  useBridgeState,
  useEditorBridge,
  useEditorContent,
} from '@10play/tentap-editor';
import { HtmlPreviewBox } from './HtmlPreviewBox';

const INITIAL_TENTAP_HTML =
  '<p>Testing <b>TipTap WebView</b> typing fluidity with <i>@10play/tentap-editor</i>.</p>';

export const TenTapEditorCard: React.FC = () => {
  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    dynamicHeight: true,
    initialContent: INITIAL_TENTAP_HTML,
  });

  // Reactive editor state for toolbar toggle highlights
  const editorState = useBridgeState(editor);

  // Live HTML string subscription
  const html = useEditorContent(editor, { type: 'html' }) || INITIAL_TENTAP_HTML;

  // Active state flags directly from TipTap bridge state
  const isBold = !!(editorState as any).isBoldActive;
  const isItalic = !!(editorState as any).isItalicActive;
  const isUnderline = !!(editorState as any).isUnderlineActive;
  const isStrike = !!(editorState as any).isStrikeActive;
  const isH1 = (editorState as any).headingLevel === 1;
  const isBulletList = !!(editorState as any).isBulletListActive;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>2. @10play/tentap-editor</Text>
          <View style={[styles.badge, styles.tentapBadge]}>
            <Text style={styles.badgeText}>10Tap / WebView</Text>
          </View>
        </View>
        <Text style={styles.cardSubtitle}>
          TipTap & ProseMirror core hosted via react-native-webview
        </Text>
      </View>

      {/* Direct, Permanent Toolbar: Bold, Italic, Underline, Strikethrough, H1, Bullet List */}
      <View style={styles.toolbar}>
        {/* Bold */}
        <TouchableOpacity
          style={[styles.toolButton, isBold && styles.toolButtonActive]}
          onPress={() => editor.toggleBold()}
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
          onPress={() => editor.toggleItalic()}
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
          onPress={() => editor.toggleUnderline()}
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
          onPress={() => editor.toggleStrike()}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Strikethrough"
        >
          <Text style={[styles.toolLabel, styles.strikeLabel, isStrike && styles.toolLabelActive]}>
            S
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* H1 (Title) - stays in the same bar, never hides Bold/Italic */}
        <TouchableOpacity
          style={[styles.toolButton, styles.toolButtonWide, isH1 && styles.toolButtonActive]}
          onPress={() => editor.toggleHeading(1)}
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
          onPress={() => editor.toggleBulletList()}
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

      {/* 10Tap RichText WebView Surface */}
      <View style={styles.editorContainer}>
        <RichText editor={editor} style={styles.richText} />
      </View>

      {/* Live Generated HTML Output */}
      <HtmlPreviewBox
        html={html}
        label="2. @10play/tentap-editor output"
        accentColor="#a855f7"
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
  tentapBadge: {
    backgroundColor: '#9333ea',
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
    backgroundColor: '#a855f7',
  },
  toolLabel: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  toolLabelActive: {
    color: '#ffffff',
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
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 120,
    overflow: 'hidden',
  },
  richText: {
    minHeight: 120,
  },
});
