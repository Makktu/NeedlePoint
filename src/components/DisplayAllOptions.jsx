import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import OptionItem from './OptionItem';

export default function DisplayAllOptions(options) {
  console.log(options);
  return (
    <View style={styles.displayAllOptions}>
      {options.options.map((item) => (
        <OptionItem key={item}>{item}</OptionItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  displayAllOptions: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
