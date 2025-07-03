import * as AppleAuthentication from 'expo-apple-authentication';
import * as React from 'react';
import { View, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function AppleLoginBtn() {
  const router = useRouter();

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken } = credential;

      axios.post('https://aiskiingcoach.com/auth/apple/token', { identityToken }).then(({ data }) => {
        if (data.code === 500) {
          alert('Invalid Apple login');
          return;
        }

        console.log('Apple login successful:', data);
        AsyncStorage.setItem('authToken', data.data.token).then(() => {
          router.push('/page/video');
        });
      });

      // You can now send `credential.identityToken` to your backend for verification

    } catch (e: any) {
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
        Alert.alert('Cancelled');
      } else {
        Alert.alert('Apple Login Error', e.message);
      }
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ height: 44, marginTop: 20 }}
      onPress={handleAppleSignIn}
    />
  );
}
