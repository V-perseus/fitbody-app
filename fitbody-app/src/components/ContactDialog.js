import React from 'react'
import { View, Text, Pressable, StyleSheet, Dimensions, Linking } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { ms } from 'react-native-size-matters/extend'

import FocusAwareStatusBar from '../shared/FocusAwareStatusBar'
import { ButtonSquare } from '../components/Buttons/ButtonSquare'
import Close from '../../assets/images/svg/icon/24px/close.svg'
import globals from '../config/globals'

const ConfirmationDialog = ({ navigation }) => {
  const AnimatablePressable = Animatable.createAnimatableComponent(Pressable)

  return (
    <>
      <AnimatablePressable
        animation="fadeInUp"
        duration={250}
        useNativeDriver={true}
        onPress={navigation.goBack}
        // pointerEvents="box-none"
        style={styles.background}>
        <FocusAwareStatusBar barStyle="light-content" />
        <Pressable onPress={null} style={styles.card}>
          <Pressable onPress={() => navigation.goBack()} style={{ position: 'absolute', padding: 8, top: 0, right: 0 }}>
            <Close color="black" onPress={() => navigation.goBack()} />
          </Pressable>

          <Text style={styles.title}>{'CONTACT US'}</Text>

          <View style={{ flexDirection: 'column', marginTop: 22 }}>
            <ButtonSquare
              onPress={() => {
                Linking.openURL('mailto:hello@fitbodyapp.com?subject=Question about my Fit Body app')
                navigation.goBack()
              }}
              style={styles.buttonStyles}
              text="CONTACT OUR CUSTOMER SUPPORT"
              textStyle={styles.buttonTextStyles}
            />

            <ButtonSquare
              onPress={() => {
                Linking.openURL('mailto:pt@fitbodyapp.com?subject=Questions about exercises')
                navigation.goBack()
              }}
              style={[styles.buttonStyles, { marginTop: 16 }]}
              text="CONTACT OUR PHYSICAL THERAPIST"
              textStyle={styles.buttonTextStyles}
            />

            <ButtonSquare
              onPress={() => {
                Linking.openURL('mailto:nutrition@fitbodyapp.com?subject=Questions about nutrition')
                navigation.goBack()
              }}
              style={[styles.buttonStyles, { marginTop: 16 }]}
              text="CONTACT OUR REGISTERED DIETITIAN"
              textStyle={styles.buttonTextStyles}
            />
          </View>
        </Pressable>
      </AnimatablePressable>
    </>
  )
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  card: {
    flex: 1,
    marginHorizontal: 16,
    padding: 32,
    paddingBottom: 24,
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6.27,
    borderRadius: 8,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: globals.styles.colors.colorWhite,
  },
  title: { fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 18, textAlign: 'center' },
  buttonStyles: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    // width: hideNoButton ? '100%' : (Dimensions.get('window').width - 48 - 48 - 16 - 16) / 2,
    width: Dimensions.get('window').width - 96,
    backgroundColor: globals.styles.colors.colorPink,
    borderRadius: 8,
  },
  buttonTextStyles: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: ms(14),
    textAlign: 'center',
  },
})

export default ConfirmationDialog
