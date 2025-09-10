import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { useRouter, usePathname, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PageLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [index, setIndex] = useState(0);

  // const themeColor = '#001c3c';
  const themeColor = '#8fbff8'; // deep navy

  const routes = [
    {
      key: 'video',
      title: 'Video',
      focusedIcon: 'video', unfocusedIcon: 'video-outline',
    },
    {
      key: 'records',
      title: 'Records',
      focusedIcon: 'view-list', unfocusedIcon: 'view-list-outline'
    },
    {
      key: 'profile',
      title: 'Profile',
      focusedIcon: 'account-circle', unfocusedIcon: 'account-circle-outline'
    },
  ];

  useEffect(() => {
    if (pathname.includes('/page/video')) setIndex(0);
    else if (pathname.includes('/page/records')) setIndex(1);
    else if (pathname.includes('/page/profile')) setIndex(2);
  }, [pathname]);

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
    const selected = routes[newIndex].key;
    const validPaths = `/page/${selected}` as '/page/video' | '/page/records' | '/page/profile';
    router.push(validPaths);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,          // or true if you want default headers
            gestureEnabled: true,        // ✅ enables back-swipe gesture
            animation: 'slide_from_right',
          }}
        />
      </View>

      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={handleIndexChange}
        style={styles.nav}
        barStyle={styles.navBar}
        shifting={false}
        activeIndicatorStyle={{ backgroundColor: '#fff' }}
        activeColor={themeColor}
        inactiveColor='#666'
        renderScene={() => null} // We don’t render content in nav
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  navBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  nav: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 70,
    height: 70,
  },
});
