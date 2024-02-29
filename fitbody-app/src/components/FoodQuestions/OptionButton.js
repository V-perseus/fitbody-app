import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'

import SelectedIcon from '../../../assets/images/svg/icon/32px/circle/check-filled.svg'

// Styles
import globals from '../../config/globals'

const OptionButton = (props) => (
  <TouchableOpacity
    style={[styles.button, props.active ? styles.active : styles.inactive, props.style]}
    onPress={() => props.handlePress()}>
    <Text style={[props.active ? styles.activeTitle : styles.inactiveTitle, props.textStyle]}>{props.title.toUpperCase()}</Text>
    {props.selected ? <SelectedIcon width="25" height="25" style={styles.icon} color={globals.styles.colors.colorGreenLight} /> : null}
  </TouchableOpacity>
)

export default OptionButton

const styles = StyleSheet.create({
  button: {
    height: 55,
    width: globals.window.width * 0.9,
    borderRadius: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    right: 10,
    borderRadius: 50,
  },
  active: {
    backgroundColor: globals.styles.colors.colorWhite,
  },
  inactive: {
    borderColor: globals.styles.colors.colorWhite,
    backgroundColor: globals.styles.colors.colorWhite,
    borderWidth: 0,
  },
  activeTitle: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorSkyBlue,
    fontSize: 16,
  },
  inactiveTitle: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorGrayDark,
    fontSize: 16,
  },
})
