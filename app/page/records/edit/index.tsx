import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axiosInstance from '@/app/utils/axiosInstance';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native';

export default function EditRecordPage() {
  const router = useRouter();
  const { resultId } = useLocalSearchParams();

  const [recordName, setRecordName] = useState('');
  const [resortName, setResortName] = useState('');
  const [recordTime, setRecordTime] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  React.useEffect(() => {
    fetchRecordData();
  }, []);

  const fetchRecordData = async () => {
    try {
      const response = await axiosInstance.get(`https://aiskiingcoach.com/system/results/${resultId}`);
      if (response.data.code === 200) {
        const { skiTitle, skiLocation, skiTime } = response.data.data;
        setRecordName(skiTitle);
        setResortName(skiLocation);
        setRecordTime(skiTime ? new Date(skiTime).toISOString().split('T')[0] : ''); // yyyy-MM-dd
        setDate(new Date(skiTime));
      } else {
        Alert.alert('Error', 'Failed to fetch record data');
      }
    } catch (error) {
      console.error('Error fetching record data:', error);
      Alert.alert('Error', 'Failed to fetch record data');
    }
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0]; // yyyy-MM-dd
      setRecordTime(formattedDate);
    }
  };

  const handleSave = () => {
    if (!recordName || !resortName || !recordTime) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    axiosInstance
      .put('https://aiskiingcoach.com/system/results', {
        id: resultId,
        skiTitle: recordName,
        skiLocation: resortName,
        skiTime: recordTime,
      })
      .then(response => {
        if (response.data.code === 200) {
          Alert.alert('Success', 'Record updated successfully!');
          router.back();
        } else {
          Alert.alert('Error', response.data.msg || 'Failed to update record');
        }
      })
      .catch(error => {
        console.error('Error updating record:', error);
        Alert.alert('Error', 'Failed to update record');
      });
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>Edit Record</Text>

      <TextInput
        label="Record Name"
        value={recordName}
        onChangeText={setRecordName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Ski Resort"
        value={resortName}
        onChangeText={setResortName}
        style={styles.input}
        mode="outlined"
      />


      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.datePickerTouchable}>
        <TextInput
          label="Record Date"
          value={recordTime}
          style={styles.input}
          mode="outlined"
          editable={false} // still uneditable
          pointerEvents="none" // allow TouchableOpacity to capture taps
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Button
        mode="contained"
        onPress={handleSave}
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
