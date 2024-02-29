import React, { useState, useRef, useLayoutEffect } from 'react'
import { View, Text, Pressable, StyleSheet, Switch, Animated, Platform } from 'react-native'
import { useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Animatable from 'react-native-animatable'
import { ms } from 'react-native-size-matters/extend'

import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'
import { ButtonSquare } from '../../../components/Buttons/ButtonSquare'
import { ButtonIcon } from '../../../components/Buttons/ButtonIcon'

import CloseSmall from '../../../../assets/images/svg/icon/24px/close.svg'
import ChevronRight from '../../../../assets/images/svg/icon/16px/cheveron/right.svg'
import TipsIcon from '../../../../assets/images/svg/icon/24px/tips.svg'
import globals from '../../../config/globals'

import { updateUser, updateUserProfile } from '../../../data/user'
import { clearCheckmarks } from '../../../data/workout'
import { isRestrictedSelector } from '../../../data/user/selectors'

const ProgramSettingsModal = (props) => {
  const insets = useSafeAreaInsets()

  const [currentProgram] = useState(props.route.params?.program)
  const recommendedTrainer = props.route.params?.trainer ?? null
  // const [currentWeek] = useState(props.route.params?.week)
  const [weekNumber] = useState(props.route.params?.weekNumber)
  const [initial, setInitial] = useState(true)

  console.log('currentWeek', weekNumber)
  console.log('currentProgram', currentProgram)

  const hasResistanceBands = useSelector((state) => state.data.user.resistance_bands)
  const isOnline = useSelector((state) => state.offline.online)
  let trainer = useSelector((state) => (recommendedTrainer ? recommendedTrainer : state.data.workouts.currentTrainer))
  const level_id = useSelector((state) => state.data.user.meta.trainers?.[trainer.id]?.level_id)
  const level = useSelector((state) => state.data.workouts.levels?.[level_id])
  const userId = useSelector((state) => state.data.user.id)
  const audioEnabled = useSelector((state) => state.data.user.sound_alerts)
  const formTipAudioEnabled = useSelector((state) => state.data.user.form_tips_audio)
  const isRestricted = useSelector(isRestrictedSelector)

  const AnimatableView = Animatable.createAnimatableComponent(View)

  const popupTranslate = useRef(new Animated.Value(100)).current

  const clearWeekCheckmarks = () => {
    clearCheckmarks({ program_id: currentProgram.id, week_id: weekNumber, hidden: true })
  }

  const clearProgramCheckmarks = () => {
    clearCheckmarks({ program_id: currentProgram.id, hidden: true })
  }

  useLayoutEffect(() => {
    if (initial) {
      setTimeout(() => setInitial(false), 250)
    }
  }, [])

  function showTooltips() {
    props.navigation.navigate('Tooltips', { screen: 'Tooltip', params: { name: 'workout', openedManually: true } })
  }

  async function handleEquipmentToggle(value) {
    try {
      const data = await updateUserProfile({
        id: userId,
        resistance_bands: value,
      })
      updateUser(data.user)
    } catch (error) {}
  }

  async function handleAudioToggle(value) {
    try {
      const data = await updateUserProfile({
        id: userId,
        sound_alerts: value,
      })
      updateUser(data.user)
    } catch (error) {}
  }

  async function handleFormTipAudioToggle(value) {
    try {
      updateUserProfile({
        id: userId,
        form_tips_audio: value,
      })
    } catch (error) {}
  }

  function handleClearWeeks() {
    props.navigation.navigate('ConfirmationDialog', {
      yesLabel: 'CLEAR',
      noLabel: 'NEVER MIND',
      yesHandler: clearWeekCheckmarks,
      title: `Clear Week ${weekNumber} Check Marks`,
      body: `This action cannot be undone. Are you sure you want to clear all week ${weekNumber} check marks?`,
    })
  }

  function handleClearProgram() {
    props.navigation.navigate('ConfirmationDialog', {
      yesLabel: 'CLEAR',
      noLabel: 'NEVER MIND',
      yesHandler: clearProgramCheckmarks,
      title: 'Clear All Program Check Marks',
      body: 'This action cannot be undone. Are you sure you want to clear all program check marks?',
    })
  }

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" />

      <Pressable onPress={props.navigation.goBack} style={styles.pressableBackground} />

      <AnimatableView
        animation={initial ? 'slideInUp' : null}
        duration={250}
        useNativeDriver={true}
        pointerEvents="box-none"
        style={styles.animatableContainer}>
        <View style={styles.header}>
          <Pressable onPress={showTooltips} style={styles.headerLeft}>
            <TipsIcon color={globals.styles.colors.colorBlack} />
          </Pressable>
          <Text style={{ fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 16, color: trainer.color }}>
            PROGRAM SETTINGS
          </Text>
          <Pressable onPress={props.navigation.goBack} style={styles.headerRight} hitSlop={12}>
            <CloseSmall color={globals.styles.colors.colorBlack} />
          </Pressable>
        </View>
        {!recommendedTrainer && (
          <View style={styles.fitnessLevel}>
            <Text style={styles.fitnessLevelLeft}>Fitness Level</Text>
            <ButtonIcon
              style={styles.fitnessLevelCenter}
              onPress={isOnline ? () => props.navigation.navigate('Level', { from: 'overview' }) : null}
              text={level.title.toUpperCase()}
              textStyle={{ fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 14, color: trainer.color }}
              rightIcon={() => isOnline && <ChevronRight style={{ marginLeft: 8 }} color={trainer.color} />}
              pressedOpacity={0.5}
            />
          </View>
        )}

        {/* Special Equipment Toggle */}
        {currentProgram.special_equipment_enabled && (
          <View style={styles.equipmentToggle}>
            <Text style={styles.equipmentToggleLeft}>{currentProgram.special_equipment_name}</Text>
            <Switch
              trackColor={{ false: globals.styles.colors.colorGrayDark, true: trainer.color }}
              thumbColor={Platform.OS === 'android' ? trainer.color : ''}
              ios_backgroundColor={globals.styles.colors.colorGrayDark}
              onValueChange={handleEquipmentToggle}
              value={hasResistanceBands}
            />
          </View>
        )}

        {/* Audio Toggle */}
        <View style={styles.audioToggle}>
          <View style={{ maxWidth: globals.window.width - 140, marginVertical: 8 }}>
            <Text style={styles.equipmentToggleLeft}>Sound Alerts</Text>
            <Text style={styles.clearSubtitle}>
              Indicates end of rest, when to switch sides, or when to move onto the next timed exercise.
            </Text>
          </View>
          <Switch
            trackColor={{ false: globals.styles.colors.colorGrayDark, true: trainer.color }}
            thumbColor={Platform.OS === 'android' ? trainer.color : ''}
            ios_backgroundColor={globals.styles.colors.colorGrayDark}
            onValueChange={handleAudioToggle}
            value={audioEnabled}
          />
        </View>

        {/* Proper form tips audio toggle */}
        {/* <View style={styles.audioToggle}>
          <View style={{ maxWidth: globals.window.width - 140, marginVertical: 8 }}>
            <Text style={styles.equipmentToggleLeft}>Autoplay Proper Form Tips</Text>
            <Text style={styles.clearSubtitle}>Listen to proper form tips for each move as you work out.</Text>
          </View>
          <Switch
            trackColor={{ false: globals.styles.colors.colorGrayDark, true: trainer.color }}
            thumbColor={Platform.OS === 'android' ? trainer.color : ''}
            ios_backgroundColor={globals.styles.colors.colorGrayDark}
            onValueChange={handleFormTipAudioToggle}
            value={formTipAudioEnabled}
          />
        </View> */}

        {isRestricted ? (
          <View style={{ marginBottom: insets.bottom }} />
        ) : (
          <>
            <View style={styles.clearHeader}>
              <Text style={styles.clearHeaderText}>Clear Check Marks</Text>
            </View>

            {!recommendedTrainer && weekNumber && (
              <View style={styles.clearWeekContainer}>
                <View>
                  <Text style={styles.clearTitle}>Clear Week {weekNumber} Check Marks</Text>
                  <Text style={styles.clearSubtitle}>This cannot be undone</Text>
                </View>
                <ButtonSquare onPress={handleClearWeeks} text={'CLEAR'} style={styles.clearButton} textStyle={styles.clearButtonText} />
              </View>
            )}

            <View style={[styles.clearProgramContainer, { marginBottom: insets.bottom }]}>
              <View>
                <Text style={styles.clearTitle}>Clear All Program Check Marks</Text>
                <Text style={styles.clearSubtitle}>This cannot be undone</Text>
              </View>
              <ButtonSquare onPress={handleClearProgram} text={'CLEAR'} style={styles.clearButton} textStyle={styles.clearButtonText} />
            </View>
          </>
        )}
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
  headerLeft: { position: 'absolute', left: 16 },
  headerRight: { position: 'absolute', right: 16 },
  fitnessLevel: {
    height: ms(67),
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: globals.styles.colors.colorGray,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fitnessLevelLeft: { fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 14 },
  fitnessLevelCenter: { flexDirection: 'row', alignItems: 'center' },
  equipmentToggle: {
    height: ms(67),
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: globals.styles.colors.colorGray,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  equipmentToggleLeft: { fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 14 },
  audioToggle: {
    minHeight: ms(67),
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: globals.styles.colors.colorGray,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearHeader: {
    height: ms(32),
    backgroundColor: globals.styles.colors.colorGrayLight,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearHeaderText: { fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 14 },
  clearWeekContainer: {
    height: ms(85),
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: globals.styles.colors.colorGray,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearProgramContainer: {
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

export default ProgramSettingsModal
