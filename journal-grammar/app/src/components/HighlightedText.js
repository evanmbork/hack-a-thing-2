import React, { useMemo, useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";

// We highlight based on ORIGINAL input offsets.
// In the Result screen we show "original with highlights" + "corrected text" separately.

export default function HighlightedText({ originalText, issues }) {
  const [activeId, setActiveId] = useState(null);

  const segments = useMemo(() => {
    const sorted = [...issues].sort((a, b) => a.start - b.start);
    const out = [];
    let i = 0;

    for (const issue of sorted) {
      const s = Math.max(0, issue.start);
      const e = Math.max(s, issue.end);

      if (s > i) out.push({ type: "plain", text: originalText.slice(i, s), key: `p-${i}` });
      out.push({ type: "issue", text: originalText.slice(s, e), issue, key: issue.id });
      i = e;
    }
    if (i < originalText.length) out.push({ type: "plain", text: originalText.slice(i), key: `p-${i}` });
    return out;
  }, [originalText, issues]);

  const active = issues.find(x => x.id === activeId) || null;

  return (
    <View style={{ gap: 12 }}>
      <Text style={styles.header}>Original (tap highlights)</Text>
      <Text style={styles.text}>
        {segments.map(seg => {
          if (seg.type === "plain") return <Text key={seg.key}>{seg.text}</Text>;
          return (
            <Pressable key={seg.key} onPress={() => setActiveId(seg.issue.id)}>
              <Text style={styles.highlight}>{seg.text}</Text>
            </Pressable>
          );
        })}
      </Text>

      {active && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {active.type.toUpperCase()} · {active.severity.toUpperCase()}
          </Text>
          <Text style={styles.cardLine}><Text style={styles.bold}>Fix:</Text> {active.suggested_fix}</Text>
          <Text style={styles.cardLine}><Text style={styles.bold}>Why:</Text> {active.explanation}</Text>
          <Text style={styles.cardLine}><Text style={styles.bold}>Tags:</Text> {active.grammar_tags.join(", ")}</Text>
          <Text style={styles.cardLine}><Text style={styles.bold}>Mini-lesson:</Text> {active.mini_lesson}</Text>
          {active.examples?.length > 0 && (
            <Text style={styles.cardLine}><Text style={styles.bold}>Examples:</Text> {active.examples.join(" · ")}</Text>
          )}
          <Pressable onPress={() => setActiveId(null)} style={styles.dismiss}>
            <Text style={{ color: "white", fontWeight: "700" }}>Close</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontWeight: "700", fontSize: 16 },
  text: { fontSize: 16, lineHeight: 24 },
  highlight: {
    backgroundColor: "#ffe58f",
    borderRadius: 6
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    padding: 12,
    gap: 6
  },
  cardTitle: { fontWeight: "800" },
  cardLine: { lineHeight: 20 },
  bold: { fontWeight: "800" },
  dismiss: {
    marginTop: 8,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
    alignItems: "center"
  }
});
