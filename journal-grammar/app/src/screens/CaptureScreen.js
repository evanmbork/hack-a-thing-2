import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { analyze } from "../api";

export default function CaptureScreen({ route, navigation }) {
  const { languageHint } = route.params;
  const [previewUri, setPreviewUri] = useState(null);
  const [busy, setBusy] = useState(false);

  async function pickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert("Permission needed", "Allow photo library access.");

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      base64: true
    });

    if (!result.canceled) {
      setPreviewUri(result.assets[0].uri);
      return result.assets[0];
    }
    return null;
  }

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return Alert.alert("Permission needed", "Allow camera access.");

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      base64: true
    });

    if (!result.canceled) {
      setPreviewUri(result.assets[0].uri);
      return result.assets[0];
    }
    return null;
  }

  async function run(asset) {
    if (!asset?.base64) return;
    setBusy(true);
    try {
      const mime = asset.mimeType || "image/jpeg";
      const data = await analyze({
        languageHint,
        text: "",
        imageBase64: asset.base64,
        imageMime: mime
      });
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

      <View style={styles.row}>
        <Pressable style={styles.btn} onPress={async () => run(await takePhoto())}>
          <Text style={styles.btnText}>Take Photo</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={async () => run(await pickImage())}>
          <Text style={styles.btnText}>Choose Photo</Text>
        </Pressable>
      </View>

      {busy && <ActivityIndicator size="large" />}

      {previewUri && (
        <Image source={{ uri: previewUri }} style={styles.preview} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, gap: 12 },
  note: { opacity: 0.7 },
  row: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    backgroundColor: "black",
    padding: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  btnText: { color: "white", fontWeight: "700" },
  preview: { width: "100%", height: 380, borderRadius: 12, marginTop: 10 }
});
