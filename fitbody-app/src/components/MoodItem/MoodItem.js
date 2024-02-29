import React from 'react'
import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native'

import { MoodsIconMap } from '../../config/svgs/dynamic/moodsMap'

import globals from '../../config/globals'

export const MoodItem = ({ iconKey, name, onPress, opacity = 1, iconSize = 60, textContainerStyle, textStyle }) => {
  const SvgIcon = MoodsIconMap?.[iconKey]

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.tile}>
        {SvgIcon && <SvgIcon color={globals.styles.colors.colorWhite} style={{ opacity }} height={iconSize} width={iconSize} />}
        <View style={[styles.textContainer, textContainerStyle]}>
          <Text style={[styles.innerText, textStyle]}>{name.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  tile: {
    height: 102,
    borderRadius: 6,
    backgroundColor: 'transparent',
    alignItems: 'center',
    width: globals.window.width * 0.24, // = 100 / 414
    marginTop: 18,
    marginBottom: 8,
  },
  textContainer: {
    marginTop: 14,
    paddingVertical: 3,
    width: globals.window.width * 0.24, // = 100 / 414
    height: 25,
    borderRadius: 6,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  innerText: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 16,
    textAlign: 'center',
  },
})
