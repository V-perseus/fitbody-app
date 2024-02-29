import React from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

// Globals
import globals from '../config/globals'

const PinkButton = (props) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.calculateButton} onPress={() => props.handlePress()}>
      <LinearGradient
        colors={props.colors ?? [globals.styles.colors.colorPink, globals.styles.colors.colorPink]}
        style={[styles.calculateButton, props.buttonStyle]}>
        <Text style={styles.calculateText}>{props.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
)

export default PinkButton

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  calculateButton: {
    height: 55,
    width: globals.window.width * 0.9,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  calculateText: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 14,
    letterSpacing: 0,
  },
})
