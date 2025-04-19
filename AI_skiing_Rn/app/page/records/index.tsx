import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Card, Text, Button, ProgressBar } from 'react-native-paper';

export default function Records() {
  const records = Array.from({ length: 7 });

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Consultation Records
      </Text>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        {records.map((_, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title title={`Consultation Record ${index}`} />
            <Card.Content>
              <Text variant="bodyMedium" style={styles.date}>
                1989年6月4日
              </Text>

              <View>
                <ProgressBar progress={0.8} style={styles.progressBar} />
              </View>

              <Text variant="bodyMedium" style={styles.issues}>
                3 issues detected
              </Text>

              <View style={styles.buttonRow}>
                <Button
                  mode="contained"
                  buttonColor="#0288d1"
                  onPress={() => alert(`Edit ${index}`)}
                  style={styles.button}
                  compact
                >
                  Edit
                </Button>
                <Button
                  mode="contained"
                  buttonColor="#d32f2f"
                  onPress={() => alert(`Delete ${index}`)}
                  style={styles.button}
                  compact
                >
                  Delete
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
  header: {
    marginBottom: 12,
    textAlign: 'center',
  },
  scrollArea: {
    paddingBottom: 16,
    gap: 16,
  },
  card: {
    width: 350,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  date: {
    marginBottom: 8,
    color: '#666',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  issues: {
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    marginTop: 8,
    flex: 1,
  },
});
