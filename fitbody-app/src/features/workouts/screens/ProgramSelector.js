import React, { useRef, memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { View, Pressable, StyleSheet, Text, ImageBackground, ScrollView, LayoutAnimation, Animated, Easing } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Animatable from 'react-native-animatable'
import { s } from 'react-native-size-matters/extend'

import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'
import { ButtonOpacity } from '../../../components/Buttons/ButtonOpacity'

import { setCurrentTrainer, setCurrentProgram } from '../../../data/workout'
import { acceptDisclaimer, setCurrentGoal, updateUserProfile } from '../../../data/user'
import { selectTrainersWithPrograms } from '../../../data/workout/selectors'
import { resolveLocalUrl } from '../../../services/helpers'

import globals from '../../../config/globals'
import ChevronDown from '../../../../assets/images/svg/icon/24px/cheveron/down.svg'

const ProgramSettingsModal = (props) => {
  const [openIndex, setOpenIndex] = useState(null)

  const userMeta = useSelector((state) => state.data.user.meta)
  const userId = useSelector((state) => state.data.user.id)
  const disclaimer_accepts = useSelector((state) => state.data.user.disclaimer_accepts)
  const trainers = useSelector(selectTrainersWithPrograms)
  const programs = useSelector((state) => state.data.workouts.programs)

  const menu = useRef(null)
  const scrollViewRef = useRef(null)

  const slideLayoutAnimation = async () => {
    // just call this function before a state change you want animated
    // requires that list items have key that does not change between rerenders
    const CustomLayoutLinear = {
      duration: 200,
      create: {
        type: LayoutAnimation.Types.easeIn,
        property: LayoutAnimation.Properties.scaleX,
      },
      update: {
        type: LayoutAnimation.Types.easeOut,
      },
    }
    LayoutAnimation.configureNext(CustomLayoutLinear)
  }

  const changeGoal = async (goal, trainer, hasBeenVisited) => {
    setCurrentGoal(goal)

    const slug = goal.toLowerCase()
    const currentWeek = userMeta.programs[slug]?.current_week
    const activeWeek = userMeta.programs[slug]?.active_week

    const newUser = {
      id: userId,
      workout_goal: goal,
      meta: {
        ...userMeta,
        programs: {
          ...userMeta.programs,
          [slug]: {
            ...userMeta.programs[slug],
            active_week: activeWeek ? activeWeek : 2,
            current_week: currentWeek ? currentWeek : 1,
          },
        },
        trainers: {
          ...userMeta.trainers,
          [trainer.id]: {
            level_id: hasBeenVisited ? userMeta.trainers[trainer.id]?.level_id : 1,
          },
        },
      },
    }
    updateUserProfile(newUser)
    // make sure currentTrainer programs is int[],
    // in this component, trainer programs are enriched with program data
    setCurrentTrainer({
      ...trainer,
      programs: trainer.programs.map((p) => p.id),
    })
    setCurrentProgram(programs[goal])
    menu.current?.slideOutUp(500)
  }

  const goToNext = (trainer, hasBeenVisited) => {
    if (!userMeta.trainers || !userMeta.trainers[trainer.id] || !hasBeenVisited) {
      setTimeout(() => props.navigation.navigate('Level', { from: 'goal' }), 300)
    } else {
      setTimeout(() => props.navigation.navigate('Categories'), 300)
    }
  }

  const acceptHandler = (program, trainer) => {
    const slug = program.slug.toLowerCase()
    const hasBeenVisited = userMeta.programs[slug]?.program_selected
    acceptDisclaimer(program)
    changeGoal(program.slug, trainer, hasBeenVisited)
    props.navigation.pop()
    goToNext(trainer, hasBeenVisited)
  }

  const showDisclaimerFor = (program, trainer) => {
    props.navigation.navigate('Modals', {
      screen: 'Disclaimer',
      params: {
        title: program.disclaimer_title,
        body: program.disclaimer_text,
        approvalRequired: program.approval_required,
        acceptHandler: () => acceptHandler(program, trainer),
      },
    })
  }

  const handleGoalPress = async (trainer, program) => {
    if (program.is_coming_soon) {
      return
    }
    if (program.has_disclaimer && !disclaimer_accepts?.[program.slug]) {
      showDisclaimerFor(program, trainer)
    } else {
      const slug = program.slug.toLowerCase()
      const hasBeenVisited = userMeta.programs[slug]?.program_selected
      changeGoal(program.slug, trainer, hasBeenVisited)
      goToNext(trainer, hasBeenVisited)
    }
  }

  const toggleListItem = (idx) => {
    if (idx === openIndex) {
      setOpenIndex(null)
    } else {
      setOpenIndex(idx)
    }

    setTimeout(() => {
      if (idx > 1) {
        scrollViewRef.current?.scrollToEnd()
      } else {
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animation: true })
      }
    }, 0)
  }

  function handleBackPress() {
    props.navigation.goBack()
  }

  return (
    <Pressable onPress={handleBackPress} style={styles.background}>
      <FocusAwareStatusBar hidden={true} />
      <Animatable.View
        ref={menu}
        animation="slideInDown"
        duration={250}
        useNativeDriver={true}
        pointerEvents="box-none"
        style={styles.panel}>
        <ScrollView ref={scrollViewRef} style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {trainers.map((t, i) => (
            <ProgramSelectorTrainerCard
              key={t.id}
              trainer={t}
              cardIndex={i}
              openIndex={openIndex}
              handleGoalPress={handleGoalPress}
              toggleListItem={toggleListItem}
              slideLayoutAnimation={slideLayoutAnimation}
            />
          ))}
        </ScrollView>
        <View style={styles.handle} />
      </Animatable.View>
    </Pressable>
  )
}

const ProgramSelectorTrainerCard = ({ openIndex, cardIndex, trainer, handleGoalPress, toggleListItem, slideLayoutAnimation }) => {
  const insets = useSafeAreaInsets()
  const [spinValue] = useState(new Animated.Value(0))

  const rotateIcon = (val) => {
    Animated.timing(spinValue, {
      toValue: val,
      duration: 250,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  function getRowStyle(i, len) {
    return {
      height: 53,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: i < len - 1 ? 1 : 0,
      borderBottomColor: globals.styles.colors.colorGray,
    }
  }

  function handleCardPress() {
    rotateIcon(openIndex === cardIndex ? 0 : 1)
    slideLayoutAnimation()
    toggleListItem(cardIndex)
  }

  return (
    <View style={styles.grow}>
      <Pressable
        style={{
          marginTop: cardIndex > 0 ? 0 : insets.top || 20,
          flexGrow: 1,
          borderRadius: 5.6,
          height: (120 / 366) * (globals.window.width - 48),
          marginHorizontal: 24,
          marginBottom: openIndex !== cardIndex ? 24 : 0,
          shadowColor: globals.styles.colors.colorBlackDark,
          shadowOpacity: 0.25,
          shadowRadius: 10,
        }}
        onPress={handleCardPress}>
        <ImageBackground
          style={styles.foregroundContainer}
          imageStyle={styles.foregroundImageStyle}
          resizeMode={'cover'}
          resizeMethod="resize"
          source={{
            uri: resolveLocalUrl(trainer.banner_img_url),
          }}>
          <Animated.View style={[styles.chevron, { transform: [{ rotate: spin }] }]}>
            <ChevronDown color={globals.styles.colors.colorWhite} />
          </Animated.View>
        </ImageBackground>
      </Pressable>
      {openIndex === cardIndex && (
        <View style={styles.grow}>
          {trainer.programs.map((p, idx) => (
            <ButtonOpacity key={p.id} style={{ alignItems: 'center' }} onPress={() => handleGoalPress(trainer, p)}>
              <View style={getRowStyle(idx, trainer.programs.length)}>
                <Text style={[styles.programTitle, { color: trainer.color }]}>{`${p.title} ${p.is_coming_soon ? 'COMING SOON' : ''}`}</Text>
              </View>
            </ButtonOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grow: { flexGrow: 1 },
  background: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginBottom: 0,
  },
  panel: {
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6.27,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: globals.styles.colors.colorWhite,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    height: globals.window.height * 0.71,
    zIndex: 20,
    // flexShrink: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  handle: {
    width: 32,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: globals.styles.colors.colorGray,
    marginVertical: 8,
  },
  programTitle: {
    marginTop: 3,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 25,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bigNumberLabel: {
    color: globals.styles.colors.colorWhite,
    fontSize: 29.4,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    marginRight: 10,
    lineHeight: 36,
  },
  descriptionLabel: {
    color: globals.styles.colors.colorBlackDark,
    fontSize: 12.2,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    lineHeight: 13,
  },
  line: {
    height: 25,
    width: 1,
    backgroundColor: globals.styles.colors.colorWhite,
    marginHorizontal: 10,
  },
  fill: { width: '100%', height: '100%' },
  backgroundImageStyle: { borderRadius: 5.6 },
  foregroundContainer: { width: '100%', height: '100%' },
  foregroundImageStyle: { borderRadius: 5.6 },
  chevron: {
    position: 'absolute',
    bottom: 3,
    right: s(108),
  },
})

export default memo(ProgramSettingsModal)
