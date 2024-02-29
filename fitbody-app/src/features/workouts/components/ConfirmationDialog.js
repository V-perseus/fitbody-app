import React from 'react'
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native'
import * as Animatable from 'react-native-animatable'

import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'
import { ButtonSquare } from '../../../components/Buttons/ButtonSquare'

import Downloads from '../../../../assets/images/svg/icon/56px/circle/download.svg'
import Close from '../../../../assets/images/svg/icon/24px/close.svg'
import Check from '../../../../assets/images/svg/icon/40px/check/circled-outline.svg'

import globals from '../../../config/globals'

const ConfirmationDialog = ({ route, navigation }) => {
  const AnimatablePressable = Animatable.createAnimatableComponent(Pressable)

  const {
    title,
    body,
    yesLabel,
    noLabel,
    yesHandler,
    noHandler,
    iconType,
    hideNoButton,
    showCloseButton = false,
    backOnYes = true,
    backOnNo = false,
    yesBtnColor,
  } = route.params

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
        <Pressable onPress={null} style={styles.backgroundOverlay}>
          {showCloseButton && (
            <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
              <Close color={globals.styles.colors.colorBlack} onPress={() => navigation.goBack()} />
            </Pressable>
          )}

          {iconType && iconType === 'download' && <Downloads style={{ marginBottom: 16 }} color={globals.styles.colors.colorSkyBlue} />}
          {iconType === 'check' && <Check style={{ marginBottom: 16 }} color={globals.styles.colors.colorBlack} />}

          <Text style={styles.title}>{title}</Text>

          {body && <Text style={styles.body}>{body}</Text>}

          <View style={styles.buttonRow}>
            <ButtonSquare
              onPress={() => {
                yesHandler()
                if (backOnYes) {
                  navigation.goBack()
                }
              }}
              style={[
                styles.yesButton,
                {
                  width: hideNoButton ? '100%' : (Dimensions.get('window').width - 48 - 48 - 16 - 16) / 2,
                  backgroundColor: yesBtnColor || globals.styles.colors.colorPink,
                },
              ]}
              text={yesLabel ?? 'YES'}
              textStyle={styles.yesButtonText}
            />
            {!hideNoButton && (
              <ButtonSquare
                onPress={() => {
                  if (noHandler) {
                    noHandler()
                  }
                  if (!noHandler || backOnNo) {
                    navigation.goBack()
                  }
                }}
                style={styles.noButton}
                text={noLabel ?? 'NO'}
                textStyle={styles.noButtonText}
                pressedOpacity={0.5}
              />
            )}
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
  backgroundOverlay: {
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
  closeButton: { position: 'absolute', padding: 8, top: 0, right: 0 },
  title: { fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 18, textAlign: 'center' },
  body: { marginTop: 16, fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 14, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', marginTop: 22 },
  yesButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    marginHorizontal: 8,
    backgroundColor: globals.styles.colors.colorPink,
    borderRadius: 8,
  },
  yesButtonText: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 14,
    textAlign: 'center',
  },
  noButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: (Dimensions.get('window').width - 48 - 48 - 16 - 16) / 2,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: globals.styles.colors.colorBlack,
    borderRadius: 8,
    paddingHorizontal: 5,
  },
  noButtonText: {
    color: globals.styles.colors.colorBlack,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 14,
    textAlign: 'center',
  },
})

export default ConfirmationDialog
