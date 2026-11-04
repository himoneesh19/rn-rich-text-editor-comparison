import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HtmlPreviewBoxProps {
  html: string;
  label?: string;
  accentColor?: string;
}

export const HtmlPreviewBox: React.FC<HtmlPreviewBoxProps> = ({
  html,
  label = 'LIVE HTML OUTPUT',
  accentColor = '#38bdf8',
}) => {
  const charCount = html ? html.length : 0;
  const tagCount = (html.match(/<[^>]+>/g) || []).length;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.labelGroup}>
          <View style={[styles.dotIndicator, { backgroundColor: accentColor }]} />
          <Text style={[styles.labelText, { color: accentColor }]}>{label}</Text>
        </View>
        <View style={styles.metricsGroup}>
          <Text style={styles.metricBadge}>{charCount} chars</Text>
          <Text style={styles.metricBadge}>{tagCount} tags</Text>
        </View>
      </View>
      <View style={styles.codeContainer}>
        <Text style={styles.codeText} selectable>
          {html && html.trim().length > 0 ? html : '<p></p>'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  metricsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  metricBadge: {
    fontSize: 10,
    color: '#94a3b8',
    backgroundColor: '#1e293b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  codeContainer: {
    padding: 10,
    maxHeight: 120,
  },
  codeText: {
    color: '#34d399',
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
});
