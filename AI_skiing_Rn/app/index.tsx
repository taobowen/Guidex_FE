import { Link } from 'expo-router';
import SignIn from "./auth/signIn";
import Signup from "./auth/signUp";
import VideoUpload from "./page/video";
import Welcome from "./welcome";
import { View } from 'react-native';

export default function Index() {
  return (
    <View>
      {/* <Link href="/welcome">
        <Welcome />
      </Link> */}
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


