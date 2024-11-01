import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
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
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'FriendsList') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
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
