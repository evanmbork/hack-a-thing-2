import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";

export default function HomeScreen({ navigation }) {
  const [languageHint, setLanguageHint] = useState("Ukrainian");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal Grammar Coach</Text>
      <Text style={styles.subtitle}>Photo or text → detailed corrections + mini-lessons.</Text>

      <Text style={styles.label}>Language</Text>
      <TextInput
        style={styles.input}
        value={languageHint}
        onChangeText={setLanguageHint}
        placeholder="e.g., Ukrainian, Italian, Spanish"
      />

      <Pressable
        style={styles.btn}
        onPress={() => navigation.navigate("Capture", { languageHint })}
      >
        <Text style={styles.btnText}>Take / Choose Photo</Text>
      </Pressable>

      <Pressable
        style={styles.btnSecondary}
        onPress={() => navigation.navigate("Editor", { languageHint })}
      >
        <Text style={styles.btnText}>Write / Paste Text</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, gap: 12 },
  title: { fontSize: 26, fontWeight: "700", marginTop: 8 },
  subtitle: { fontSize: 14, opacity: 0.75 },
  label: { marginTop: 10, fontWeight: "600" },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10
  },
  btn: {
    backgroundColor: "black",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8
  },
  btnSecondary: {
    backgroundColor: "#333",
    padding: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  btnText: { color: "white", fontWeight: "700" }
});
