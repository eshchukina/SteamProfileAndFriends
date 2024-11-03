import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FriendsList from '../screen/FriendsList';
import UserProfile from '../screen/UserProfile';

const Tab = createBottomTabNavigator();

const ProfileTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'UserProfile') {
            iconName = 'user-alt';
          } else if (route.name === 'FriendsList') {
            iconName = 'users';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff49b6',
        tabBarInactiveTintColor: '#c4c4c4',
        tabBarStyle: {backgroundColor: '#171d25'},
        headerStyle: {backgroundColor: '#171d25'},
        headerTintColor: '#c4c4c4',
        headerTitleAlign: 'center',
      })}>
      <Tab.Screen
        name="UserProfile"
        component={UserProfile}
        options={{title: 'Профиль пользователя'}}
      />
      <Tab.Screen
        name="FriendsList"
        component={FriendsList}
        options={{title: 'Список друзей'}}
      />
    </Tab.Navigator>
  );
};

export default ProfileTabs;
