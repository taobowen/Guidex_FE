import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Button, Card, Text as PaperText } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { CATEGORY, STANDARD, TYPE, CATEGORY_TEXT, STANDARD_TEXT, TYPE_TEXT } from '../../utils/const'; // Adjust the import path as necessary
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';



import axios from 'axios';

const themeColor = '#8fbff8'; // deep navy

export default function VideoUpload() {
  const router = useRouter();
  const [video, setVideo] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [category, setCategory] = useState<CATEGORY | null>(CATEGORY.SNOWBOARD); // default category
  const [standard, setStandard] = useState<STANDARD | null>(STANDARD.GENERAL); // default standard
  const [type, setType] = useState<TYPE | null>(TYPE.FLOW); // default type

  const categoryOptions = [CATEGORY.SNOWBOARD, CATEGORY.SKI];

  const standardOptions = useMemo(() => {
    if (category === CATEGORY.SNOWBOARD) {
      return [STANDARD.GENERAL, STANDARD.CASI, STANDARD.AASI, STANDARD.BASI];
    } else if (category === CATEGORY.SKI) {
      return [STANDARD.GENERAL, STANDARD.CISA];
    }
    return [];
  }, [category]);

  const typeOptions = [TYPE.FLOW, TYPE.CARVING];

  const [videoName, setVideoName] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const disabledUploadBtn = useMemo(() => {
    return !video || loading || type === '' || standard === '' || category === '';
  }, [video, loading, type, standard, category]);

  let pollTimer: NodeJS.Timeout;

  const handleFileUpload = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow access to your media library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedVideo = result.assets[0];
        const formatted = {
          uri: selectedVideo.uri,
          name: selectedVideo.fileName || 'video.mp4',
          size: selectedVideo.fileSize || 0,
          mimeType: 'video/mp4',
        };
        setVideo(formatted);
        setVideoName(formatted.name);
        console.log('Selected video from album:', formatted);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access album.');
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

      console.log('Uploading video:', video.uri);

      if (video.uri) {
        const fileUri = video.uri;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (!fileInfo.exists) {
          throw new Error("File not found.");
        }

        const file = {
          uri: fileUri,
          name: video.name || 'video.mp4',
          type: video.mimeType || 'video/mp4',
        } as any;

        formData.append('videoFile', file);
        formData.append("category", category?.toString() || '');
        formData.append("standard", standard?.toString() || '');
        formData.append("type", type?.toString() || '');

        console.log('Video file appended to formData:', video.name);
      } else {
        throw new Error('Video file is undefined.');
      }

      console.log('FormData prepared:', formData);
  
      const { data } = await axios({
        method: 'POST',
        url: 'https://aiskiingcoach.com/system/video/analyze',
        headers: {
          'Authorization': token,
        },
        data: formData,
      });

      console.log('Upload response:', data);
  
      if (data.code === 200) {
        // const resultId = data.data.resultId;
        const videoId = data.data.videoId;
        const resultId = data.data.resultId;
        pollAnalysisResult(videoId, resultId);
      } else {
        setLoading(false);
        Alert.alert('Error', `Failed to upload video. ${data.msg}`);
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
              <Text style={{ color: category === opt ? '#fff' : '#333' }}>{CATEGORY_TEXT[opt]}</Text>
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
              <Text style={{ color: standard === opt ? '#fff' : '#333' }}>{STANDARD_TEXT[opt]}</Text>
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
              <Text style={{ color: type === opt ? '#fff' : '#333' }}>{TYPE_TEXT[opt]}</Text>
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
            1. Size: Maximum 100MB{'\n'}
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
    padding: 16,
    gap: 16,
  },
  videoUpload_heading: {
    textAlign: 'center',
    fontWeight: 'bold',
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
