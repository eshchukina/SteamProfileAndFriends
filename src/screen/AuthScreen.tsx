import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import CustomButton from '../components/CustomButton';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const AuthScreen: React.FC<Props> = ({navigation}) => {
  const [apiKey, setApiKey] = useState('');
  const [steamId, setSteamId] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!apiKey || !steamId) {
      setError('Пожалуйста, введите API Key и Steam ID');
      return;
    }

    try {
      await AsyncStorage.setItem('apiKey', apiKey);
      await AsyncStorage.setItem('steamId', steamId);
      setError('');
      navigation.navigate('Profile');
    } catch (error) {
      setError('Не удалось сохранить данные. Попробуйте снова');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Авторизация</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="API Key"
        placeholderTextColor="#fff"
        value={apiKey}
        onChangeText={text => {
          setApiKey(text);
          if (error) setError('');
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Steam ID"
        placeholderTextColor="#fff"
        value={steamId}
        onChangeText={text => {
          setSteamId(text);
          if (error) setError('');
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
  input: {
    color: '#fff',
    width: '100%',
    padding: 10,
    borderWidth: 2,
    borderColor: '#c4c4c4',
    borderRadius: 10,
    marginBottom: 15,
  },
  error: {
    color: '#ff4d4d',
    marginBottom: 15,
    fontSize: 16,
  },
});

export default AuthScreen;
