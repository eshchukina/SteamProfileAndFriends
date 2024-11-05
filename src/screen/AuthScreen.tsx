// Экран авторизации
import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import CustomButton from '../components/CustomButton';
import {useAuth} from '../context/AuthContext';
import {useFocusEffect} from '@react-navigation/native';
import {fetchProfile} from '../api/steamApi';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const AuthScreen: React.FC<Props> = ({navigation}) => {
  const {login} = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [steamId, setSteamId] = useState('');
  const [error, setError] = useState('');

  // Очистка поля ввода и ошибки каждый раз, когда экран становится активным
  useFocusEffect(
    useCallback(() => {
      setError('');
      setApiKey('');
      setSteamId('');
    }, []),
  );

  // Функция handleLogin проверяет введенные данные, запрашивая профиль пользователя через fetchProfile
  // Если данные верны, вызывается функция login, происходит переход на экран профиля, иначе появляется сообщение об ошибке
  const handleLogin = async () => {
    try {
      const profile = await fetchProfile(steamId, apiKey);
      if (!profile) {
        setError('Неверный API Key или Steam ID');
        return;
      }
      await login(apiKey, steamId);
      setError('');
      navigation.navigate('Profile');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Не удалось сохранить данные. Попробуйте снова');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Авторизация</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="API Key"
        placeholderTextColor="#c4c4c4"
        value={apiKey}
        onChangeText={text => {
          setApiKey(text);
          if (error) {
            setError('');
          }
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Steam ID"
        placeholderTextColor="#c4c4c4"
        value={steamId}
        onChangeText={text => {
          setSteamId(text);
          if (error) {
            setError('');
          }
        }}
      />
      <CustomButton title="Вход" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1b2838',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#fff',
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
  },
  input: {
    color: '#fff',
    width: '100%',
    padding: 10,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    fontSize: 15,
    textAlign: 'center',
  },
});

export default AuthScreen;
