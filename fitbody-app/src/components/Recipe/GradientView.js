import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

// Globals
import globals from '../../config/globals'

const GradientView = (props) => (
  <View style={styles.gradientView}>
    <Text style={styles.label}>{props.title}</Text>
  </View>
)

export default GradientView

const styles = StyleSheet.create({
  gradientView: {
    width: globals.window.width,
    height: 35,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  label: {
    color: globals.styles.colors.colorLove,
    fontSize: 14,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    letterSpacing: -0.3,
  },
})
