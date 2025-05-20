import React from 'react';
import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import {ISSUE_TYPES} from '@/app/utils/const';

import axiosInstance from '@/app/utils/axiosInstance';

const themeColor = '#8fbff8';

export default function Suggestions() {
  const [suggestions, setSuggestions] = React.useState([]);

  const { resultId } = useLocalSearchParams();

  const fetchSuggestions = async () => {
    try {
      const response = await axiosInstance.get(`/system/results/${resultId}`);
      const data = response.data;
      if (data.code === 200) {
        setSuggestions(data.data.issues.map((issue) => ({
          error: `Error: ${ISSUE_TYPES[issue.type]}`,
          suggestion: issue.suggestion,
          image: issue.coverUrl || 'https://via.placeholder.com/150', // Default image if none provided
        })));
      } else {
        console.error('Error fetching suggestions:', data.message);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };


  React.useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <View style={styles.suggestions_container}>
      <Text variant="headlineMedium" style={styles.suggestions_header}>
        Feedback
      </Text>

      <ScrollView contentContainerStyle={styles.suggestions_scrollContainer}>
        {suggestions.map((item, index) => (
          <Card key={index} style={styles.suggestions_card}>
            <View style={styles.suggestions_row}>
              <Image
                source={{ uri: item.image }}
                style={styles.suggestions_image}
              />
              <View style={styles.suggestions_textContainer}>
                <Text variant="bodyMedium" style={styles.suggestions_text}>
                  {item.error}
                </Text>
                <Text variant="bodyMedium" style={styles.suggestions_text}>
                  {item.suggestion}
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
  suggestions_container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
  suggestions_header: {
    marginBottom: 12,
    textAlign: 'center',
    color: '#001c3c',
    fontWeight: '600',
  },
  suggestions_scrollContainer: {
    gap: 32,
    marginTop: 16,
    paddingBottom: 16,
  },
  suggestions_card: {
    width: 350,
    padding: 8,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: themeColor,
  },
  suggestions_row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  suggestions_image: {
    width: 120,
    height: 90,
    borderRadius: 8,
  },
  suggestions_textContainer: {
    flex: 1,
    gap: 4,
  },
  suggestions_text: {
    color: '#001c3c',
  },
});
