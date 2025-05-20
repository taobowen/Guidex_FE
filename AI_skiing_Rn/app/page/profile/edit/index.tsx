import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity, Platform } from 'react-native';
import { TextInput, Button, Text, Avatar, Menu, ToggleButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';


const themeColor = '#8fbff8'; // deep navy


const EditProfilePage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [sex, setSex] = useState('0');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem('authToken');
      try {
        const { data } = await axios.get('https://aiskiingcoach.com/system/user/get-user', {
          headers: { Authorization: token },
        });
        if (data.code === 200) {
          setUsername(data.data.userName);
          setSex(data.data.sex);
          setAvatarUri(data.data.avatar);
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to load profile data.');
      }
    };
    fetchProfile();
  }, []);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false,
    });
  
    if (!result.canceled) {
      const originalUri = result.assets[0].uri;
  
      if (Platform.OS === 'web') {
        // For web, use blob URI directly (converted later for axios)
        console.log('Web URI:', originalUri);
        setAvatarUri(originalUri);
      } else {
        // For mobile, compress + resize
        const compressed = await ImageManipulator.manipulateAsync(
          originalUri,
          [{ resize: { width: 512 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        setAvatarUri(compressed.uri); // This is a file:// URI
      }
    }
  };
  
  const handleSave = async () => {
    const token = await AsyncStorage.getItem('authToken');
  
    const formData = new FormData();
    formData.append('userName', username);
    formData.append('sex', sex.toString());
  
    if (avatarUri) {
      // if (Platform.OS === 'web') {
      //   // Fetch the blob for browser upload
      //   const res = await fetch(avatarUri);
      //   const blob = await res.blob();
  
      //   formData.append('avatarFile', blob, 'avatar.jpg');
      // } else {
      //   const file = {
      //     uri: avatarUri,
      //     type: 'image/jpeg',
      //     name: 'avatar.jpg',
      //   } as any; // Cast to any to bypass type issues
      //   formData.append('avatarFile', file);
      // }
      const file = {
        uri: avatarUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any; // Cast to any to bypass type issues
      formData.append('avatarFile', file);
    }
  
    try {
      const response = await axios.put(
        'https://aiskiingcoach.com/system/user/profile',
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.data.code === 200) {
        Alert.alert('Success', 'Profile updated.');
        router.back();
      } else {
        Alert.alert('Error', response.data.msg || 'Failed to update.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Upload failed.');
    }
  };
  

  return (
    <View style={styles.editProfile_container}>
      <Text variant="titleLarge" style={styles.editProfile_header}>Edit Profile</Text>

      <TouchableOpacity onPress={pickAvatar} style={styles.editProfile_avatarContainer}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.editProfile_avatar} />
        ) : (
          <Avatar.Icon size={100} icon="camera" color="#fff" style={{ backgroundColor: themeColor }} />
        )}
      </TouchableOpacity>

      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.editProfile_input}
        mode="outlined"
        theme={{ colors: { primary: '#333' } }}
      />

      <Text variant="labelLarge" style={{ marginBottom: 8 }}>Gender</Text>
      <ToggleButton.Row
        onValueChange={value => setSex(value)}
        value={sex}
        style={styles.editProfile_toggleRow}
      >
        <ToggleButton icon="gender-male" iconColor={themeColor} value="0" />
        <ToggleButton icon="gender-female" iconColor='pink' value="1" />
      </ToggleButton.Row>


      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.editProfile_saveButton}
        buttonColor={themeColor}
        textColor="#fff"
      >
        Save Changes
      </Button>
    </View>
  );
};

export default EditProfilePage;

const styles = StyleSheet.create({
  editProfile_container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  editProfile_header: {
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  editProfile_input: {
    marginBottom: 16,
    color: '#333',
    borderColor: '#333',
    backgroundColor: '#fff',
  },
  editProfile_saveButton: {
    marginTop: 16,
  },
  editProfile_avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  editProfile_avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editProfile_changeText: {
    marginTop: 8,
    fontWeight: '500',
  },
  editProfile_select: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderColor: '#333',
    color: '#333',
  },
  editProfile_selectText: {
    fontSize: 16,
    borderColor: '#333',
    color: '#333',
  },
  editProfile_toggleRow: {
    marginBottom: 24,
  },
});
