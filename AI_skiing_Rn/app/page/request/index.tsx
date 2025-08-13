import React from 'react';
import { ScrollView, View, StyleSheet, Image } from 'react-native';
import { Card, Text, Button, ProgressBar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../utils/axiosInstance';
import EmptyStatus from '../../../components/EmptyStatus'; // Adjust path as needed
import LoadingOverlay from '../../../components/LoadingOverlay'; // adjust path if needed

const themeColor = '#8fbff8';

export const screenOptions = {
  gestureEnabled: false, // or false to disable
};

export default function Records() {
  const router = useRouter();
  const [inquiringList, setInquiringList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);


  React.useEffect(() => {
    fetchInquiringList();
  }, []);

  const fetchInquiringList = async () => {
    // const token = await AsyncStorage.getItem('authToken');
    setLoading(true);
    const { data } = await axiosInstance.get('/system/results/coach/list-inquiring').finally(() => {
      setLoading(false);
    });

    if (data.code === 200) {
      setInquiringList(data.data);
    }
  };

  return (
    <View style={styles.records_container}>
      <LoadingOverlay visible={loading} />

      <Text variant="headlineMedium" style={styles.records_header}>
        Feedback Dashboard
      </Text>

      <ScrollView contentContainerStyle={styles.records_scrollArea} style={styles.scroll_view}>
        <View style={styles.records_scrollBox}>

          {inquiringList.length === 0 ? (
            <EmptyStatus
              message="You don't have any available inquiries yet."
            />
          ) : (
            <>
              {inquiringList.map((inquire, index) => (
                <Card key={index} style={styles.records_card} onPress={() => router.push(`/page/request/detail?inquireId=${record.id}`)}>
                    <Image
                        source={{ uri: inquire?.issues[0]?.coverUrl }}
                        style={styles.inquire_image}
                    />
                    <Text variant="bodyMedium" style={styles.records_issues}>
                      {/* {inquire.recordName} */}
                      type
                    </Text>

                    <Text variant="bodyMedium" style={styles.records_issues}>
                      {/* {inquire.recordName} */}
                      name
                    </Text>

                    <Text variant="bodyMedium" style={styles.records_issues}>
                      user description
                    </Text>
                </Card>
              ))}
            </>
            )}
        </View>
      </ScrollView>


      
    </View>
  );
}

const styles = StyleSheet.create({
  records_container: {
    height: '100%',
    flexShrink: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  records_header: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  records_scrollArea: {
    marginTop: 24,
    paddingBottom: 16,
    flexGrow: 1,
    gap: 16,
  },
  scroll_view: {
    width: '100%',
  },
  records_scrollBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    flexGrow: 1
  },
  records_card: {
    display: 'flex',
    width: '90%',
    marginHorizontal: 8,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#f6f6f6',
  },
  records_date: {
    marginBottom: 8,
    color: '#666',
  },
  records_issues: {
    marginBottom: 8,
  },
  records_buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  records_button: {
    marginTop: 8,
    flex: 1,
    borderColor: themeColor,
  },
});
