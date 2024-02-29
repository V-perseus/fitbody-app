import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import globals from '../../config/globals'

interface IFAQButtonProps {
  active: boolean
  title: string
  handlePress: () => void
}
const FaqTab = ({ active, title, handlePress }: IFAQButtonProps) => (
  <TouchableOpacity onPress={handlePress} style={styles.submitContainer} testID="tab_btn">
    <LinearGradient
      style={active ? styles.tabActive : styles.tabInactive}
      testID="tab_bg"
      colors={
        active
          ? [globals.styles.colors.colorTopaz, globals.styles.colors.colorSkyBlue]
          : [globals.styles.colors.colorGray, globals.styles.colors.colorGray]
      }>
      <Text style={styles.buttonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
  submitContainer: {
    paddingTop: 100,
  },
  tabActive: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 57,
    borderRadius: 50,
    width: 160,
    marginTop: 5,
    marginLeft: 9,
    marginRight: 9,
    marginBottom: 5,
  },
  tabInactive: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 50,
    width: 140,
    marginTop: 10,
    marginLeft: 9,
    marginRight: 9,
    marginBottom: 5,
  },
})

export default FaqTab
