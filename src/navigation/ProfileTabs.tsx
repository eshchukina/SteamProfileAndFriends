import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import FriendsList from '../screen/FriendsList';
import UserProfile from '../screen/UserProfile';

const Tab = createBottomTabNavigator();

const ProfileTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => {
        let iconName: string = '';
        switch (route.name) {
          case 'UserProfile':
            iconName = 'user';
            break;
          case 'FriendsList':
            iconName = 'users';
            break;
        }
        const tabBarIcon = ({color, size}: {color: string; size: number}) => (
          <Icon name={iconName} size={size} color={color} />
        );

        return {
          tabBarIcon,
          tabBarActiveTintColor: '#ff49b6',
          tabBarInactiveTintColor: '#c4c4c4',
          tabBarStyle: {backgroundColor: '#171d25'},
          headerStyle: {backgroundColor: '#171d25'},
          headerTintColor: '#c4c4c4',
          headerTitleAlign: 'center',
        };
      }}>
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
