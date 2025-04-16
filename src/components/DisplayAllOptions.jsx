import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import OptionItem from './OptionItem';
import optionColors from '../COLORS/COLORS';

export default function DisplayAllOptions(options) {
  const debugConsole = (ind, item) => {
    console.log(options);
    console.log(ind + 1, item);
  };
  return (
    <View style={styles.displayAllOptions}>
      {options.options.map((item, ind) => (
        <OptionItem
          onPress={debugConsole.bind(this, ind, item)}
          key={item}
          bgCol={{ backgroundColor: optionColors[ind] }}
          numeral={ind + 1}
        >
          {item}
        </OptionItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  displayAllOptions: {
    width: '100%',
    alignItems: 'center',
  },
});
