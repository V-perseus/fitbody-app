import React from 'react'
import { Text, StyleSheet } from 'react-native'

// Style
import globals from '../../config/globals'

const TitleOptionStyles = StyleSheet.create({
  title: {
    paddingLeft: 0,
    paddingRight: 0,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
    marginTop: 20,
    marginBottom: 30,
    fontSize: 45,
    lineHeight: 45,
  },
})

const TitleOption = (props) => <Text style={[TitleOptionStyles.title, props.style || {}]}>{props.title.toUpperCase()}</Text>

export default TitleOption
