// Компонент UserProfile отображает профиль пользователя
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, ActivityIndicator} from 'react-native';
import CustomButton from '../components/CustomButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useAuth} from '../context/AuthContext';
import {fetchProfile} from '../api/steamApi';
import {ProfileData} from '../types/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Auth'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const UserProfile: React.FC<Props> = ({navigation}) => {
  const {steamId, apiKey, logout} = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных профиля, когда компонент монтируется или когда steam id или api key изменяются
  useEffect(() => {
    const loadProfile = async () => {
      if (!steamId || !apiKey) {
        setProfileData(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const profile = await fetchProfile(steamId, apiKey);
        setProfileData(profile);
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
          setError(
            'Произошла ошибка при получении данных. Пожалуйста, попробуйте авторизоваться заново',
          );
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [steamId, apiKey]);

  // Выход из аккаунта
  const handleLogout = async () => {
    await logout();
    setProfileData(null);
    navigation.navigate('Auth');
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        profileData && (
          <View style={styles.userData}>
            <Image
              source={{uri: profileData.avatarfull}}
              style={styles.avatar}
            />
            <Text style={styles.nickname}>{profileData.personaname}</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.text}>Статус:</Text>
              {profileData.personastate === 1 ? (
                <Text style={styles.status}>online</Text>
              ) : (
                <Text style={styles.statusOffline}>offline</Text>
              )}
            </View>
          </View>
        )
      )}
      <View>
        {!loading && <CustomButton title="Выйти" onPress={handleLogout} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#1b2838',
  },
  userData: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 16,
  },
  nickname: {
    fontSize: 25,
    color: '#fff',
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    color: '#b3ff00',
  },
  statusOffline: {
    fontSize: 18,
    color: '#c4c4c4',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    paddingRight: 10,
  },
});

export default UserProfile;