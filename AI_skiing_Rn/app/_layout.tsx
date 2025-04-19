import { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /auth/signIn on app load
    router.replace('/auth/signIn');
  }, []);

  return <Slot />;
}