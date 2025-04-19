import React from 'react';
import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function Suggestions() {
  const suggestions = [
    {
      error: 'Error: Shoulder Rotation',
      suggestion: 'Suggestion: Keep your shoulders parallel to the slope',
      image: 'https://assets.codepen.io/6093409/river.jpg',
    },
    // Repeat or dynamically generate more entries as needed
  ];

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Detailed Feedback
      </Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Array.from({ length: 7 }).map((_, index) => (
          <Card key={index} style={styles.card}>
            <View style={styles.row}>
              <Image
                source={{ uri: suggestions[0].image }}
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text variant="bodyMedium" style={styles.text}>
                  {suggestions[0].error}
                </Text>
                <Text variant="bodyMedium" style={styles.text}>
                  {suggestions[0].suggestion}
                </Text>
              </View>
            </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
  header: {
    marginBottom: 12,
    textAlign: 'center',
  },
  scrollContainer: {
    gap: 16,
    paddingBottom: 16,
  },
  card: {
    width: 350,
    padding: 8,
    borderRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  image: {
    width: 120,
    height: 90,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  text: {
    color: '#333',
  },
});
