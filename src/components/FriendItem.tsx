import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {FriendInfo} from '../types/types';

const FriendItem: React.FC<FriendInfo> = ({
  index,
  personaname,
  avatar,
  friendSince,
}) => (
  <View style={styles.friendItem}>
    <Text style={styles.index}>{index + 1}</Text>
    <Image source={{uri: avatar}} style={styles.avatar} />
    <View style={styles.infoContainer}>
      <Text style={styles.personaname}>{personaname}</Text>
      <Text style={styles.friendSince}>Добавлен: {friendSince}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#c4c4c4',
  },
  index: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  personaname: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  friendSince: {
    fontSize: 14,
    color: '#c4c4c4',
  },
});

export default FriendItem;
