import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const FriendsList = () => {
  return (
    <View style={styles.container}>
      <Text>Список друзей</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FriendsList;
