// components/LoadingOverlay.tsx
import React from 'react';
import { View, StyleSheet, ActivityIndicator, Modal } from 'react-native';

const LoadingOverlay = ({ visible = false }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  </Modal>
);

export default LoadingOverlay;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
