import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import FriendItem from '../components/FriendItem';
import {fetchFriends} from '../api/steamApi';
import {Friend} from '../types/types';

const FriendsList: React.FC = () => {
  const [friendsData, setFriendsData] = useState<Friend[]>([]);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const friends = await fetchFriends();
        setFriendsData(friends);
      } catch (error) {
        console.error(error);
      }
    };
    loadFriends();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={friendsData}
        renderItem={({item, index}) => (
          <FriendItem
            personaname={item.personaname}
            index={index}
            avatar={item.avatar}
            friendSince={item.friendSince}
          />
        )}
        keyExtractor={item => item.steamId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2838',
    padding: 16,
  },
});

export default FriendsList;
