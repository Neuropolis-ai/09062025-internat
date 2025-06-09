import React from 'react';
import { View, StyleSheet } from 'react-native';
import Admin from '../admin';

export default function AdminTabScreen() {
  return (
    <View style={styles.container}>
      <Admin />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 