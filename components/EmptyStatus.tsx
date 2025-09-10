// components/EmptyStatus.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const EmptyStatus = ({
  message = 'No records found.',
  actionLabel,
  onActionPress,
}: {
  message?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="inbox" size={72} color="#ccc" />
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onActionPress && (
        <Button mode="contained" onPress={onActionPress} style={styles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

export default EmptyStatus;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
});
