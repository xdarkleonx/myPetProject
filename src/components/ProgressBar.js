import React from 'react';
import { StyleSheet, View } from 'react-native';

export const ProgressBar = props => {
  const progress = parseFloat(props.progress);
  return (
    <View style={[s.background, { ...props.style }]}>
      {props.progress
        ? <View
          style={[
            s.progress,
            {
              width: progress <= 100 ? `${progress}%` : '100%',
              backgroundColor: props.maxColor && progress > 100
                ? props.maxColor || 'red'
                : props.progressColor || '#2c6edd'
            }
          ]}
        />
        : null
      }
    </View>
  )
}

const s = StyleSheet.create({
  background: {
    borderRadius: 5,
    backgroundColor: '#e8e9e9',
    height: 7,
  },
  progress: {
    flex: 1,
    borderRadius: 5,
  }
});