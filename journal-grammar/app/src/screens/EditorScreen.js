import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { analyze } from "../api";

export default function EditorScreen({ route, navigation }) {
  const { languageHint } = route.params;
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!text.trim()) return Alert.alert("Paste something", "Enter a journal sentence or paragraph.");
    setBusy(true);
    try {
      const data = await analyze({ languageHint, text, imageBase64: null, imageMime: null });
      navigation.navigate("Result", { analysis: data });
    } catch (e) {
      Alert.alert("Analysis failed", e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.note}>Language: {languageHint}</Text>
      <TextInput
        style={styles.box}
        placeholder="Write or paste your journal entry…"
        multiline
        value={text}
        onChangeText={setText}
      />

      <Pressable style={styles.btn} onPress={run} disabled={busy}>
        <Text style={styles.btnText}>{busy ? "Analyzing..." : "Get Feedback"}</Text>
      </Pressable>

      {busy && <ActivityIndicator size="large" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, gap: 12 },
  note: { opacity: 0.7 },
  box: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top"
  },
  btn: {
    backgroundColor: "black",
    padding: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  btnText: { color: "white", fontWeight: "700" }
});
