import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FriendItem from '../components/FriendItem';

type Friend = {
  steamId: string;
  personaname: string;
  avatar: string;
  friendSince: string;
};

const FriendsList: React.FC = () => {
  const [friendsData, setFriendsData] = useState<Friend[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [steamId, setSteamId] = useState<string | null>(null);

  useEffect(() => {
    const loadCredentials = async () => {
      const storedApiKey = await AsyncStorage.getItem('apiKey');
      const storedSteamId = await AsyncStorage.getItem('steamId');
      setApiKey(storedApiKey);
      setSteamId(storedSteamId);
    };

    loadCredentials();
  }, []);

  useEffect(() => {
    if (apiKey && steamId) {
      fetchFriends();
    }
  }, [apiKey, steamId]);

  const fetchFriends = async () => {
    try {
      const friendListResponse = await axios.get(
        `https://api.steampowered.com/ISteamUser/GetFriendList/v1/`,
        {
          params: {
            key: apiKey,
            steamid: steamId,
            relationship: 'friend',
          },
        },
      );

      const friendsSteamIds = friendListResponse.data.friendslist.friends.map(
        (friend: {steamid: string; friend_since: number}) => ({
          steamid: friend.steamid,
          friendSince: new Date(
            friend.friend_since * 1000,
          ).toLocaleDateString(),
        }),
      );

      const friendsDetailsResponse = await axios.get(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/`,
        {
          params: {
            key: apiKey,
            steamids: friendsSteamIds
              .map((f: {steamid: string}) => f.steamid)
              .join(','),
          },
        },
      );

      const friendsDetails: Friend[] =
        friendsDetailsResponse.data.response.players.map((player: any) => ({
          steamId: player.steamid,
          personaname: player.personaname,
          avatar: player.avatarfull,
          friendSince:
            friendsSteamIds.find((f: { steamid: any; }) => f.steamid === player.steamid)
              ?.friendSince || '',
        }));

      const sortedFriendsDetails = (friends: Friend[]): Friend[] => {
        return friends.sort((a, b) => {
          const [monthA, dayA, yearA] = a.friendSince.split('/').map(Number);
          const [monthB, dayB, yearB] = b.friendSince.split('/').map(Number);

          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);

          return dateB.getTime() - dateA.getTime();
        });
      };

      setFriendsData(sortedFriendsDetails(friendsDetails));
    } catch (error) {
      console.log(error);
    }
  };

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
