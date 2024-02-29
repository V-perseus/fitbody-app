import React from 'react'
import { View, Text, StyleSheet, Pressable, ViewProps, TextProps } from 'react-native'

import globals from '../../config/globals'
import { ActivitiesIconMap, ActivitiesIconMapType } from '../../config/svgs/dynamic/activitiesMap'

interface IActivityItemProps {
  iconKey: ActivitiesIconMapType
  name: string
  containerStyle?: ViewProps
  iconContainerStyle?: ViewProps
  iconColor?: string | null
  textStyle?: TextProps
  onPress?: () => void
  index: number
}
export const ActivityItem: React.FC<IActivityItemProps> = ({
  iconKey,
  name,
  containerStyle,
  iconContainerStyle,
  iconColor = null,
  textStyle,
  onPress,
  index,
}) => {
  const SVGIcon = ActivitiesIconMap?.[iconKey]
  const fillColor = iconColor ? iconColor : globals.styles.colors.colorWhite

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View style={[styles.tile, containerStyle]} testID={`activity_item_${index}`}>
        <View style={[styles.iconContainer, iconContainerStyle]}>
          {SVGIcon && <SVGIcon width={globals.window.width * 0.1} height={globals.window.width * 0.1} color={fillColor} />}
        </View>
        <Text style={[styles.tileText, textStyle]}>{name.toUpperCase().replace('\\N', '\n')}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    height: 117,
    marginRight: 32,
  },
  iconContainer: {
    width: globals.window.width * 0.1546, // = 64 / 414
    height: globals.window.width * 0.1546,
    borderRadius: globals.window.width * 0.0773,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: globals.styles.colors.colorPink,
  },
  tileText: {
    marginTop: 6,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 16,
    textAlign: 'center',
    color: globals.styles.colors.colorPink,
  },
})
