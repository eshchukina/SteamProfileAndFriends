// Запросы для работы с API Steam
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Friend, ProfileData} from '../types/types';

// Получение данныx профиля пользователя по его steam id и api key
export const fetchProfile = async (
  steamId: string,
  apiKey: string,
): Promise<ProfileData> => {
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
      throw new Error('Пользователь не найден. Проверьте Steam ID');
    }

    return players[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 403) {
          throw new Error('Проверьте правильность API Key');
        }
      } else {
        console.error('Ошибка без ответа от API:', error.message);
        throw new Error('Ошибка при загрузке данных профиля: ' + error.message);
      }
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Неизвестная ошибка при загрузке данных профиля');
  }
};

// Получение списка друзей пользователя
export const fetchFriends = async (): Promise<Friend[]> => {
  try {
    const apiKey = await AsyncStorage.getItem('apiKey');
    const steamId = await AsyncStorage.getItem('steamId');

    if (!apiKey || !steamId) {
      throw new Error('API key или Steam ID отсутствуют');
    }
    // Запрос для получения списка друзей
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
    // Запрос деталей друзей
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
        avatar: player.avatarfull,
        friendSince:
          friendsSteamIds.find(
            (f: {steamid: any}) => f.steamid === player.steamid,
          )?.friendSince || '',
      }));
    // Сортировка списка друзей
    return friendsDetails.sort((a, b) => {
      const [monthA, dayA, yearA] = a.friendSince.split('/').map(Number);
      const [monthB, dayB, yearB] = b.friendSince.split('/').map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    throw new Error('Ошибка при загрузке данных друзей');
  }
};
