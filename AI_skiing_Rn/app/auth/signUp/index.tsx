import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  Checkbox,
  Text,
  Card,
  Divider,
  useTheme,
} from 'react-native-paper';

export default function SignUp() {
  const theme = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscribe, setSubscribe] = useState(false);

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

    console.log({
      name,
      email,
      password,
      subscribe,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Sign Up" titleStyle={styles.title} />
        <Card.Content>
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            mode="outlined"
            error={!!nameError}
          />
          {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            error={!!emailError}
            style={styles.input}
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            error={!!passwordError}
            style={styles.input}
          />
          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : null}

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={subscribe ? 'checked' : 'unchecked'}
              onPress={() => setSubscribe(!subscribe)}
            />
            <Text style={styles.checkboxLabel}>
              I want to receive updates via email.
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitBtn}
          >
            Sign Up
          </Button>

          <Divider style={styles.divider} />

          <Button
            mode="outlined"
            onPress={() => alert('Sign up with Google')}
            icon="google"
            style={styles.googleBtn}
          >
            Sign up with Google
          </Button>

          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text
              onPress={() => alert('Navigate to Sign In')}
              style={styles.linkText}
            >
              Sign in
            </Text>
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f6f6f6',
  },
  card: {
    padding: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  input: {
    marginTop: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    flexShrink: 1,
  },
  submitBtn: {
    marginVertical: 12,
  },
  googleBtn: {
    marginTop: 12,
  },
  divider: {
    marginVertical: 16,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 16,
  },
  linkText: {
    color: '#1e88e5',
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
