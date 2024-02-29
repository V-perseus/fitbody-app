import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import globals from '../../config/globals'

const ListItem = (props) => (
  <View style={styles.container}>
    <Text style={[styles.text, props.number ? {} : styles.point]}>•</Text>
    {props.ingredient ? (
      <Text style={[styles.text, styles.rightLabel]}>
        {props.ingredient}
        {props.quantity ? `: ${props.quantity}` : ''}
      </Text>
    ) : (
      <Text style={[styles.text, styles.rightLabel]}>{props.title}</Text>
    )}
  </View>
)

export default ListItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: 5,
  },
  text: {
    fontSize: 14,
    color: 'white',
    lineHeight: 26,
  },
  rightLabel: {
    marginLeft: 20,
  },
  point: {
    fontSize: 14,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
})
