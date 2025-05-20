import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


export default function Welcome() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

   useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();


    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setTimeout(() => {
          if (token) {
            router.replace('/page/video');
          } else {
            router.replace('/auth/signIn');
          }
        }, 1500);
      } catch (error) {
        console.error('Failed to read authToken:', error);
        router.replace('/auth/signIn');
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={styles.welcome_container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Text style={styles.welcome_appName}>Edge</Text>
        <Text style={styles.welcome_subtitle}>AI Skiing Coach</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcome_container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#001c3c', // deep navy
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome_appName: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 1,
  },
  welcome_subtitle: {
    fontSize: 18,
    color: '#8fbff8',
    marginTop: 8,
    fontWeight: '400',
  },
});
