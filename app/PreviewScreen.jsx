import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { imageToBase64 } from '../lib/gemini';

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams();
  const router = useRouter();

  async function handleAnalyze(promptKey) {
    const base64Image = await imageToBase64(photoUri);
    router.push({ pathname: '/ResultScreen', params: { base64Image, promptKey } });
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photoUri }}
        style={styles.preview}
        resizeMode="contain"
      />

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.personaRow}>
        <TouchableOpacity
          style={styles.personaButton}
          onPress={() => handleAnalyze('academic')}
        >
          <Text style={styles.personaText}>🎓 Academic</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.personaButton}
          onPress={() => handleAnalyze('safety')}
        >
          <Text style={styles.personaText}>⚠️ Safety</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.personaButton}
          onPress={() => handleAnalyze('inventory')}
        >
          <Text style={styles.personaText}>📋 Inventory</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  preview: { flex: 1 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
    backgroundColor: '#000',
  },
  retakeButton: {
    backgroundColor: '#5A6472',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 8,
  },
  personaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#000',
  },
  personaButton: {
    backgroundColor: '#5B3FA3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  personaText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});