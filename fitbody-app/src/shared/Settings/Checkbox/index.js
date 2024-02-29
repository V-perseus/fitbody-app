import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import CircleCheckedIcon from '../../../../assets/images/svg/icon/40px/circle/check.svg'
import globals from '../../../config/globals'
import { EatingPreferencesMap } from '../../../config/svgs/dynamic/eatingPreferencesMap'

const Checkbox = (props) => {
  const SvgIcon = EatingPreferencesMap?.[props.iconName]
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: globals.styles.colors.colorGray,
        height: 67,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}>
      {SvgIcon && <SvgIcon style={{ marginRight: 16 }} height={24} width={24} color={props.iconColor} />}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 14, color: globals.styles.colors.colorBlack }}>
          {props.title}
        </Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            props.onChecked(!props.checked)
          }}>
          {props.checked ? (
            <CircleCheckedIcon color={globals.styles.colors.colorPink} />
          ) : (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: globals.styles.colors.colorGray,
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Checkbox
