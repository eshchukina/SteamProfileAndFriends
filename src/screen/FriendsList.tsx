// Компонент FriendsList реализует экран, который отображает список друзей
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import FriendItem from '../components/FriendItem';
import {fetchFriends} from '../api/steamApi';
import {Friend} from '../types/types';
import CustomButton from '../components/CustomButton';

const FriendsList: React.FC = () => {
  const [friendsData, setFriendsData] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция loadFriends, которая загружает данные друзей
  const loadFriends = async () => {
    setLoading(true);
    try {
      const friends = await fetchFriends();
      if (friends && friends.length > 0) {
        setFriendsData(friends);
        setError(null);
      } else {
        setFriendsData([]);
        setError('У вас нет друзей в Steam');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <CustomButton title="Обновить" onPress={loadFriends} />
        </View>
      ) : (
        <FlatList
          data={friendsData}
          renderItem={({item, index}) => (
            <FriendItem
              steamId={item.steamId}
              index={index}
              avatar={item.avatar}
              friendSince={item.friendSince}
            />
          )}
          keyExtractor={item => item.steamId}
          ListEmptyComponent={
            <View style={styles.noFriendsContainer}>
              <Text style={styles.noFriendsText}>У вас нет друзей в Steam</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1b2838',
    padding: 15,
  },
  errorContainer: {
    alignItems: 'center',
  },
  noFriendsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFriendsText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default FriendsList;
