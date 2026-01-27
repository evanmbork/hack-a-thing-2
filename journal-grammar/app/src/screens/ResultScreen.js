import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import HighlightedText from "../components/HighlightedText";

export default function ResultScreen({ route }) {
  const { analysis } = route.params;

  const originalText = analysis.corrected_text;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.big}>Feedback</Text>
      <Text style={styles.meta}>Detected: {analysis.detected_language}</Text>

      <View style={styles.section}>
        <Text style={styles.h}>Overall</Text>
        <Text style={styles.p}>{analysis.overall_feedback}</Text>
      </View>

      <View style={styles.section}>
        <HighlightedText originalText={originalText} issues={analysis.issues} />
      </View>

      <View style={styles.section}>
        <Text style={styles.h}>Corrected version</Text>
        <Text style={styles.p}>{analysis.corrected_text}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  big: { fontSize: 26, fontWeight: "800" },
  meta: { marginTop: 6, opacity: 0.7 },
  section: { marginTop: 18, gap: 8 },
  h: { fontSize: 18, fontWeight: "800" },
  p: { fontSize: 16, lineHeight: 24 }
});
