import React from 'react';
import { ScrollView, View, Alert, StyleSheet } from 'react-native';
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
  const [recordList, setRecords] = React.useState([]);
  const [loading, setLoading] = React.useState(false);


  React.useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    // const token = await AsyncStorage.getItem('authToken');
    setLoading(true);
    const { data } = await axiosInstance.get('/system/results/list').finally(() => {
      setLoading(false);
    });

    if (data.code === 200) {
      setRecords(data.rows);
    }
  };

  const handleDelete = async (recordId: number) => {
    const token = await AsyncStorage.getItem('authToken');
    setLoading(true);

    const { data } = await axiosInstance.delete(`https://aiskiingcoach.com/system/results/delete/${recordId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    }).finally(() => {
      setLoading(false);
    });

    if (data.code === 200) {
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
      Alert.alert('Success', 'Record deleted successfully!');
    }
  };

  return (
    <View style={styles.records_container}>
      <LoadingOverlay visible={loading} />

      <Text variant="headlineMedium" style={styles.records_header}>
        Consultation Records
      </Text>

      <ScrollView contentContainerStyle={styles.records_scrollArea} style={styles.scroll_view}>
        <View style={styles.records_scrollBox}>

          {recordList.length === 0 ? (
            <EmptyStatus
              message="You don't have any consultation records yet."
            />
          ) : (
            <>
              {recordList.map((record, index) => (
                <Card key={index} style={styles.records_card} onPress={() => router.push(`/page/evaluation?resultId=${record.id}&videoId=${record.videoId}`)}>
                  <Card.Title title={record.skiTitle} />
                  <Card.Content>

                    { record.skiLocation && (
                      <Text variant="bodyMedium" style={styles.records_date}>
                        {record.skiLocation}
                      </Text>
                    )}
                  
                    { record.skiTime && (
                      <Text variant="bodyMedium" style={styles.records_date}>
                        { new Date(record.skiTime).toLocaleDateString()}
                      </Text>
                    )}

                    <Text variant="bodyMedium" style={styles.records_issues}>
                      {record?.issues?.length || 0} issues detected
                    </Text>

                    <View style={styles.records_buttonRow}>
                      <Button
                        mode="outlined"
                        onPress={() => router.push(`/page/records/edit?resultId=${record.id}`)}
                        style={styles.records_button}
                        compact
                        labelStyle={{ color: themeColor}}  
                      >
                        Edit
                      </Button>
                      <Button
                        mode="contained"
                        buttonColor={themeColor}
                        onPress={() => handleDelete(record.id)}
                        style={styles.records_button}
                        compact
                        labelStyle={{ color: '#fff' }}
                      >
                        Delete
                      </Button>
                    </View>
                  </Card.Content>
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
