import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';


export default function Evaluation() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [tabValue, setTabValue] = useState(0);
  const [activeCard, setActiveCard] = useState<number | null>(0);

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };

  const handleCardClick = (cardIndex: number) => {
    if (videoRef.current) {
      videoRef.current.setStatusAsync({ positionMillis: cardIndex * 1000 });
      setActiveCard(cardIndex);
    }
  };

  const handleSuggestionDisplay = () => {
    router.push('/page/suggestion'); // replace with your actual route
  };

  const renderTabContent = () => {
    if (tabValue === 0) {
      return (
        <View style={styles.cardList}>
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <TouchableOpacity key={index} onPress={() => handleCardClick(index)}>
              <Card
                style={[
                  styles.card,
                  activeCard === index ? styles.cardActive : {},
                ]}
              >
                <Card.Title title="Error: Shoulder Rotation" />
                <Card.Content>
                  <Text>Description of the error.</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else if (tabValue === 1) return <Text style={styles.subHeading}>Edge Transitions</Text>;
    else if (tabValue === 2) return <Text style={styles.subHeading}>Center of Gravity</Text>;
    else return <Text style={styles.subHeading}>Body Coordination</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.alertBox}>
        <Text style={styles.alertText}>This is an info alert.</Text>
      </View>

      <Text style={styles.header}>Analysis Screen</Text>

      <View style={styles.tabBar}>
        {['All', 'Edge Transitions', 'Center of Gravity', 'Body Coordination'].map(
          (label, index) => (
            <Chip
              key={index}
              selected={tabValue === index}
              onPress={() => handleTabChange(index)}
              style={styles.tab}
            >
              {label}
            </Chip>
          )
        )}
      </View>

      <Video
        ref={videoRef}
        style={styles.video}
        source={{
          uri: 'https://assets.codepen.io/6093409/river.mp4',
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isMuted
        posterSource={{
          uri: 'https://assets.codepen.io/6093409/river.jpg',
        }}
      />

      <ScrollView style={styles.scrollArea}>{renderTabContent()}</ScrollView>

      <Button
        icon="arrow-right"
        mode="contained"
        onPress={handleSuggestionDisplay}
        buttonColor="green"
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
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
    backgroundColor: '#f6f6f6',
  },
  alertBox: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  alertText: {
    color: '#1976d2',
    textAlign: 'center',
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
  tabBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  tab: {
    marginVertical: 4,
  },
  video: {
    width: '80%',
    height: '25%',
    marginVertical: 12,
  },
  scrollArea: {
    maxHeight: 300,
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
  },
  cardActive: {
    borderColor: '#4caf50',
    borderWidth: 2,
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
});
