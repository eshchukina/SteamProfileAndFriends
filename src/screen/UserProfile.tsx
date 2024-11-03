import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, ActivityIndicator} from 'react-native';
import CustomButton from '../components/CustomButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchProfile} from '../api/steamApi';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Auth'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const UserProfile: React.FC<Props> = ({navigation}) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await fetchProfile();
      setProfileData(profile);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('apiKey');
    await AsyncStorage.removeItem('steamId');
    setProfileData(null);
    navigation.navigate('Auth');
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
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
        <CustomButton title="Выйти" onPress={handleLogout} />
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
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    color: '#00FF00',
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
    color: '#FFFFFF',
    paddingRight: 10,
  },
});

export default UserProfile;
