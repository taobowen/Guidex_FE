import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { Slot, useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView

export default function PageLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const [index, setIndex] = useState(0);

  const routes = [
    { key: 'video', title: 'Video', icon: 'video-plus' },
    { key: 'records', title: 'Records', icon: 'view-grid' },
    { key: 'profile', title: 'Profile', icon: 'account-box' },
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
    <SafeAreaView style={styles.container}> {/* Use SafeAreaView here */}
      <View style={styles.content}>
        <Slot /> {/* This handles nested routing */}
      </View>

      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={handleIndexChange}
        style={styles.nav}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'video':
              return <View style={{ flex: 1, backgroundColor: '#ffebee' }} />;
            case 'records':
              return <View style={{ flex: 1, backgroundColor: '#e3f2fd' }} />;
            case 'profile':
              return <View style={{ flex: 1, backgroundColor: '#ede7f6' }} />;
            default:
              return null;
          }
        }}
        barStyle={styles.navBar}
        shifting={false}
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
    // paddingBottom: 80, // make room for bottom nav
  },
  navBar: {
    backgroundColor: '#f6f6f6',
  },
  nav: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 80,
    height: 80,
  },
});