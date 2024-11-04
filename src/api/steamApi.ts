import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Friend, ProfileData} from '../types/types';

export const fetchProfile = async (
  steamId: string,
  apiKey: string,
): Promise<ProfileData | null> => {
  if (!apiKey) {
    throw new Error('Введите API Key');
  }
  if (!steamId) {
    throw new Error('Введите Steam ID');
  }

  try {
    const response = await axios.get(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/`,
      {
        params: {
          key: apiKey,
          steamids: steamId,
        },
      },
    );

    const players = response.data.response.players;

    if (!players || players.length === 0) {
      console.log('Проверка игроков: массив пустой');
      throw new Error('Пользователь не найден. Проверьте Steam ID');
    }

    return players[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 403) {
          throw new Error('Проверьте правильность API Key');
        } else if (error.response.status === 404) {
          throw new Error('Пользователь не найден. Проверьте Steam ID');
        }
      } else {
        console.error('Ошибка без ответа от API:', error.message);
        throw new Error('Ошибка при загрузке данных профиля: ' + error.message);
      }
    } else {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }
  return null;
};

export const fetchFriends = async (): Promise<Friend[]> => {
  try {
    const apiKey = await AsyncStorage.getItem('apiKey');
    const steamId = await AsyncStorage.getItem('steamId');

    if (!apiKey || !steamId) {
      throw new Error('API key или Steam ID отсутствуют');
    }

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
        friendSince: new Date(friend.friend_since * 1000).toLocaleDateString(),
      }),
    );

    const friendsDetailsResponse = await axios.get(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/`,
      {
        params: {
          key: apiKey,
          steamids: friendsSteamIds
            .map((f: {steamid: any}) => f.steamid)
            .join(','),
        },
      },
    );

    const friendsDetails: Friend[] =
      friendsDetailsResponse.data.response.players.map((player: any) => ({
        steamId: player.steamid,
        avatar: player.avatarfull,
        friendSince:
          friendsSteamIds.find(
            (f: {steamid: any}) => f.steamid === player.steamid,
          )?.friendSince || '',
      }));

    return friendsDetails.sort((a, b) => {
      const [monthA, dayA, yearA] = a.friendSince.split('/').map(Number);
      const [monthB, dayB, yearB] = b.friendSince.split('/').map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error(error);
    throw new Error('Ошибка при загрузке данных друзей');
  }
};
