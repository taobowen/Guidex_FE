import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text, Button, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';

const ProfilePage = () => {

  const router = useRouter();
  const handleLogout = () => {
    // Handle logout logic here
    router.push('/auth/signIn');
  };
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={100}
            source={{ uri: 'https://via.placeholder.com/150' }}
          />
        </View>

        {/* User Details */}
        <Card.Content style={styles.content}>
          <Text variant="titleLarge" style={styles.name}>
            John Doe
          </Text>
          <Text variant="bodyMedium" style={styles.detail}>
            Age: 28
          </Text>
          <Text variant="bodyMedium" style={styles.detail}>
            Sex: Male
          </Text>
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Button
        mode="contained"
        buttonColor="#d32f2f"
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        Log Out
      </Button>
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f6f6f6',
  },
  card: {
    width: 350,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    color: '#666',
  },
  logoutButton: {
    width: 350,
    marginTop: 16,
  },
});
