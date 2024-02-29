import React, { useState, useLayoutEffect } from 'react'
import { View, StyleSheet, ImageBackground, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { LinearGradient, OverlayBlend } from 'react-native-image-filter-kit'
import { useHeaderHeight } from '@react-navigation/elements'
import * as Animatable from 'react-native-animatable'
import { vs, ms } from 'react-native-size-matters/extend'

// styles & assets
import CloseSmall from '../../../../assets/images/svg/icon/24px/close.svg'
import globals from '../../../config/globals'

// services & hooks
import { resolveLocalUrl } from '../../../services/helpers'
import { useAppSelector } from '../../../store/hooks'
import { currentWorkoutColorsSelector } from '../../../data/workout/selectors'
import { userProgramLevelSelector } from '../../../data/user/selectors'

// components
import { HeaderButton } from '../../../components/Buttons/HeaderButton'

// types
import { PerformanceScreenNavigationProps } from '../../../config/routes/routeTypes'

interface PerformanceProps extends PerformanceScreenNavigationProps {}
const Performance = ({ navigation, route }: PerformanceProps) => {
  const headerHeight = useHeaderHeight()

  const [currentProgram] = useState(route.params?.program)
  const [workout] = useState(route.params?.workout)
  const [exercise] = useState(route.params?.exercise)
  const [category] = useState(route.params?.category)
  const [elapsed] = useState(route.params?.elapsed)
  const [timings] = useState(route.params?.timings)
  const [isHistory] = useState(route.params?.isHistory)

  const level_id = useAppSelector(userProgramLevelSelector)
  const { primaryColor, secondaryColor } = useAppSelector(currentWorkoutColorsSelector)

  const isCardio = workout.cardio?.length > 0

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} iconColor={globals.styles.colors.colorWhite} />,
      headerTitle: () => <Text style={[globals.header.headerTitleStyle, { color: globals.styles.colors.colorWhite }]}>MY PERFORMANCE</Text>,
      headerRight: () => {
        if (isHistory) {
          return null
        }

        return (
          <HeaderButton
            onPress={() => {
              workout.is_challenge ? navigation.navigate('Challenges') : navigation.navigate('Workouts')
            }}>
            <CloseSmall color={globals.styles.colors.colorWhite} />
          </HeaderButton>
        )
      },
    })
  }, [navigation])

  return (
    <>
      <OverlayBlend
        style={StyleSheet.absoluteFill}
        dstImage={
          <LinearGradient
            style={{ flex: 1 }}
            colors={[secondaryColor, primaryColor]}
            start={{ y: '100h', x: '0w' }}
            end={{ x: 0, y: '0h' }}
            stops={[0, 1]}
          />
        }
        resizeCanvasTo={'dstImage'}
        srcImage={
          <ImageBackground
            style={{ width: '100%', height: '100%' }}
            resizeMode={'cover'}
            resizeMethod="resize"
            source={{
              uri: resolveLocalUrl(currentProgram.background_image_url),
            }}
          />
        }
      />

      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }]}>
        <View style={styles.totalTimeWrapper}>
          <Text
            style={{ fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 16, color: globals.styles.colors.colorWhite }}>
            TOTAL {workout.is_challenge ? '' : 'WORKOUT'} TIME
          </Text>
          <Text
            style={{
              fontFamily: globals.fonts.secondary.style.fontFamily,
              fontSize: ms(45),
              color: globals.styles.colors.colorWhite,
              marginTop: 3,
            }}>
            {Math.floor(elapsed / 60)
              .toString()
              .padStart(2, '0')}
            :
            {Math.round(elapsed % 60)
              .toString()
              .padStart(2, '0')}
          </Text>
        </View>
      </View>

      <View
        pointerEvents="box-none"
        style={[
          {
            marginTop: headerHeight + 24,
            flex: 1,
            position: 'absolute',
            height: globals.window.height / 2 - vs(38) - headerHeight - 24,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'space-evenly',
            top: 0,
            flexDirection: 'column',
          },
        ]}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.subTitle}>YOU HAVE COMPLETED</Text>
        </View>
        <View style={styles.cardioLabelContainer}>
          <Text style={styles.categoryLabel}>
            {workout.is_challenge ? workout.challenge_name?.toUpperCase() : category.title.toUpperCase()}
          </Text>
          <Text style={styles.cardioLabel}>
            {isCardio ? workout.cardio.find((c) => c.level_id === level_id)?.cardioType.name : workout.title}
          </Text>
        </View>
      </View>

      <View style={styles.durationContainer}>
        <Text style={styles.durationText}>DURATION</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          {timings ? (
            timings.map((t, idx) => {
              const title = t.circuit_title ? t.circuit_title : t.circuit
              return (
                <Animatable.View key={idx} animation="fadeInUp" useNativeDriver={true} duration={300} style={styles.timeContainer}>
                  <Text style={styles.timeNameText}>{workout.is_challenge ? 'CARDIO BURN' : title?.toUpperCase()}</Text>
                  <Text style={styles.timeText}>
                    {Math.floor(t.time / 60)
                      .toString()
                      .padStart(2, '0')}
                    :
                    {Math.round(t.time % 60)
                      .toString()
                      .padStart(2, '0')}
                  </Text>
                </Animatable.View>
              )
            })
          ) : (
            <Animatable.View animation="fadeInUp" useNativeDriver={true} duration={300} style={styles.timeContainer}>
              <Text style={styles.timeNameText}>{exercise?.name?.toUpperCase() ?? 'MANUAL'}</Text>
              <Text style={styles.timeText}>
                {Math.floor(elapsed / 60)
                  .toString()
                  .padStart(2, '0')}
                :
                {Math.round(elapsed % 60)
                  .toString()
                  .padStart(2, '0')}
              </Text>
            </Animatable.View>
          )}
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: globals.fonts.accent.style.fontFamily,
    fontSize: ms(80),
    color: globals.styles.colors.colorWhite,
  },
  subTitle: {
    fontSize: ms(16),
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
    marginLeft: ms(75),
    marginTop: -25,
  },
  totalTimeWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: globals.styles.colors.colorTransparentWhite30,
    height: vs(76),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardioLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: ms(18),
    color: globals.styles.colors.colorWhite,
  },
  cardioLabel: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    textAlign: 'center',
    fontSize: vs(50),
    // letterSpacing: 0.9,
    color: globals.styles.colors.colorWhite,
  },
  durationContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 12,
    flex: 1,
    marginTop: globals.window.height / 2 + vs(38),
  },
  durationText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
    fontSize: 16,
    marginBottom: 16,
  },
  timeContainer: {
    backgroundColor: globals.styles.colors.colorWhite,
    borderRadius: 7,
    height: 56,
    alignItems: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: globals.window.width - 48,
    marginTop: 16,
  },
  timeNameText: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 16,
  },
  timeText: { fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 25, marginTop: 3 },
})

export default Performance
