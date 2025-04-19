import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  Checkbox,
  Text,
  Card,
  Divider,
} from 'react-native-paper';

import { useRouter } from 'expo-router';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  

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

    console.log({
      email,
      password,
    });

    router.push('/page/video');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Sign In" titleStyle={styles.title} />
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            mode="outlined"
            error={!!emailError}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

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
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={rememberMe ? 'checked' : 'unchecked'}
              onPress={() => setRememberMe(!rememberMe)}
            />
            <Text style={styles.checkboxLabel}>Remember me</Text>
          </View>

          {/* ForgotPassword logic would go here */}
          <Button mode="contained" onPress={handleSubmit} style={styles.submit}>
            Sign In
          </Button>

          <Button
            mode="text"
            onPress={() => setOpen(true)}
            compact
            style={{ alignSelf: 'center' }}
          >
            Forgot your password?
          </Button>

          <Divider style={{ marginVertical: 16 }} />

          <Button
            mode="outlined"
            onPress={() => alert('Sign in with Google')}
          >
            Sign in with Google
          </Button>

          <Text style={styles.footerText}>
            Don’t have an account?{' '}
            <Text
              style={styles.linkText}
              onPress={() => router.push('/auth/signUp')}
            >
              Sign up
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
  },
  submit: {
    marginVertical: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  footerText: {
    marginTop: 16,
    textAlign: 'center',
  },
  linkText: {
    color: '#1e88e5',
    textDecorationLine: 'underline',
  },
});
