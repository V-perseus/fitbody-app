import React from 'react'
import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import globals from '../../config/globals'

const ContactSupport = (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={[styles.questions, props.color ? { color: props.color } : null]}>Have Questions? </Text>
      <TouchableOpacity onPress={props.onPress}>
        <Text style={[styles.contactus, { color: props.linkColor ? props.linkColor : props.color ? props.color : undefined }]}>
          Contact Us.
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = {
  container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  questions: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 12,
    letterSpacing: 0.4,
    color: globals.styles.colors.colorWhite,
  },
  contactus: {
    fontSize: 12,
    letterSpacing: 0.4,
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
}

export default ContactSupport
