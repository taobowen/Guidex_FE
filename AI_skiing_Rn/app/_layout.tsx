import { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/welcome');
  }, []);

  return (
    <PaperProvider theme={{ colors: { primary: '#8fbff8' } }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}