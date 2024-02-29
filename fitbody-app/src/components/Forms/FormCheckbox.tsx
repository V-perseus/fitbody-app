import React from 'react'
import { View, Pressable, Text, StyleSheet, ViewStyle } from 'react-native'

import CheckIcon from '../../../assets/images/svg/icon/16px/check.svg'
import globals from '../../config/globals'

interface IFormCheckboxProps {
  text: string
  checked: boolean
  onPress: () => void
  containerStyle?: ViewStyle
  textStyle?: ViewStyle
}
export const FormCheckbox: React.FC<IFormCheckboxProps> = ({ text, checked, onPress, containerStyle, textStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable style={styles.checkbox} onPress={onPress} hitSlop={16}>
        {checked && <CheckIcon style={styles.checkIcon} color={globals.styles.colors.colorBlack} />}
      </Pressable>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  checkbox: {
    borderColor: globals.styles.colors.colorBlack,
    borderWidth: 1,
    width: 16,
    height: 16,
    marginRight: 16,
    marginTop: 4,
  },
  checkIcon: {
    position: 'absolute',
    top: -2,
    right: -4,
  },
  text: {
    color: globals.styles.colors.colorBlack,
    fontSize: 14,
    width: '90%',
  },
})
