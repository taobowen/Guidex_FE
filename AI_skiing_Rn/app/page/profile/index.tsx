import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import axiosInstance from '../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const themeColor = '#8fbff8'; // deep navy

const ProfilePage = () => {
  const router = useRouter();
  const [username, setUsername] = React.useState('');
  const [sex, setSex] = React.useState();
  const [avatar, setAvatar] = React.useState('https://via.placeholder.com/150');

  const getProfile = async () => {
    const token = await AsyncStorage.getItem('authToken');
    axiosInstance({
      method: 'GET',
      url: 'https://aiskiingcoach.com/system/user/get-user',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    }).then(({ data }) => {
      if (data.code === 200) {
        setUsername(data.data.userName);
        setSex(data.data.sex);
        setAvatar(data.data.avatar);
      }
    });
  };

  React.useEffect(() => {
    getProfile();
  }, []);

  const handleLogout = async () => {
    const token = await AsyncStorage.getItem('authToken');
    axiosInstance({
      method: 'POST',
      url: 'https://aiskiingcoach.com/logout',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    }).then(() => {
      AsyncStorage.removeItem('authToken').then(() => {
        router.push('/auth/signIn');
      });
    });
  };

  return (
    <View style={styles.profile_container}>
      <Card style={styles.profile_card}>
        <View style={styles.profile_avatarContainer}>
          <Avatar.Image size={100} source={{ uri: avatar }} />
          {sex && (
            <View style={styles.profile_genderBadge}>
              <MaterialCommunityIcons
                name={sex === 'Male' ? 'gender-male' : 'gender-female'}
                size={20}
                color="#fff"
              />
            </View>
          )}
        </View>

        <Card.Content style={styles.profile_content}>
          <Text variant="titleLarge" style={styles.profile_name}>{username}</Text>
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        icon="pencil"
        style={styles.profile_editButton}
        onPress={() => router.push('/page/profile/edit')}
        textColor={themeColor}
      >
        Edit Profile
      </Button>

      <Button
        mode="contained"
        buttonColor={themeColor}
        textColor="#fff"
        style={styles.profile_logoutButton}
        onPress={handleLogout}
      >
        Log Out
      </Button>
    </View>

  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  profile_container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  profile_card: {
    width: 350,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#f5f8fa',
  },
  profile_avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profile_content: {
    alignItems: 'center',
  },
  profile_name: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#001c3c',
  },
  profile_detail: {
    color: '#444',
  },
  profile_editButton: {
    width: 350,
    marginTop: 16,
    borderColor: themeColor,
    borderWidth: 1.5,
  },
  profile_logoutButton: {
    width: 350,
    marginTop: 16,
  },
  profile_genderBadge: {
    position: 'absolute',
    bottom: 0,
    right: '10%',
    backgroundColor: themeColor,
    borderRadius: 12,
    padding: 4,
  },
});
