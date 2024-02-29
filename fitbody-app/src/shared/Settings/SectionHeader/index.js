import React from 'react'
import { View, Text } from 'react-native'
import globals from '../../../config/globals'

const Checkbox = (props) => {
  const { title } = props

  return (
    <View
      style={{
        height: 32,
        backgroundColor: globals.styles.colors.colorGrayLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: globals.styles.colors.colorGray,
        borderBottomWidth: 1,
      }}>
      <Text style={{ fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 14, color: globals.styles.colors.colorBlack }}>
        {title}
      </Text>
    </View>
  )
}

export default Checkbox
