import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
} from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { ISSUE_TYPES, ISSUE_CODES } from '../../utils/const'; // Assuming you have a file that exports the issue types

const themeColor = '#8fbff8';


export default function Evaluation() {
  const router = useRouter();
  const videoRef = useRef<VideoView>(null);
  const [tabValue, setTabValue] = useState('All');
  const [activeCard, setActiveCard] = useState<number | null>(0);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [issues, setIssues] = useState<any[]>([]); // Assuming issues is an array of strings
  const { resultId, videoId } = useLocalSearchParams();
  const player = useVideoPlayer(videoUri);


  const fetchVideoUrl = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`https://aiskiingcoach.com/system/video/${videoId}`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.data.code === 200) {
        const videoData = response.data.data;
        setVideoUri(videoData.videoUrl);
      } else {
        Alert.alert('Error', 'Failed to fetch video data.');
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
      Alert.alert('Error', 'Failed to fetch video data.');
    }
  };

  const fetchEvaluationData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');  
      const response = await axios.get(`https://aiskiingcoach.com/system/results/${resultId}`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.data.code === 200) {
        const { issues } = response.data.data;
        console.log('Result Detail Object:', issues);
        setIssues(issues);
      } else {
        Alert.alert('Error', 'Failed to fetch video data.');
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
      Alert.alert('Error', 'Failed to fetch video data.');
    }
  };

  React.useEffect(() => {
    fetchEvaluationData();
    fetchVideoUrl();
  }, []);

  const handleTabChange = (label: string) => {
    setTabValue(label);
  };

  const handleCardClick = async (cardIndex: number, timeInSeconds: number) => {
    if (videoRef.current) {
      // const positionMillis = Math.max(0, Math.floor(timeInSeconds * 1000)); // ensure valid time
      player.currentTime = timeInSeconds;

      setActiveCard(cardIndex);
    }
  };
  

  const handleSuggestionDisplay = () => {
    router.push(`/page/suggestion?resultId=${resultId}`); // replace with your actual route
  };

  const renderTabContent = () => {
    const tabTypeMap = [
      null, // index 0 = All
      'Edge Transitions',
      'Center of Gravity',
      'Body Coordination',
      'Pole Usage',
      'Stance Width',
    ];
  
    const filteredIssues =
      tabValue === 'All'
        ? issues
        : issues.filter((issue) => issue.type === ISSUE_CODES[tabValue]);
  
    return (
      <View style={styles.cardList}>
        {filteredIssues?.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleCardClick(index, item.time)}>
            <Card
              style={[
                styles.card,
                activeCard === index ? styles.cardActive : {},
              ]}
            >
              <Card.Title titleStyle={styles.cardTitle} title={`Error: ${ISSUE_TYPES[item.type]}`} />
              <Card.Content>
                <Text>{item.description}</Text>
                <Text style={styles.error_frame}>
                  {item.time || '-'} s
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  

  return (
    <View style={styles.container}>

      <Text style={styles.header}>Analysis Screen</Text>

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
              style={styles.tab}
              textStyle={{ color: themeColor }}
              selectedColor={themeColor}
            >
              {label}
            </Chip>
          )
        )}
      </ScrollView>

      {videoUri && (
        <VideoView
          ref={videoRef}
          style={styles.video}
          player={player}
        />
      )}

   

      <ScrollView style={styles.scrollArea}>{renderTabContent()}</ScrollView>

      <Button
        icon="arrow-right"
        mode="contained"
        onPress={handleSuggestionDisplay}
        buttonColor={themeColor} // previously "green"
        style={styles.button}
        contentStyle={{ height: 48 }}
      >
        See Suggestions
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
  },
  

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  header: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 12,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 12,
  },
  video: {
    flexShrink: 0,
    width: '100%',
    aspectRatio: 16 / 9, // keep correct aspect ratio
    marginVertical: 12,
    backgroundColor: '#000', // fallback to prevent flickering
  },
  
  scrollArea: {
    flexGrow: 1,
    width: '100%',
  },
  cardList: {
    gap: 12,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
    width: 320,
    alignSelf: 'center',
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
  alertBox: {
    backgroundColor: '#e0f4ff', // lighter theme variant
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  alertText: {
    color: themeColor,
    textAlign: 'center',
  },
  cardActive: {
    borderColor: themeColor,
    borderWidth: 2,
  },
  tabBar: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  tab: {
    marginRight: 8,
    borderColor: themeColor,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  error_frame: {
    marginTop: 8,
    color: '#666',
  },
});
