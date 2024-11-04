import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthScreen from '../screen/AuthScreen';
import ProfileScreen from '../screen/ProfileScreen';

export type RootStackParamList = {
  Auth: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
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
