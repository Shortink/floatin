import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EventScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Placeholder Gallery Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
