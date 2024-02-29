import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Text, View, StyleSheet, ImageBackground, Animated } from 'react-native'
import LinearGradient2 from 'react-native-linear-gradient'
import { OverlayBlend, LinearGradient } from 'react-native-image-filter-kit'
import * as Animatable from 'react-native-animatable'
import { SharedElement } from 'react-navigation-shared-element'
import { ms, vs } from 'react-native-size-matters/extend'

// Components
import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'
import { SvgUriLocal } from '../../workouts/components/SvgUriLocal'
import { ButtonRound } from '../../../components/Buttons/ButtonRound'

// Assets
import CogIcon from '../../../../assets/images/svg/icon/24px/navigation/cog.svg'
import LockIcon from '../../../../assets/images/svg/icon/24px/lock-fill.svg'
// import CircleCheckIcon from '../../../../assets/images/svg/icon/40px/circle/check.svg'
import globals from '../../../config/globals'

// Services
import { resolveLocalUrl } from '../../../services/helpers'
import { acceptDisclaimer, setCurrentGoal, updateUserProfile } from '../../../data/user'
import { setCurrentProgram, setCurrentTrainer } from '../../../data/workout'
import { isRestrictedSelector } from '../../../data/user/selectors'
import NavigationService from '../../../services/NavigationService'

export const ProgramDetails = ({ navigation, route }) => {
  const slug = route.params?.slug ?? ''
  const fromCategories = route.params?.fromCategories ?? false

  const userMeta = useSelector((state) => state.data.user.meta)
  const userId = useSelector((state) => state.data.user.id)
  const disclaimer_accepts = useSelector((state) => state.data.user.disclaimer_accepts)
  const programs = useSelector((state) => state.data.workouts.programs)
  const trainers = useSelector((state) => state.data.workouts.trainers)
  const levelFromQuiz = useSelector((state) => state.data.user.quiz?.level)
  const isRestricted = useSelector(isRestrictedSelector)

  const [showBackButton, setShowBackButton] = useState(true)
  const [zIndexWatcher, setZIndexWatcher] = useState(5)

  const program = programs?.[slug] ?? null
  const trainer = trainers.find((t) => t.programs.includes(program?.id))
  const headerImageUrl = program?.background_image_url
  const activeWeek = userMeta.programs[slug?.toLowerCase()]?.active_week
  // console.log('PROGRAM', program)

  const scrollView = useRef(null)
  const panel = useRef(null)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerLeft: () => (
        <HeaderButton
          onPress={() => navigation.navigate('RecommendedPrograms', { fromCategories: true })}
          iconColor={globals.styles.colors.colorWhite}
        />
      ),
      headerRight: () => (
        <HeaderButton
          onPress={() => {
            navigation.navigate('Modals', {
              screen: 'ProgramSettings',
              params: { program, trainer },
            })
          }}>
          <CogIcon color={globals.styles.colors.colorWhite} width={24} height={24} />
        </HeaderButton>
      ),
      headerTitle: program.title,
      headerTitleStyle: {
        fontFamily: globals.fonts.accent.style.fontFamily,
        fontSize: 40,
        color: globals.styles.colors.colorWhite,
        opacity: opacityInterpolation,
      },
      headerBackground: () => (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: trainer.secondary_color,
              opacity: opacityInterpolation,
              shadowColor: globals.styles.colors.colorBlackDark,
              shadowOpacity: 1,
              shadowRadius: 15,
              elevation: 18,
            },
          ]}>
          <LinearGradient2 style={StyleSheet.absoluteFill} colors={[trainer.secondary_color, trainer.color]} />
        </Animated.View>
      ),
    })
  }, [navigation, program, trainer])

  useEffect(() => {
    if (program?.id) {
      panel.current?.fadeInUp(350)
    }
  }, [program?.id])

  const scrollY = useRef(new Animated.Value(0)).current

  const opacityInterpolation = scrollY.interpolate({
    inputRange: [0, 80, 130],
    outputRange: [0, 0, 1],
  })

  const reverseOpacityInterpolation = scrollY.interpolate({
    inputRange: [0, 60, 130],
    outputRange: [1, 1, 0],
  })

  function handleScroll(event) {
    // this swaps z-index so that the program selector is clickable
    // but then is lowered so it slides behind the card on scroll
    const newY = event.nativeEvent.contentOffset.y
    if (newY > 44 && zIndexWatcher === 5) {
      setZIndexWatcher(0)
    } else if (newY <= 44 && zIndexWatcher === 0) {
      setZIndexWatcher(5)
    }

    // this will show hide the back button as a user scroll
    if (newY > 130 && showBackButton) {
      setShowBackButton(false)
    } else if (newY < 130 && !showBackButton) {
      setShowBackButton(true)
    }
  }

  const changeGoal = async (hasBeenVisited) => {
    setCurrentGoal(slug)

    const lSlug = slug.toLowerCase()
    const currentWeek = userMeta.programs[lSlug]?.current_week

    const newUser = {
      id: userId,
      workout_goal: slug,
      meta: {
        ...userMeta,
        programs: {
          ...userMeta.programs,
          [lSlug]: {
            ...userMeta.programs[lSlug],
            active_week: activeWeek ? activeWeek : 2,
            current_week: currentWeek ? currentWeek : 1,
          },
        },
        trainers: {
          ...userMeta.trainers,
          [trainer.id]: {
            // if we're already in the app and already have a level for the selected trainer, use it. Else use the level from the quiz. Else default to 1
            level_id: fromCategories && hasBeenVisited ? userMeta.trainers[trainer.id]?.level_id : levelFromQuiz ? levelFromQuiz : 1,
          },
        },
      },
    }
    updateUserProfile(newUser)
    setCurrentProgram(program)
    setCurrentTrainer(trainer)
  }

  const goToNext = () => {
    navigation.navigate('Categories')
  }

  const acceptHandler = () => {
    const hasBeenVisited = userMeta.programs[slug?.toLowerCase()]?.program_selected
    acceptDisclaimer(program)
    changeGoal(hasBeenVisited)
    navigation.pop()
    goToNext()
  }

  const showDisclaimerFor = () => {
    navigation.navigate('Modals', {
      screen: 'Disclaimer',
      params: {
        title: program.disclaimer_title,
        body: program.disclaimer_text,
        approvalRequired: program.approval_required,
        acceptHandler: () => acceptHandler(program, trainer),
      },
    })
  }

  async function handleStartProgram() {
    if (isRestricted) {
      NavigationService.sendToPaywall({
        from: { name: 'ProgramDetails', params: { slug: program?.slug, id: program?.id } },
      })
    } else {
      if (program?.has_disclaimer && !disclaimer_accepts?.[slug]) {
        showDisclaimerFor()
      } else {
        const hasBeenVisited = userMeta.programs[slug?.toLowerCase()]?.program_selected
        changeGoal(hasBeenVisited)
        goToNext(hasBeenVisited)
      }
    }
  }

  if (!program || !trainer) {
    return null
  }
  return (
    <>
      <FocusAwareStatusBar barStyle="light-content" />
      <OverlayBlend
        style={styles.flex}
        dstImage={
          <LinearGradient
            style={styles.flex}
            colors={[
              trainer.secondary_color,
              trainer.color,
              trainer.color,
              globals.styles.colors.colorWhite,
              globals.styles.colors.colorWhite,
            ]}
            start={{ y: '100h', x: '0w' }}
            end={{ x: 0, y: '0h' }}
            stops={[0, 0.35, 0.7, 0.7, 1]}
          />
        }
        resizeCanvasTo={'srcImage'}
        srcImage={
          <>
            <View style={StyleSheet.absoluteFill}>
              <ImageBackground
                style={{ width: '100%', height: '100%' }}
                // style={{ width: globals.window.width, borderWidth: 1, height: 230 }}
                resizeMode="cover"
                resizeMethod="resize"
                source={{
                  uri: resolveLocalUrl(headerImageUrl),
                }}>
                <Animated.View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: 290,
                    opacity: reverseOpacityInterpolation,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    zIndex: zIndexWatcher,
                  }}>
                  <View style={styles.center}>
                    <View style={styles.textContainer}>
                      <SharedElement id={'bg_header_text'}>
                        <View style={{ height: 80 }}>
                          <Text style={styles.programName}>{program.title?.toUpperCase()}</Text>
                          <Text style={styles.trainerName}>{`WITH ${trainer.name?.toUpperCase()}`}</Text>
                        </View>
                      </SharedElement>
                      <View style={styles.rowBetween}>
                        <View style={styles.rowLeft}>
                          <Text style={styles.duration}>{program.session_duration}</Text>
                          <Text style={styles.durationText}>MINUTE{'\n'}WORKOUTS</Text>
                        </View>
                        <View style={styles.rowCenter} />
                        <View style={styles.rowRight}>
                          <Text style={styles.description}>{program.description?.toUpperCase()}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              </ImageBackground>
            </View>
            <Animated.ScrollView
              ref={scrollView}
              style={styles.animatedScrollview}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollY,
                      },
                    },
                  },
                ],
                {
                  useNativeDriver: true,
                  listener: handleScroll,
                },
              )}
              scrollEventThrottle={16}>
              <Animatable.View ref={panel} style={[styles.panel]} useNativeDriver>
                <View style={styles.panelHeader}>
                  <Text style={[styles.panelHeaderText, { color: trainer.color }]}>EQUIPMENT NEEDED</Text>
                  <View style={styles.panelHeaderIconRow}>
                    {program.equipment?.map((e, idx) => (
                      <View style={styles.panelHeaderIcon} key={`equipment_${idx}`}>
                        <SvgUriLocal
                          uri={e.icon_url}
                          color={trainer.color}
                          style={{
                            fontSize: 40,
                          }}
                        />
                        <Text style={[styles.panelHeaderIconText, { color: trainer.color }]}>{e.name.toUpperCase()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionHeaderText}>PROGRAM OVERVIEW</Text>
                  <Text style={styles.descriptionText}>{program.long_description}</Text>
                  <View style={styles.grayContainer}>
                    {program.bullets?.map((b, idx) => (
                      <View
                        key={`Bullet_${idx}`}
                        style={[styles.listItem, { borderBottomWidth: idx === program.bullets.length - 1 ? 0 : 1 }]}>
                        <View style={[styles.bullet, { backgroundColor: trainer.color }]} />
                        <Text style={styles.bulletText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.weeksContainer}>
                  <View style={styles.grayContainer}>
                    {program.rounds.map((r, idx) => {
                      return (
                        <View
                          key={`round_${idx}`}
                          style={[styles.weeksItem, { borderBottomWidth: idx === program.rounds.length - 1 ? 0 : 1 }]}>
                          <View style={styles.weekLabelVerticalContainer}>
                            <Text style={styles.weekLabelVertical}>{r.label}</Text>
                          </View>
                          <Text style={styles.weekLabelNum}>{r.round_number}</Text>
                          <Text style={styles.weekLabelRange}>{r.description}</Text>
                          {/* <View style={{ marginLeft: 'auto' }}>
                            {r.is_open && activeWeek > r.end_week ? (
                              <CircleCheckIcon color={globals.styles.colors.colorPink} style={styles.checkedIcon} />
                            ) : null}
                          </View> */}
                        </View>
                      )
                    })}
                  </View>
                </View>
                <View style={styles.trainerContainer}>
                  <LinearGradient2
                    colors={[globals.styles.colors.colorGrayLight, globals.styles.colors.colorWhite]}
                    style={styles.trainerContainerGradient}
                  />
                  <View style={styles.trainerImageContainer}>
                    <ImageBackground
                      style={styles.trainerForegroundContainer}
                      imageStyle={styles.trainerForegroundImageStyle}
                      resizeMode={'cover'}
                      resizeMethod="resize"
                      source={{
                        uri: resolveLocalUrl(trainer.banner_img_url),
                      }}
                    />
                  </View>
                  <Text style={[styles.trainerAboutTitleText, { color: trainer.color }]}>ABOUT YOUR TRAINER</Text>
                  <Text style={styles.trainerAboutText}>{trainer.description}</Text>
                </View>
              </Animatable.View>
            </Animated.ScrollView>
          </>
        }
      />
      <LinearGradient2
        colors={[globals.styles.colors.colorTransparentWhite15, globals.styles.colors.colorWhite]}
        style={styles.bottomGradient}>
        <ButtonRound
          text="START PROGRAM"
          onPress={handleStartProgram}
          icon={
            isRestricted ? <LockIcon color={globals.styles.colors.colorWhite} width={24} height={24} style={{ marginRight: 12 }} /> : null
          }
          style={{ backgroundColor: trainer.color, width: globals.window.width - 48, marginLeft: 24 }}
        />
      </LinearGradient2>
    </>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  relative: { position: 'relative' },
  center: { alignItems: 'center', justifyContent: 'center' },
  animatedScrollview: { flex: 1, zIndex: 1, paddingTop: 232 },
  container: {
    flex: 1,
    position: 'relative',
  },
  headerLeft: {
    padding: 8,
    paddingLeft: 16,
    position: 'absolute',
    left: 0,
  },
  headerRight: {
    padding: 8,
    paddingRight: 16,
    position: 'absolute',
    right: 0,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 225,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
  },
  headerSubtext: {
    marginTop: -5,
    color: globals.styles.colors.colorWhite,
    fontSize: 35,
    fontFamily: globals.fonts.secondary.style.fontFamily,
  },
  panel: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: globals.styles.colors.colorWhite,
    marginBottom: 262,
  },
  panelHeader: {
    height: 134,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: globals.styles.colors.colorGray,
  },
  panelHeaderText: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 16,
    marginBottom: 16,
  },
  panelHeaderIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  panelHeaderIcon: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: vs(12),
  },
  panelHeaderIconText: {
    fontSize: 10,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
  },
  descriptionContainer: {
    padding: 24,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: globals.styles.colors.colorGray,
  },
  descriptionHeaderText: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
  },
  descriptionText: {
    paddingTop: 8,
    paddingBottom: 24,
    fontSize: 16,
  },
  grayContainer: {
    backgroundColor: globals.styles.colors.colorGrayLight,
    borderRadius: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: globals.styles.colors.colorGray,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 50,
    marginRight: 12,
  },
  bulletText: {
    fontSize: 16,
  },
  weeksContainer: {
    padding: 24,
  },
  weeksItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomColor: globals.styles.colors.colorGray,
  },
  weekLabelVerticalContainer: {
    width: 40,
  },
  weekLabelVertical: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    transform: [{ rotate: '270deg' }],
    fontSize: 18,
    width: 40,
    textAlign: 'center',
    // borderWidth: 1,
  },
  weekLabelNum: {
    fontSize: 48,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    marginLeft: -8,
    height: 52,
    marginRight: 24,
  },
  weekLabelRange: {
    fontSize: 18,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
  checkedIcon: {
    marginRight: 5,
  },
  trainerContainer: {
    padding: 24,
    backgroundColor: globals.styles.colors.colorWhite,
    paddingBottom: 48,
  },
  trainerContainerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  trainerImageContainer: {
    borderRadius: 5.6,
    height: (120 / 366) * (globals.window.width - 48),
  },
  trainerForegroundContainer: { width: '100%', height: '100%' },
  trainerForegroundImageStyle: { borderRadius: 5.6 },
  trainerAboutTitleText: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
    marginVertical: 12,
  },
  trainerAboutText: {
    marginBottom: 24,
    fontSize: 16,
  },

  textContainer: {
    // ...StyleSheet.absoluteFillObject,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, minWidth: 140 },
  rowCenter: {
    height: 40,
    borderWidth: 1,
    borderColor: globals.styles.colors.colorWhite,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  rowRight: { paddingLeft: 8, width: 140 },
  programName: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: ms(71),
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
    lineHeight: 71,
  },
  trainerName: {
    fontSize: 16,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
    marginTop: -15,
    marginBottom: 15,
  },
  duration: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    paddingRight: 8,
    fontSize: 36,
  },
  durationText: {
    width: 82,
    lineHeight: 15,
    marginTop: 3,
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
  description: {
    color: globals.styles.colors.colorWhite,
    lineHeight: 15,
    marginTop: 3,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
  bottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, zIndex: 3 },
})
