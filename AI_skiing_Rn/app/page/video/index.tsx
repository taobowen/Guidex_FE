import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Button, Card, Text as PaperText } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

import axios from 'axios';

const themeColor = '#8fbff8'; // deep navy

export default function VideoUpload() {
  const router = useRouter();
  const [video, setVideo] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [category, setCategory] = useState('Snowboard'); // default category
  const [standard, setStandard] = useState('');
  const [type, setType] = useState('');

  const categoryOptions = ['Snowboard', 'Ski'];

  const standardOptions = useMemo(() => {
    if (category === 'Ski') {
      return ['General', 'CISA'];
    } else if (category === 'Snowboard') {
      return ['General','CASI', 'AASI', 'BASI'];
    }
    return [];
  }, [category]);

  const typeOptions = ['Flow', 'Carving'];

  const [videoName, setVideoName] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const disabledUploadBtn = useMemo(() => {
    return !video || loading || type === '' || standard === '' || category === '';
  }, [video, loading, type, standard, category]);

  let pollTimer: NodeJS.Timeout;


  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const selectedVideo = result.assets[0];
        setVideo(selectedVideo);
        setVideoName(selectedVideo?.name);
        console.log('Selected video:', selectedVideo);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick a file.');
      console.error(error);
    }
  };

  const handleGenerateSuggestion = async () => {
    if (!video) {
      Alert.alert('Error', 'Please upload a video before analyzing.');
      return;
    }
  
    try {
      const formData = new FormData();
      const token = await AsyncStorage.getItem('authToken');
      setLoading(true);
  
      if (video.file) {
        const fileBlob = new Blob([video.file], { type: video.mimeType || 'video/mp4' });
        formData.append("videoFile", fileBlob, video.name || 'video.mp4');
      } else {
        throw new Error('Video file is undefined.');
      }
  
      const { data } = await axios({
        method: 'POST',
        url: 'https://aiskiingcoach.com/system/video/analyze',
        headers: {
          'Authorization': token,
        },
        data: formData,
      });
  
      if (data.code === 200) {
        // const resultId = data.data.resultId;
        const videoId = data.data.videoId;
        const resultId = data.data.resultId;
        pollAnalysisResult(videoId, resultId);
      } else {
        setLoading(false);
        Alert.alert('Error', 'Failed to upload video.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload video.');
    }
  };
  

  const pollAnalysisResult = async (videoId: string, resultId: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
  
      pollTimer = setInterval(async () => {
        const res = await axios.get(`https://aiskiingcoach.com/system/video/${videoId}`, {
          headers: { Authorization: token },
        });
  
        if (res.data.code === 200) {
          if (res.data.data.status === 2) {
            clearInterval(pollTimer);
            setLoading(false);
            router.push(`/page/evaluation?resultId=${resultId}&videoId=${videoId}`);
          } else if (res.data.data.status === 3) {
            clearInterval(pollTimer);
            setLoading(false);
            Alert.alert('Error', 'Video analysis failed.');
          }
        }
      }, 2000); // every 3 seconds
    } catch (err) {
      clearInterval(pollTimer);
      setLoading(false);
      Alert.alert('Error', 'Polling failed');
      console.error(err);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.records_scrollArea}>
      <PaperText variant="headlineMedium" style={styles.videoUpload_heading}>
        Upload Video
      </PaperText>

      <View style={styles.videoUpload_uploadWrapper}>

        <TouchableOpacity style={styles.videoUpload_uploadZone} onPress={handleFileUpload}>
          <MaterialIcons name="upload-file" size={40} color="#333" />
          <Text style={styles.videoUpload_uploadText}>Tap to Upload Video</Text>
        </TouchableOpacity>
      </View>

      {videoName && (
        <Text style={styles.videoUpload_fileName}>Uploaded: {videoName}</Text>
      )}

      <View style={{ width: '100%', gap: 16 }}>
        <Text style={{ fontWeight: '600', color: '#333' }}>Category</Text>
        <View style={styles.selectWrapper}>
          {categoryOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setCategory(opt)}
              style={[
                styles.selectOption,
                category === opt && styles.selectOptionSelected,
              ]}
            >
              <Text style={{ color: category === opt ? '#fff' : '#333' }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ fontWeight: '600', color: '#333' }}>Standard</Text>
        <View style={styles.selectWrapper}>
          {standardOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setStandard(opt)}
              style={[
                styles.selectOption,
                standard === opt && styles.selectOptionSelected,
              ]}
            >
              <Text style={{ color: standard === opt ? '#fff' : '#333' }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ fontWeight: '600', color: '#333' }}>Type</Text>
        <View style={styles.selectWrapper}>
          {typeOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setType(opt)}
              style={[
                styles.selectOption,
                type === opt && styles.selectOptionSelected,
              ]}
            >
              <Text style={{ color: type === opt ? '#fff' : '#333' }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Card style={styles.videoUpload_card}>
        <Card.Title
          title="Video Requirements"
          titleStyle={{ color: '#333', fontWeight: '600' }}
        />
        <Card.Content>
          <PaperText variant="bodyMedium" style={{ color: '#333' }}>
            1. Format: mp4{'\n'}
            2. You must be clearly visible in the video
          </PaperText>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        icon={loading ? 'loading' : 'video'}
        disabled={disabledUploadBtn}
        loading={loading}
        onPress={handleGenerateSuggestion}
        style={[
          styles.videoUpload_analyzeBtn,
          disabledUploadBtn && styles.videoUpload_analyzeBtnDisabled,
        ]}
        contentStyle={{ height: 48 }}
        labelStyle={{ fontWeight: '600', color: '#fff' }}
      >
        {loading ? 'Analyzing...' : 'Analyze Video'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  videoUpload_container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 24,
    backgroundColor: '#ffffff',
  },
  records_scrollArea: {
    marginTop: 24,
    padding: 16,
    gap: 16,
  },
  videoUpload_heading: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  videoUpload_uploadBtn: {
    width: '100%',
    borderColor: '#333',
  },
  videoUpload_fileName: {
    marginTop: 12,
    fontStyle: 'italic',
    color: '#333',
  },
  videoUpload_card: {
    width: '100%',
    marginTop: 16,
    backgroundColor: '#f8f9fa',
  },
  videoUpload_uploadWrapper: {
    width: '100%',
  },
  videoUpload_uploadZone: {
    width: '100%',
    height: 180,
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 16,
  },
  videoUpload_uploadText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  videoUpload_analyzeBtn: {
    width: '100%',
    backgroundColor: themeColor,
    borderColor: '#d1d1d1',
    color: '#fff',
  },
  videoUpload_analyzeBtnDisabled: {
    width: '100%',
    backgroundColor: '#d1d1d1',
    borderColor: '#d1d1d1',
    color: '#fff',
  },

  selectWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  selectOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#aaa',
    backgroundColor: '#f0f0f0',
  },
  selectOptionSelected: {
    backgroundColor: themeColor,
    borderColor: themeColor,
  },

});
