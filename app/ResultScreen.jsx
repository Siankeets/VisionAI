import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { analyzeImage, PROMPTS } from '../lib/gemini';

export default function ResultScreen() {
  const { base64Image, promptKey } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    runAnalysis();
  }, []);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const prompt = PROMPTS[promptKey] ?? PROMPTS.academic;
      const result = await analyzeImage(base64Image, prompt);
      console.log('Gemini response:', JSON.stringify(result));
      const textPart = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textPart) throw new Error('Empty response from Gemini');
      const cleaned = textPart.replace(/```json|```/g, '').trim();
      setAnalysis(JSON.parse(cleaned));
    } catch (err) {
      console.log('Error:', err.message);
      setError('Could not analyze this image. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5B3FA3" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <Text style={styles.sectionTitle}>🧱 Objects</Text>
      <View style={styles.card}>
        {analysis.objects.map((obj, i) => (
          <Text key={i} style={styles.listItem}>• {obj}</Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>🌍 Context</Text>
      <View style={styles.card}>
        <Text style={styles.bodyText}>{analysis.context}</Text>
      </View>

      <Text style={styles.sectionTitle}>⚡ Activities</Text>
      <View style={styles.card}>
        <Text style={styles.bodyText}>{analysis.activities}</Text>
      </View>

      <Text style={styles.sectionTitle}>💡 Recommendations</Text>
      <View style={styles.card}>
        <Text style={styles.bodyText}>{analysis.recommendations}</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FA' },
  content: { padding: 20, paddingTop: 40, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F4F6FA' },
  loadingText: { marginTop: 12, color: '#5A6472', fontSize: 16 },
  errorText: { color: '#B3261E', textAlign: 'center', fontSize: 16 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#5B3FA3', marginTop: 20, marginBottom: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  listItem: { fontSize: 15, color: '#2B2F38', marginBottom: 4 },
  bodyText: { fontSize: 15, color: '#2B2F38', lineHeight: 22 },
});