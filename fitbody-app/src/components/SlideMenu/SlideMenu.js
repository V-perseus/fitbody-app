import React, { forwardRef, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as Animatable from 'react-native-animatable'

import Close from '../../../assets/images/svg/icon/24px/close.svg'
import ChevronCircleLeft from '../../../assets/images/svg/icon/24px/circle/cheveron-left.svg'

import { useCombinedRefs } from '../../shared/hooks/useCombinedRefs'

import { ButtonOpacity } from '../Buttons/ButtonOpacity'

import globals from '../../config/globals'

export const SlideMenu = forwardRef((props, ref) => {
  const { children, title = 'OPTIONS', immediate = false, height = 254, duration = 300, zIndex = 8, onCancel = null, onBack = null } = props

  // We need to be able to access this ref for animating from both within and without this component
  const innerRef = useRef(null)
  const combinedRef = useCombinedRefs(ref, innerRef)

  const blankAnim = {
    from: {
      translateY: height,
    },
    to: {
      translateY: height,
    },
  }

  return (
    <View pointerEvents="box-none" style={[styles.container, { zIndex: zIndex }]}>
      <Animatable.View
        pointerEvents="box-none"
        ref={combinedRef}
        useNativeDriver={true}
        animation={immediate ? 'slideInUp' : blankAnim}
        duration={duration}
        style={[styles.animatedView, { height: height }]}>
        <View style={styles.headerContainer}>
          {onBack && (
            <ButtonOpacity
              style={styles.backButton}
              onPress={() => {
                combinedRef?.current?.slideOutDown(duration)
                onBack()
              }}>
              <ChevronCircleLeft color={globals.styles.colors.colorBlack} />
            </ButtonOpacity>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
          <ButtonOpacity
            style={styles.closeButton}
            onPress={() => {
              combinedRef?.current?.slideOutDown(duration)
              onCancel && onCancel()
            }}>
            <Close color={globals.styles.colors.colorBlack} />
          </ButtonOpacity>
        </View>
        <View style={styles.childContainer}>{children}</View>
      </Animatable.View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 0,
  },
  animatedView: {
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6.27,
    width: '100%',
    backgroundColor: globals.styles.colors.colorWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContainer: {
    borderBottomColor: globals.styles.colors.colorGray,
    borderBottomWidth: 2,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTitle: { color: globals.styles.colors.colorLove, fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 16 },
  backButton: { position: 'absolute', left: 24 },
  closeButton: { position: 'absolute', right: 24 },
  childContainer: { flex: 1, alignItems: 'center' },
})
