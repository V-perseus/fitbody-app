import React from 'react'
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import globals from '../../../config/globals'

export const NoResults = () => {
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.body}>
        <LinearGradient colors={[globals.styles.colors.colorGrayLight, globals.styles.colors.colorWhite]} style={styles.gradient} />
        <Text style={styles.text}>No results found.</Text>
        <Text style={styles.text}>Please try again.</Text>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  text: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 16,
  },
})
