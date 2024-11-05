// Компонент иконки навигацонной панели
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const TabBarIcon = ({
  iconName,
  color,
  size,
}: {
  iconName: string;
  color: string;
  size: number;
}) => <Icon name={iconName} size={size} color={color} />;

export default TabBarIcon;
