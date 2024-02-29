import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import globals from '../../config/globals'

export default (props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{props.title.toUpperCase()}</Text>
    <TouchableOpacity onPress={props.handler}>
      <Text style={styles.action}>{props.action}</Text>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  container: {
    width: globals.window.width,
    height: 38,
    paddingTop: 4,
    paddingLeft: 21,
    paddingRight: 15,
    backgroundColor: 'rgba(255,255,255, 1)',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: globals.styles.colors.colorGray,
  },
  title: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
    color: globals.styles.colors.colorBlack,
  },
  action: {
    color: globals.styles.colors.colorLove,
    fontSize: 13,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
})
