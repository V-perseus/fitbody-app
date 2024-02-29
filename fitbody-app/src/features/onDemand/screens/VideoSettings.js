import React, { useState, useLayoutEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Animatable from 'react-native-animatable'
import { ms } from 'react-native-size-matters/extend'
import { CastButton } from 'react-native-google-cast'

import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'
import { ButtonSquare } from '../../../components/Buttons/ButtonSquare'

import CloseSmall from '../../../../assets/images/svg/icon/24px/close.svg'
import globals from '../../../config/globals'

import { clearCheckmarks } from '../../../data/workout'
import { useSegmentLogger } from '../../../services/hooks/useSegmentLogger'

const VideoSettingsModal = ({ navigation, route }) => {
  const { logEvent } = useSegmentLogger()
  const insets = useSafeAreaInsets()

  const categoryId = route.params?.categoryId ?? null

  const [initial, setInitial] = useState(true)

  const AnimatableView = Animatable.createAnimatableComponent(View)

  const clearCategoryCheckmarks = () => {
    clearCheckmarks({ video_category_id: categoryId, hidden: true })
    logEvent(null, 'Check Marks Unchecked', {
      type: 'Video Completion',
      scope: 'multi',
      category_id: categoryId,
    })
  }

  useLayoutEffect(() => {
    if (initial) {
      setTimeout(() => setInitial(false), 250)
    }
  }, [])

  function handleClearCategory() {
    navigation.navigate('ConfirmationDialog', {
      yesLabel: 'CLEAR',
      noLabel: 'NEVER MIND',
      yesHandler: clearCategoryCheckmarks,
      title: 'Clear All Category Check Marks',
      body: 'This action cannot be undone. Are you sure you want to clear all category check marks?',
    })
  }

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" />

      <Pressable onPress={navigation.goBack} style={styles.pressableBackground} />

      <AnimatableView
        animation={initial ? 'slideInUp' : null}
        duration={250}
        useNativeDriver={true}
        pointerEvents="box-none"
        style={styles.animatableContainer}>
        <View style={styles.header}>
          <Text style={{ fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 16, color: globals.styles.colors.colorBlack }}>
            ON DEMAND SETTINGS
          </Text>
          <Pressable onPress={navigation.goBack} style={styles.headerRight}>
            <CloseSmall color={globals.styles.colors.colorBlack} />
          </Pressable>
        </View>

        <View style={styles.clearCategoryContainer}>
          <View>
            <Text style={styles.clearTitle}>Clear All Category Check Marks</Text>
            <Text style={styles.clearSubtitle}>This cannot be undone</Text>
          </View>
          <ButtonSquare onPress={handleClearCategory} text={'CLEAR'} style={styles.clearButton} textStyle={styles.clearButtonText} />
        </View>

        <View style={[styles.castContainer, { marginBottom: insets.bottom }]}>
          <View style={{ flexShrink: 1, paddingRight: 4 }}>
            <Text style={styles.clearTitle}>Cast Workout Videos</Text>
            <Text style={styles.clearSubtitle}>
              Casting is available when both devices are on the same network and within casting range
            </Text>
          </View>
          <CastButton style={{ width: 28, height: 28, tintColor: globals.styles.colors.colorBlack }} />
        </View>
      </AnimatableView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pressableBackground: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    marginBottom: 0,
  },
  animatableContainer: {
    position: 'absolute',
    zIndex: 20,
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOffset: {
      width: 0,
      height: 0, // pressed ? 2 : 7,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6.27,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: globals.styles.colors.colorWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    flexShrink: 1,
  },
  header: {
    height: ms(57),
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: { position: 'absolute', right: 16 },
  clearCategoryContainer: {
    height: ms(85),
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: globals.styles.colors.colorGray,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  castContainer: {
    height: ms(85),
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: globals.styles.colors.colorGray,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearTitle: { fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 14 },
  clearSubtitle: { fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 12, color: globals.styles.colors.colorGrayDark },
  clearButton: {
    height: 24,
    minWidth: 63,
    width: 'auto',
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: globals.styles.colors.colorBlackDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: { color: globals.styles.colors.colorWhite, fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 10 },
})

export default VideoSettingsModal
