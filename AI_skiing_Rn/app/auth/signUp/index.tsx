import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Divider,
} from 'react-native-paper';
import axios from 'axios';
import { useRouter } from 'expo-router';

const themeColor = '#8fbff8';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateInputs = () => {
    let isValid = true;

    if (!name) {
      setNameError('Name is required.');
      isValid = false;
    } else {
      setNameError('');
    }

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

    axios.post('https://aiskiingcoach.com/register', {
      username: name,
      email,
      password,
    }).then(({ data }) => {
      if (data.code === 500) {
        alert('User already exists');
      }
      if (data.code === 200) {
        alert('User created successfully');
        router.push('/auth/signIn');
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.signUp_container}>
      <Text style={styles.signUp_title}>Sign Up</Text>

      <TextInput
        label="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        mode="outlined"
        error={!!nameError}
        style={styles.signUp_input}
        theme={{ colors: { primary: themeColor } }}
      />
      {nameError ? <Text style={styles.signUp_error}>{nameError}</Text> : null}

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
        error={!!emailError}
        style={styles.signUp_input}
        theme={{ colors: { primary: themeColor } }}
      />
      {emailError ? <Text style={styles.signUp_error}>{emailError}</Text> : null}

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        error={!!passwordError}
        style={styles.signUp_input}
        theme={{ colors: { primary: themeColor } }}
      />
      {passwordError ? (
        <Text style={styles.signUp_error}>{passwordError}</Text>
      ) : null}

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.signUp_submitBtn}
        buttonColor={themeColor}
        textColor="#fff"
      >
        Sign Up
      </Button>

      <Divider style={styles.signUp_divider} />

      <Button
        mode="outlined"
        onPress={() => alert('Sign up with Google')}
        icon="google"
        style={styles.signUp_googleBtn}
        textColor={themeColor}
      >
        Sign up with Google
      </Button>

      <Text style={styles.signUp_footerText}>
        Already have an account?{' '}
        <Text
          onPress={() => router.push('/auth/signIn')}
          style={styles.signUp_linkText}
        >
          Sign in
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  signUp_container: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f6f6f6',
  },
  signUp_title: {
    fontSize: 26,
    fontWeight: '700',
    color: themeColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  signUp_input: {
    marginTop: 12,
    backgroundColor: '#fff',
  },
  signUp_submitBtn: {
    marginVertical: 12,
  },
  signUp_googleBtn: {
    marginTop: 12,
    borderColor: themeColor,
    borderWidth: 1.4,
  },
  signUp_divider: {
    marginVertical: 16,
  },
  signUp_footerText: {
    textAlign: 'center',
    marginTop: 16,
  },
  signUp_linkText: {
    color: themeColor,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  signUp_error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
