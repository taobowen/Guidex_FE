import React, { useMemo } from 'react';
import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { Text, Card, Chip, IconButton } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import {ISSUE_TYPES} from '@/app/utils/const';



import axiosInstance from '@/app/utils/axiosInstance';

const themeColor = '#8fbff8';

export default function Suggestions() {
  const [suggestions, setSuggestions] = React.useState([]);
  const [tabValue, setTabValue] = React.useState('All');

  const showSuggestions = useMemo(() => {
    return suggestions.filter((item) => {
      if (tabValue === 'All') return true;
      if (tabValue === 'Edge Transitions') return item.error.includes('Edge Transitions');
      if (tabValue === 'Center of Gravity') return item.error.includes('Center of Gravity');
      if (tabValue === 'Body Coordination') return item.error.includes('Body Coordination');
      if (tabValue === 'Pole Usage') return item.error.includes('Pole Usage');
      if (tabValue === 'Stance Width') return item.error.includes('Stance Width');
      return false;
    });
  }, [suggestions, tabValue]);

  

  const { resultId } = useLocalSearchParams();

  const handleTabChange = (label: string) => {
    setTabValue(label);
  };

  const fetchSuggestions = async () => {
    try {
      const response = await axiosInstance.get(`/system/results/${resultId}`);
      const data = response.data;
      if (data.code === 200) {
        setSuggestions(data.data.issues.map((issue) => ({
          error: `Error: ${ISSUE_TYPES[issue.type]}`,
          suggestion: issue.suggestion,
          id: issue.id,
          thumb: issue.thumb,
          image: issue.coverUrl || 'https://via.placeholder.com/150', // Default image if none provided
        })));
      } else {
        console.error('Error fetching suggestions:', data.message);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleThumbUp = async (id: number) => {
    try {
      const response = await axiosInstance.put(`/system/issues/thumb-up/${id}`);
      if (response.data.code === 200) {
        await fetchSuggestions(); // Refresh suggestions after feedback
        console.log('Feedback submitted successfully');
      } else {
        console.error('Error submitting feedback:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
    // Handle thumb up action here
  };
  const handleThumbDown = async (id: number) => {
    try {
      const response = await axiosInstance.put(`/system/issues/thumb-down/${id}`);
      if (response.data.code === 200) {
        await fetchSuggestions();
        console.log('Feedback submitted successfully');
      } else {
        console.error('Error submitting feedback:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
    // Handle thumb down action here
  };


  React.useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <View style={styles.suggestions_container}>
      <Text variant="headlineMedium" style={styles.suggestions_header}>
        Feedback
      </Text>

      <ScrollView
        horizontal
        style={{ flexShrink: 0, flexGrow: 0 }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBar}
      >
        {['All', 'Edge Transitions', 'Center of Gravity', 'Body Coordination', 'Pole Usage', 'Stance Width'].map(
          (label, index) => (
            <Chip
              key={index}
              selected={tabValue === label}
              onPress={() => handleTabChange(label)}
              selectedColor={tabValue === label ? '#fff' : themeColor}
              style={tabValue === label ? styles.selectedTab : styles.unselectedTab}
            >
              {label}
            </Chip>
          )
        )}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.suggestions_scrollContainer}>
        {showSuggestions.map((item, index) => (
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
                <View style={styles.feedbackRow}>
                  <IconButton icon="thumb-up" iconColor={item.thumb === 1 ? themeColor : '#ccc'} onPress={() => handleThumbUp(item.id)} />
                  <IconButton icon="thumb-down" iconColor={item.thumb === 2 ? themeColor : '#ccc'} onPress={() => handleThumbDown(item.id)} />
                </View>
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

  tabBar: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  unselectedTab: {
    marginRight: 8,
    borderColor: themeColor,
    borderWidth: 1,
    backgroundColor: '#fff',
  },

  selectedTab: {
    marginRight: 8,
    backgroundColor: themeColor,
    borderColor: themeColor,
    borderWidth: 1,
  },

  feedbackRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  }

});
