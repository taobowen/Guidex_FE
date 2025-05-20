import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Divider,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as Google from 'expo-auth-session/providers/google';

const themeColor = '#8fbff8'; // deep navy

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '574068163299-6o9j4ng2oncdisask3hsg6qcq584p1pa.apps.googleusercontent.com',
    androidClientId: '574068163299-6o9j4ng2oncdisask3hsg6qcq584p1pa.apps.googleusercontent.com',
    webClientId: '574068163299-6o9j4ng2oncdisask3hsg6qcq584p1pa.apps.googleusercontent.com',
    redirectUri: 'http://localhost:8081/auth/signIn',
  });

  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      const { url } = event;
      console.log('Redirected back with URL:', url);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication!;
      axios.post('https://your-backend.com/google-login', { idToken: id_token })
        .then(async (res) => {
          await AsyncStorage.setItem('authToken', res.data.token);
          router.push('/page/video');
        })
        .catch((err) => {
          console.error('Login failed', err);
        });
    }
  }, [response]);

  const validateInputs = () => {
    let isValid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validateInputs()) return;

    axios.post('https://aiskiingcoach.com/login', { email, password })
      .then(({ data }) => {
        if (data.code === 500) {
          alert('Invalid email or password');
          return;
        }
        AsyncStorage.setItem('authToken', data.token).then(() => {
          router.push('/page/video');
        });
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.signIn_container}>
      <Text style={styles.signIn_title}>Sign In</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        mode="outlined"
        error={!!emailError}
        theme={{ colors: { primary: themeColor } }}
        style={styles.signIn_input}
      />
      {emailError ? <Text style={styles.signIn_errorText}>{emailError}</Text> : null}

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        error={!!passwordError}
        style={styles.signIn_input}
        theme={{ colors: { primary: themeColor } }}
      />
      {passwordError ? <Text style={styles.signIn_errorText}>{passwordError}</Text> : null}

      <Button
        mode="text"
        onPress={() => router.push('/auth/reset')}
        compact
        style={styles.signIn_forgotPassword}
        textColor={themeColor}
      >
        Forgot your password?
      </Button>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.signIn_signIn}
        buttonColor={themeColor}
        textColor="#fff"
      >
        Sign In
      </Button>

    

      <Divider style={{ marginVertical: 16, backgroundColor: '#ccc' }} />

      <Button
        mode="outlined"
        onPress={() => promptAsync()}
        disabled={!request}
        textColor={themeColor}
        style={styles.signIn_outlinedBtn}
      >
        Sign in with Google
      </Button>

      <Button
        mode="outlined"
        onPress={() => router.push('/auth/signUp')}
        disabled={!request}
        textColor={themeColor}
        style={styles.signIn_signUp}
      >
        Sign up
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  signIn_container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  signIn_title: {
    fontSize: 28,
    color: themeColor,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '700',
  },
  signIn_input: {
    marginTop: 16,
    height: 40,
    backgroundColor: '#fff',
  },
  signIn_submit: {
    marginTop: 24,
    paddingVertical: 6,
    borderRadius: 4,
  },
  signIn_outlinedBtn: {
    borderColor: themeColor,
  },
  signIn_errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
  signIn_footerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#444',
  },
  signIn_linkText: {
    color: themeColor,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signIn_forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  signIn_signUp: {
    marginTop: 16,
    borderColor: themeColor,
  },
  signIn_signIn: {
    marginTop: 16,
  },
});

