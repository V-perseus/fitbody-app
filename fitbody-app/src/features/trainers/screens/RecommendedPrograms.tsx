import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Animated, LayoutAnimation, ScrollView, Text, View, StyleSheet, Easing } from 'react-native'

// Components
import { ButtonOpacity } from '../../../components/Buttons/ButtonOpacity'
import { ButtonRound } from '../../../components/Buttons/ButtonRound'
import { ProgramCard } from '../components/ProgramCard'
import { OnDemandCard } from '../components/OnDemandCard'
import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'

// Assets
import globals from '../../../config/globals'
import ChevronUp from '../../../../assets/images/svg/icon/16px/cheveron/up.svg'

// Data & Services
import { fetchTrainersPrograms } from '../../../data/workout'
import { useAppSelector } from '../../../store/hooks'
import { isRestrictedSelector } from '../../../data/user/selectors'
import { useInit } from '../../../services/hooks/useInit'
import { onDemandCategoriesObjectSelector } from '../../../data/media/selectors'
import NavigationService from '../../../services/NavigationService'

// Types
import { IProgram, QuizResponseProgramType } from '../../../data/workout/types'
import { RecommendedProgramsScreenNavigationProps } from '../../../config/routes/routeTypes'
import { IVideoCategory } from '../../../data/media/types'

interface IRecommendedProgramsProps extends RecommendedProgramsScreenNavigationProps {}
export const RecommendedPrograms: React.FC<IRecommendedProgramsProps> = ({ navigation, route }) => {
  const fromCategories = route.params?.fromCategories
  const recommended = useAppSelector((state) => state.data.user.quiz?.programs || [])
  const programs = useAppSelector((state) => state.data.workouts.programs)
  const onDemandCategories = useAppSelector(onDemandCategoriesObjectSelector)
  const isRestricted = useAppSelector(isRestrictedSelector)

  const hasRecommendedPrograms = recommended.length > 0

  const [expandedIndices, setExpandedIndices] = useState<Record<number, boolean>>({
    0: true,
    1: hasRecommendedPrograms ? false : true,
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerLeft}>CHOOSE A PROGRAM</Text>,
      headerTitleAlign: 'left',
      headerLeft: () => null,
    })
  }, [navigation])

  useInit(fetchTrainersPrograms)

  const slideLayoutAnimation = async () => {
    // just call this function before a state change you want animated
    // requires that list items have key that does not change between rerenders
    const CustomLayoutLinear = {
      duration: 200,
      create: {
        type: LayoutAnimation.Types.easeIn,
        property: LayoutAnimation.Properties.scaleY,
      },
      update: {
        type: LayoutAnimation.Types.easeOut,
        property: LayoutAnimation.Properties.scaleY,
      },
    }
    LayoutAnimation.configureNext(CustomLayoutLinear)
  }

  function onHeaderPress(index: number) {
    slideLayoutAnimation()
    setExpandedIndices({
      ...expandedIndices,
      [index]: expandedIndices[index] ? false : true,
    })
  }

  async function viewProgram(prog: IProgram) {
    navigation.navigate('ProgramDetails', { slug: prog.slug, fromCategories })
  }

  async function viewOnDemand(c: IVideoCategory) {
    if (isRestricted) {
      NavigationService.sendToPaywall({
        from: 'RecommendedPrograms',
        params: { fromCategories: false },
      })
      return
    }
    navigation.navigate('Guidance', {
      screen: 'OnDemandCategory',
      params: {
        title: c.name,
        headerImage: c.header_image_url,
        categoryId: c.id!,
        description: c.description,
      },
    })
  }

  function retakeQuiz() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'QuizLevel' }],
    })
  }

  return (
    <>
      <FocusAwareStatusBar barStyle="dark-content" />
      <ScrollView stickyHeaderIndices={[0, 2]} contentContainerStyle={{ flexGrow: 1 }}>
        <ScrollViewHeader
          title="Recommended for you"
          onPress={() => onHeaderPress(0)}
          expanded={expandedIndices[0]}
          disabled={!hasRecommendedPrograms}
          titleRightSlot={
            hasRecommendedPrograms && (
              <ButtonRound
                style={styles.headerRetakeButton}
                pressedOpacity={0.5}
                onPress={retakeQuiz}
                text="RE-TAKE QUIZ"
                textStyle={styles.headerRetakeButtonText}
              />
            )
          }
        />
        <View style={styles.recommendedContentWrapper}>
          {expandedIndices[0] &&
            (hasRecommendedPrograms ? (
              <View style={styles.cardsWrapper}>
                {recommended.map((prog, idx) => {
                  if (prog.type === QuizResponseProgramType.program) {
                    return (
                      <ProgramCard
                        key={`${programs[prog.slug]}_${idx}`}
                        item={programs[prog.slug]}
                        onPress={() => viewProgram(programs[prog.slug])}
                      />
                    )
                  } else {
                    return (
                      <OnDemandCard
                        key={prog.id}
                        item={onDemandCategories[prog.id]}
                        onPress={() => viewOnDemand(onDemandCategories[prog.id])}
                      />
                    )
                  }
                })}
              </View>
            ) : (
              <View style={styles.takeQuizWrapper}>
                <ButtonRound text="TAKE QUIZ" style={styles.takeQuizButton} onPress={retakeQuiz} textStyle={styles.takeQuizButtonText} />
              </View>
            ))}
        </View>
        <ScrollViewHeader
          title={`${!hasRecommendedPrograms ? '' : expandedIndices[1] ? 'Hide' : 'Show'} All Programs`}
          onPress={() => onHeaderPress(1)}
          expanded={expandedIndices[1]}
          disabled={!hasRecommendedPrograms}
        />
        <View>
          {expandedIndices[1] && (
            <View style={styles.cardsWrapper}>
              {Object.values(programs).map((prog, idx) => {
                return (
                  <ProgramCard
                    key={`${programs[prog.slug]}_${idx}`}
                    item={programs[prog.slug]}
                    onPress={() => viewProgram(programs[prog.slug])}
                  />
                )
              })}
              {Object.keys(onDemandCategories)
                .filter((prog) => onDemandCategories[Number(prog)].show_on_quiz)
                .map((prog) => {
                  return (
                    <OnDemandCard
                      key={prog}
                      item={onDemandCategories[Number(prog)]}
                      onPress={() => viewOnDemand(onDemandCategories[Number(prog)])}
                    />
                  )
                })}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  )
}

interface IScrollViewHeaderProps {
  onPress: () => void
  title: string
  titleRightSlot?: React.ReactNode
  expanded: boolean
  disabled: boolean
}
const ScrollViewHeader: React.FC<IScrollViewHeaderProps> = ({ onPress, title, titleRightSlot, expanded, disabled = false }) => {
  const spinValue = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(spinValue.current, {
      toValue: expanded ? 0 : 1,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }, [expanded])

  const spin = spinValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  function handlePress() {
    if (!disabled) {
      onPress()
    }
  }

  return (
    <View style={styles.headerButton}>
      <ButtonOpacity style={styles.headerTitleLeft} onPress={handlePress}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          {!disabled && <ChevronUp color={globals.styles.colors.colorBlack} />}
        </Animated.View>
      </ButtonOpacity>
      <View>{titleRightSlot && titleRightSlot}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerLeft: {
    color: globals.styles.colors.colorBlack,
    fontSize: 30,
    fontFamily: globals.fonts.secondary.style.fontFamily,
  },
  headerTitleLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    padding: 12,
    paddingLeft: 24,
    color: globals.styles.colors.colorBlack,
    fontSize: 20,
    fontFamily: globals.fonts.secondary.style.fontFamily,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: globals.styles.colors.colorWhite,
  },
  headerRetakeButton: {
    height: 24,
    borderWidth: 1,
    borderRadius: 24,
    backgroundColor: globals.styles.colors.colorWhite,
    marginRight: 24,
    borderColor: globals.styles.colors.colorBlack,
  },
  headerRetakeButtonText: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 10,
    paddingHorizontal: 15,
    color: globals.styles.colors.colorBlack,
  },
  recommendedContentWrapper: { borderBottomWidth: 1, borderBottomColor: globals.styles.colors.colorGray },
  cardsWrapper: { paddingVertical: 8, alignItems: 'center' },
  takeQuizWrapper: { marginHorizontal: 24, marginTop: 24, marginBottom: 32 },
  takeQuizButton: { backgroundColor: globals.styles.colors.colorPink, width: '100%' },
  takeQuizButtonText: {
    fontSize: 16,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
})
