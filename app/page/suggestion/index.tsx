import React, { useMemo } from 'react';
import { ScrollView, View, Image, StyleSheet, Platform, Pressable } from 'react-native';
import {
  Text,
  Card,
  Chip,
  IconButton,
  Button,
} from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { ISSUE_TYPES } from '@/app/utils/const';
import LoadingOverlay from '../../../components/LoadingOverlay'; // adjust path if needed
import axiosInstance from '@/app/utils/axiosInstance';
import InquireCoachModal from '../../../components/InquireCoachModal'; // adjust path if needed
import { LinearGradient } from 'expo-linear-gradient';


const themeColor = '#8fbff8';
const CHAR_LIMIT = 1000;
const GRADIENT = ['#4f7afc', '#7b5bff'];

export default function Suggestions() {
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [tabValue, setTabValue] = React.useState('All');
  const [loading, setLoading] = React.useState(false);

  // ---- Modal state ----
  const [coachModalVisible, setCoachModalVisible] = React.useState(false);
  const [coachMessage, setCoachMessage] = React.useState('');

   // ---- Coach feedback card ----
  const [coachOpen, setCoachOpen] = React.useState(false);
  const [coachNote, setCoachNote] = React.useState<string | null>(null);
  const [coachRating, setCoachRating] = React.useState<number>(0);
  const [coachComment, setCoachComment] = React.useState('');

  const { resultId } = useLocalSearchParams<{ resultId: string }>();

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

  const handleTabChange = (label: string) => setTabValue(label);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/system/results/${resultId}`);
      const data = response.data;
      if (data.code === 200) {
        setSuggestions(
          data.data.issues.map((issue: any) => ({
            error: `Error: ${ISSUE_TYPES[issue.type]}`,
            suggestion: issue.suggestion,
            id: issue.id,
            thumb: issue.thumb,
            image: issue.coverUrl || 'https://via.placeholder.com/150',
          })),
        );
      } else {
        console.error('Error fetching suggestions:', data.message);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbUp = async (id: number) => {
    try {
      const response = await axiosInstance.put(`/system/issues/thumb-up/${id}`);
      if (response.data.code === 200) {
        await fetchSuggestions();
      } else {
        console.error('Error submitting feedback:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleThumbDown = async (id: number) => {
    try {
      const response = await axiosInstance.put(`/system/issues/thumb-down/${id}`);
      if (response.data.code === 200) {
        await fetchSuggestions();
      } else {
        console.error('Error submitting feedback:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  // Opens the modal (no network yet)
  const handleRequestCoach = () => {
    setCoachModalVisible(true);
  };

  // Submit with message
  const submitCoachInquiry = async () => {
    try {
      setLoading(true);
      // If your backend expects only the PUT path, it will ignore the body; otherwise it can read { message }:
      const res = await axiosInstance.put(`/system/results/inquire-coach/${resultId}`, {
        message: coachMessage,
        platform: Platform.OS,
      });
      if (res.data.code === 200) {
        setCoachModalVisible(false);
        setCoachMessage('');
        alert('Coach request sent successfully!');
      } else {
        alert('Failed to send coach request. Please try again.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSuggestions();
  }, []);

  const remaining = Math.max(0, CHAR_LIMIT - (coachMessage?.length || 0));
  const canSubmit = coachMessage.trim().length > 0 && remaining >= 0;

  return (
    <View style={styles.suggestions_container}>
      <LoadingOverlay visible={loading} />

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
          ),
        )}
      </ScrollView>

            {/* ---- Coach Feedback card (collapsible) ---- */}
      {coachNote && (
        <>
          {!coachOpen ? (
            <Pressable onPress={() => setCoachOpen(true)} style={{ width: '100%' }}>
              <View style={styles.collapsedWrap}>
                <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.collapsedGradient}>
                  <View style={styles.coachRow}>
                    <Text style={styles.coachBadge}>🏅  Coach Feedback</Text>
                    <Text style={styles.unfold}>unfold ▾</Text>
                  </View>
                </LinearGradient>
              </View>
            </Pressable>
          ) : (
            <View style={styles.expandedWrap}>
              <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.expandedGradient}>
                <View style={styles.expandedHeader}>
                  <Text style={styles.coachBadge}>🏅  Coach Feedback</Text>
                  <Pressable onPress={() => setCoachOpen(false)}>
                    <Text style={styles.unfold}>hide ▴</Text>
                  </Pressable>
                </View>

                <Divider style={styles.gradDivider} />

                <Text style={styles.coachText}>{coachNote}</Text>

                <Divider style={styles.gradDivider} />

                <Text style={styles.rateLabel}>Rate this coaching feedback:</Text>
                <StarRating value={coachRating} onChange={setCoachRating} />

                <TextInput
                  mode="outlined"
                  placeholder="Add your comments about the coaching feedback..."
                  value={coachComment}
                  onChangeText={setCoachComment}
                  multiline
                  style={styles.commentInput}
                  outlineColor="#ffffff55"
                  activeOutlineColor="#ffffffaa"
                  textColor="#fff"
                  placeholderTextColor="#e5e7eb"
                />

                <Button mode="contained" onPress={submitCoachFeedback} style={styles.submitCoachBtn}>
                  Submit Feedback
                </Button>
              </LinearGradient>
            </View>
          )}
        </>
      )}

      <ScrollView contentContainerStyle={styles.suggestions_scrollContainer}>
        {showSuggestions.map((item, index) => (
          <Card key={index} style={styles.suggestions_card}>
            <View style={styles.suggestions_row}>
              <Image source={{ uri: item.image }} style={styles.suggestions_image} />
              <View style={styles.suggestions_textContainer}>
                <Text variant="bodyMedium" style={styles.suggestions_text}>
                  {item.error}
                </Text>
                <Text variant="bodyMedium" style={styles.suggestions_text}>
                  {item.suggestion}
                </Text>
                <View style={styles.feedbackRow}>
                  <IconButton
                    icon="thumb-up"
                    iconColor={item.thumb === 1 ? themeColor : '#ccc'}
                    onPress={() => handleThumbUp(item.id)}
                  />
                  <IconButton
                    icon="thumb-down"
                    iconColor={item.thumb === 2 ? themeColor : '#ccc'}
                    onPress={() => handleThumbDown(item.id)}
                  />
                </View>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>

      <Button
        icon="arrow-right"
        mode="contained"
        onPress={handleRequestCoach}
        buttonColor={themeColor}
        style={styles.button}
        contentStyle={{ height: 48 }}
        textColor="#fff"
      >
        Inquire My Coach
      </Button>

      <InquireCoachModal
        visible={coachModalVisible}
        onDismiss={() => setCoachModalVisible(false)}
        submitCoachInquiry={submitCoachInquiry}
      />
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
  },
  button: {
    marginTop: 20,
    width: '100%',
  },

    // Coach feedback expanded
  expandedWrap: {
    width: '100%',
    marginTop: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  expandedGradient: {
    padding: 14,
  },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradDivider: {
    marginVertical: 10,
    backgroundColor: '#ffffff55',
    height: 1,
  },
  coachText: {
    color: '#fff',
    lineHeight: 20,
  },
  rateLabel: {
    color: '#e5e7eb',
    marginBottom: 4,
    marginTop: 4,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  commentInput: {
    backgroundColor: '#ffffff22',
  },
  submitCoachBtn: {
    marginTop: 10,
    backgroundColor: '#8169ff',
  },

    // Coach feedback collapsed
  collapsedWrap: {
    width: '100%',
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  collapsedGradient: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  coachRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coachBadge: {
    color: '#fff',
    fontWeight: '700',
  },
  unfold: {
    color: '#fff',
    fontWeight: '700',
    opacity: 0.9,
  },
});
