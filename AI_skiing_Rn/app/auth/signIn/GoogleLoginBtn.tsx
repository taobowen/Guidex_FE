import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function GoogleLoginBtn() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type === 'success') {
        await axios.post('https://aiskiingcoach.com/auth/google/token', {
          idToken: response.data.idToken,
        }).then(({ data }) => {
          console.log('Google Sign-In data:', data);
          if (data.code === 200) {
            AsyncStorage.setItem('authToken', data.data.token).then(() => {
              router.push('/page/video');
            });
          }
          
        }).catch((error) => {
          console.error('Google Sign-In error:', error);
          alert('Google Sign-In failed. Please try again.');
        });
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.btn} onPress={handleGoogleSignIn}>
      <Image
        source={require('./google-icon.png')} // 👈 Use the official "G" logo here
        style={styles.icon}
      />
      <Text style={styles.text}>Sign in with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    justifyContent: 'center',
    marginTop: 10,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  text: {
    fontSize: 16,
    color: '#5F6368', // official dark gray text color
    fontWeight: '500',
  },
});


