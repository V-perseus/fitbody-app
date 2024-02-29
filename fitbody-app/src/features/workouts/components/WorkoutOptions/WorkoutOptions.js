import React, { useEffect, useRef, memo, useState, useCallback } from 'react'
import { View, Text, Animated, StyleSheet, Platform, Switch } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { ms } from 'react-native-size-matters/extend'

import { SlideMenu } from '../../../../components/SlideMenu/SlideMenu'
import { ButtonOpacity } from '../../../../components/Buttons/ButtonOpacity'
import { AlternativeMoveCard } from '../AlternativeMoveCard/AlternativeMoveCard'

import globals from '../../../../config/globals'
import SoundAlert from '../../../../../assets/images/svg/icon/24px/sound-alerts.svg'
import Moves from '../../../../../assets/images/svg/icon/24px/moves.svg'
import ChevronRight from '../../../../../assets/images/svg/icon/24px/cheveron/right.svg'
import AudioTipsIcon from '../../../../../assets/images/svg/icon/24px/audio-tips.svg'

import { useSegmentLogger } from '../../../../services/hooks/useSegmentLogger'

const NO_OP = () => {}

const Options = ({
  showOptions,
  onClose = NO_OP,
  onReplace = NO_OP,
  audioEnabled,
  autoplayEnabled,
  handleAudioToggle,
  handleAutoplayToggle,
  currentTrainer,
  alternatives = [],
  initialIndex = 0,
  workoutId,
  exerciseId,
}) => {
  const { logEvent } = useSegmentLogger()

  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [isAlternativeMovesPanelOpen, setIsAlternativeMovesPanelOpen] = useState(false)

  const exercises = useSelector((state) => state.data.workouts.exercises)
  const currentProgram = useSelector((state) => state.data.workouts.currentProgram)
  const exercise_weight_unit = useSelector((state) => state.data.user.exercise_weight_unit)

  const optionsPanel = useRef(null)
  const alternativeMovesPanel = useRef(null)
  const optionsBackgroundTranslate = useRef(new Animated.Value(280)).current
  const carousel = useRef(null)

  useFocusEffect(
    useCallback(() => {
      // @DEV if we are showing the options panel, we need to make sure the carousel is scrolled to the original exercise, when available
      carousel?.current?.snapToItem(initialIndex > -1 ? initialIndex : 0)
    }, [initialIndex]),
  )

  useEffect(() => {
    if (showOptions) {
      optionsPanel?.current?.slideInUp(300)
      Animated.timing(optionsBackgroundTranslate, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      optionsPanel?.current?.slideOutDown(300)
      setIsAlternativeMovesPanelOpen(false)
      Animated.timing(optionsBackgroundTranslate, {
        toValue: 337,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [showOptions])

  useEffect(() => {
    if (isAlternativeMovesPanelOpen) {
      alternativeMovesPanel?.current?.slideInUp(300)
    } else {
      alternativeMovesPanel?.current?.slideOutDown(300)
    }
  }, [isAlternativeMovesPanelOpen])

  function handleClose() {
    onClose()
  }

  function handleReplace(item) {
    logEvent(null, 'Exercise Switched', {
      workoutId,
      exerciseId,
      replacementExerciseId: item.exercise_id,
    })
    onReplace(item)
    handleClose()
  }

  function showAlternativeMovesPanel() {
    logEvent(null, 'Element Tapped', {
      name: 'Alternative Moves',
      type: 'Menu Item',
      workoutId,
      exerciseId,
    })
    setIsAlternativeMovesPanelOpen(true)
  }

  function renderCarouselItem({ item }) {
    const alt = {
      ...item,
      exercise: exercises[item.exercise_id],
    }
    return (
      <AlternativeMoveCard
        item={alt}
        unit={exercise_weight_unit}
        trainer={currentTrainer}
        program={currentProgram}
        onReplace={handleReplace}
        toggleShowState={showOptions}
      />
    )
  }

  /* ***************************************************
  When re-enabling proper form tips audio, uncomment line 131, remove line 130
  and uncomment line 161 to 175
  *************************************************** */

  return (
    <>
      {/* Options Menu Container */}
      <SlideMenu ref={optionsPanel} height={alternatives.length > 0 ? 350 : 274} onCancel={handleClose}>
        {/* <SlideMenu ref={optionsPanel} height={alternatives.length > 0 ? 450 : 384} onCancel={handleClose}> */}
        {alternatives.length > 0 && (
          <>
            <ButtonOpacity onPress={showAlternativeMovesPanel} style={styles.alternativeToggle}>
              <Moves color={globals.styles.colors.colorBlack} style={{ marginRight: 16 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.audioToggleLeft}>Alternative Moves</Text>
              </View>
              <ChevronRight color={globals.styles.colors.colorGrayDark} />
            </ButtonOpacity>
            <View style={styles.divider} />
          </>
        )}
        <View style={styles.audioToggle}>
          <SoundAlert color={globals.styles.colors.colorBlack} />
          <View style={{ maxWidth: globals.window.width - 140 }}>
            <Text style={styles.audioToggleLeft}>Sound Alerts</Text>
            <Text style={styles.audioSubtitle}>
              Indicates end of rest, when to switch sides, or when to move onto the next timed exercise.
            </Text>
          </View>
          <Switch
            trackColor={{ false: globals.styles.colors.colorGrayDark, true: currentTrainer.color }}
            thumbColor={Platform.OS === 'android' ? currentTrainer.color : ''}
            ios_backgroundColor={globals.styles.colors.colorGrayDark}
            onValueChange={handleAudioToggle}
            value={audioEnabled}
          />
        </View>
        {/* <View style={styles.divider} />
        <View style={styles.audioToggle}>
          <AudioTipsIcon color={globals.styles.colors.colorBlack} />
          <View style={{ maxWidth: globals.window.width - 140 }}>
            <Text style={styles.audioToggleLeft}>Autoplay Proper Form Tips</Text>
            <Text style={styles.audioSubtitle}>Listen to proper form tips for each move as you work out.</Text>
          </View>
          <Switch
            trackColor={{ false: globals.styles.colors.colorGrayDark, true: currentTrainer.color }}
            thumbColor={Platform.OS === 'android' ? currentTrainer.color : ''}
            ios_backgroundColor={globals.styles.colors.colorGrayDark}
            onValueChange={handleAutoplayToggle}
            value={autoplayEnabled}
          />
        </View> */}
      </SlideMenu>

      {/* Alternative Moves Menu */}
      <SlideMenu
        ref={alternativeMovesPanel}
        height={485}
        title="ALTERNATIVE MOVES"
        onCancel={handleClose}
        onBack={() => setIsAlternativeMovesPanelOpen(false)}>
        <View style={{ maxHeight: 318.5 }}>
          <Carousel
            useMomentum={true}
            scrollEndDragDebounceValue={40}
            decelerationRate={0.9}
            data={alternatives}
            ref={carousel}
            useScrollView={false}
            callbackOffsetMargin={50}
            renderItem={renderCarouselItem}
            onSnapToItem={setActiveSlideIndex}
            removeClippedSubviews={false}
            onScrollToIndexFailed={NO_OP}
            containerCustomStyle={{ flex: 1 }}
            slideStyle={{ marginTop: 23 }}
            sliderWidth={globals.window.width}
            itemWidth={ms(350)}
            firstItem={0}
            inactiveSlideOpacity={1}
          />
          <Pagination
            activeDotIndex={activeSlideIndex}
            dotsLength={alternatives.length}
            inactiveDotOpacity={0.3}
            inactiveDotScale={1}
            dotColor={globals.styles.colors.colorLove}
            inactiveDotColor={globals.styles.colors.colorGrayDark}
            containerStyle={styles.paginationContainer}
            dotContainerStyle={styles.dotContainer}
            dotStyle={styles.dots}
          />
        </View>
      </SlideMenu>
      {/* End alternative moves menu */}

      {/* Menu background */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          StyleSheet.absoluteFill,
          {
            borderWidth: 2,
            backgroundColor: globals.styles.colors.colorBlackDark,
            opacity: optionsBackgroundTranslate.interpolate({
              inputRange: [0, 280],
              outputRange: [0.5, 0],
            }),
            zIndex: 6,
          },
        ]}
      />
    </>
  )
}

export const WorkoutOptionsPanel = memo(Options)

const styles = StyleSheet.create({
  alternativeToggle: {
    minHeight: ms(67),
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    width: globals.window.width,
    borderBottomWidth: 1,
    borderBottomColor: globals.styles.colors.colorGray,
  },
  audioToggle: {
    minHeight: ms(102),
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioToggleLeft: { fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 14 },
  audioSubtitle: { fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 12, color: globals.styles.colors.colorGrayDark },
  paginationContainer: {
    paddingTop: 0,
    paddingBottom: 18,
  },
  dotContainer: {
    marginHorizontal: 4,
  },
  dots: {
    width: 8,
    height: 8,
    borderRadius: 13.2,
    margin: 0,
    padding: 0,
  },
})
