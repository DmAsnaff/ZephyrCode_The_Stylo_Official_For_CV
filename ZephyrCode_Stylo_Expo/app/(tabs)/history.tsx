import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useHistoryStore } from '../../store/useHistoryStore';
import { useAuthStore } from '../../store/useStore';

interface History {
  id: string;
  front_image_link: string;
  side_image_link?: string | null;
  actionDateTime: string;
}

type RootStackParamList = {
  History: undefined;
  DetailHistory: { item: History };
};

const HistoryPage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { history, fetchHistory } = useHistoryStore();
  const { email } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const colorScheme = useColorScheme(); // Get the current theme (light or dark)

  useEffect(() => {
    if (email) {
      fetchHistory(email).finally(() => setIsLoading(false));
    }
  }, [fetchHistory, email]);

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };

    return date.toLocaleString('en-US', options);
  };

  const renderItem = ({ item }: { item: History }) => (
    <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8', borderColor: colorScheme === 'dark' ? '#555' : '#ddd' }]}>
      <View style={styles.infoRow}>
        <Text style={[styles.infoText, { color: colorScheme === 'dark' ? '#fff' : '#333' }]}>History ID: {item.id}</Text>
        <Text style={[styles.infoText, { color: colorScheme === 'dark' ? '#fff' : '#333' }]}>{formatDateTime(item.actionDateTime)}</Text>
      </View>
      <View style={styles.imageRow}>
        <Image source={{ uri: item.front_image_link }} style={styles.image} resizeMode="cover" />
        {item.side_image_link && (
          <Image source={{ uri: item.side_image_link }} style={styles.image} resizeMode="cover" />
        )}
      </View>
      <TouchableOpacity
        style={[styles.detailButton, { backgroundColor: colorScheme === 'dark' ? '#16A085' : '#2C3E50' }]}
        onPress={() => navigation.navigate('DetailHistory', { item })}
      >
        <Text style={[styles.detailButtonText, { color: colorScheme === 'dark' ? '#fff' : '#fff' }]}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#0000ff'} style={styles.loader} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colorScheme === 'dark' ? '#fff' : 'gray' }]}>No history found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoText: { fontSize: 14, fontWeight: 'bold' },
  imageRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  image: { width: 100, height: 100, borderRadius: 50, borderWidth: 2 },
  detailButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: 140,
    alignSelf: 'center',
  },
  detailButtonText: { fontWeight: 'bold' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', fontSize: 18 },
});

export default HistoryPage;
