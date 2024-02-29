import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'

import { EatingPreferencesMap } from '../../../../config/svgs/dynamic/eatingPreferencesMap'
import { colors } from '../EatingPreference/EatingPreference'

import globals from '../../../../config/globals'

const labels = {
  REGULAR: 'Regular',
  VEGAN: 'Vegan',
  VEGETARIAN: 'Vegetarian',
  PESCATARIAN: 'Pescatarian',
  KETO: 'Keto',
  'DAIRY-FREE': 'Dairy-free',
  'GLUTEN-FREE': 'Gluten-free',
  MEDITERRANEAN: 'Mediterranean',
}

export const RecipeTag = ({ tag, onPress = () => {} }) => {
  const SvgIcon = EatingPreferencesMap?.[tag]
  return (
    <TouchableOpacity style={[styles.roundButton, { backgroundColor: colors[tag] }]} onPress={onPress}>
      {SvgIcon && <SvgIcon color={globals.styles.colors.colorWhite} height={22} width={22} />}
      <Text style={styles.foodTypeLabel}>{labels[tag] || tag}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  roundButton: {
    backgroundColor: globals.styles.colors.colorGreen,
    height: 32,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginTop: 18,
    paddingHorizontal: 8,
  },
  foodTypeLabel: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 14,
    lineHeight: 20,
    color: globals.styles.colors.colorWhite,
    marginLeft: 4,
  },
})
