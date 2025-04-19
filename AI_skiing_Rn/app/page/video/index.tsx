import React from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Button, Card, Avatar, Text as PaperText } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';


export default function VideoUpload() {

  const router = useRouter();

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });
      if (result.assets && result.assets.length > 0) {
        console.log('Selected video:', result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick a file.');
    }
  };

  const handleGenerateSuggestion = () => {
    router.push('/page/evaluation'); // Replace 'EvaluationPage' with the actual route name from your navigation setup
  };

  return (
    <View style={styles.container}>
      <View style={styles.alertBox}>
        <PaperText variant="bodyMedium" style={styles.infoAlert}>
          This is an info alert.
        </PaperText>
      </View>

      <PaperText variant="headlineMedium" style={styles.heading}>
        Upload Video
      </PaperText>

      <Button
        mode="outlined"
        icon="upload"
        onPress={handleFileUpload}
        style={styles.uploadBtn}
      >
        Choose Video File
      </Button>

      <Card style={styles.card}>
        <Card.Title title="Video Requirements" />
        <Card.Content>
          <PaperText variant="bodyMedium">
            1. Format: mp4{'\n'}
            2. You must be clearly visible in the video
          </PaperText>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        buttonColor="green"
        icon="video"
        onPress={handleGenerateSuggestion}
        style={styles.analyzeBtn}
        contentStyle={{ height: 48 }}
      >
        Analyze Video
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  alertBox: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  infoAlert: {
    color: '#1976d2',
    textAlign: 'center',
  },
  heading: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  uploadBtn: {
    width: '100%',
  },
  card: {
    width: '100%',
    marginTop: 16,
  },
  analyzeBtn: {
    width: '100%',
    marginTop: 24,
  },
});
