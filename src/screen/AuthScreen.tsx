import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
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

  const handleLogin = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Авторизация</Text>
      <TextInput
        style={styles.input}
        placeholder="API Key"
        value={apiKey}
        onChangeText={setApiKey}
      />
      <TextInput
        style={styles.input}
        placeholder="Steam ID"
        value={steamId}
        onChangeText={setSteamId}
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
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default AuthScreen;
