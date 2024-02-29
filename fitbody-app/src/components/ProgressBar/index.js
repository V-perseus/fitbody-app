import React from 'react';
import { View } from 'react-native';

import styles from './styles';

const ProgressBar = (props) => (
  <View style={[styles.container, { width: props.width }]}>
    <View style={[styles.progressOverlay, { backgroundColor: props.color, right: props.width * (1 - props.duration / 100) }]} />
  </View>
);

export default ProgressBar;
