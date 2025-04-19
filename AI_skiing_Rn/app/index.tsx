import { Link } from 'expo-router';
import SignIn from "./auth/signIn";
import Signup from "./auth/signUp";
import VideoUpload from "./page/video";
import { View } from 'react-native';

export default function Index() {
  return (
    <View>
      <Link href="/auth/signIn">
        <SignIn />
      </Link>
      <Link href="/auth/signUp">
        <Signup />
      </Link>
      <Link href="/page/video">
        <VideoUpload />
      </Link>
    </View>
  );
}


