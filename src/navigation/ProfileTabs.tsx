// Нижняя навигация с двумя экранами: UserProfile и FriendsList
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FriendsList from '../screen/FriendsList';
import UserProfile from '../screen/UserProfile';
import TabBarIcon from '../components/TabBarIcon';

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

        return {
          tabBarIcon: props => (
            <TabBarIcon iconName={iconName} {...props} size={25} />
          ),
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
