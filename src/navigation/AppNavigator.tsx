// Навигация между экранами
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthScreen from '../screen/AuthScreen';
import ProfileScreen from '../screen/ProfileScreen';
import {useAuth} from '../context/AuthContext';
import {ActivityIndicator, View} from 'react-native';

export type RootStackParamList = {
  Auth: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {apiKey, steamId, isLoading} = useAuth();

  // Выбор начального экрана в зависимости от состояния авторизации
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={apiKey && steamId ? 'Profile' : 'Auth'}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
