import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axiosInstance from '@/app/utils/axiosInstance';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function EditRecordPage() {
  const router = useRouter();
  const { inquireId } = useLocalSearchParams();

  const [content, setContent] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState('00:00:00');

  const videoRef = useRef<VideoView>(null);
  const player = useVideoPlayer(videoUri);
  

//   const [recordName, setRecordName] = useState('');
//   const [resortName, setResortName] = useState('');
//   const [recordTime, setRecordTime] = useState('');
//   const [date, setDate] = useState(new Date());
//   const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = () => {
    if (!recordName || !resortName || !recordTime) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    axiosInstance
      .post('/system/results/coach/feedback', {
        recordId: inquireId,
        content: content,
      })
      .then(response => {
        if (response.data.code === 200) {
          Alert.alert('Success', 'Feedback updated successfully!');
          router.back();
        } else {
          Alert.alert('Error', response.data.msg || 'Failed to update feedback');
        }
      })
      .catch(error => {
        console.error('Error updating feedback:', error);
        Alert.alert('Error', 'Failed to update feedback');
      });
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>Write Feedback</Text>

        {videoUri && (
            <VideoView
            ref={videoRef}
            style={styles.video}
            player={player}
            />
        )}

        <view style={styles.inputContainer}>
            <view>
                <view>Key Frame Feedback</view>
                <Button>Add at current time</Button>
            </view>
            <view>
                <view>current position</view>
                <view>{currentPosition}</view>
            </view>
            <view>
                <view>{currentPosition}</view>
                <view><Button>delete</Button></view>
            </view>
            <TextInput
              label="Feedback Content"
              value={content}
              onChangeText={setContent}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={4}
            />
        </view>
         
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.saveButton}
        labelStyle={{ color: '#fff' }}
      >
        Save Changes
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 24,
  },
  datePickerTouchable: {
    marginBottom: 16,
  }
});
