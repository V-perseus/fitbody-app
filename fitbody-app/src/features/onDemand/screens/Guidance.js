import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Text, View, StyleSheet, Pressable, Image as RNImage, Platform } from 'react-native'
import { Svg, Defs, ClipPath, Image, Polygon, Line } from 'react-native-svg'
import { vs } from 'react-native-size-matters/extend'
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'

import globals from '../../../config/globals'
import GuidanceBg from '../../../../assets/images/guidance/guidance.jpg'
import OnDemandLgBg from '../../../../assets/images/guidance/on-demand-large.png'

import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'
import { fetchCompletions } from '../../../data/workout'

const w = globals.window.width
const h = globals.window.height

export const Guidance = ({ navigation }) => {
  const completions = useSelector((state) => state.data.workouts.completions)
  const clipPathPoints = `0,250 0,${h} ${w},${h} ${w},0`
  // on android Svg view swallows touch events so box-none is needed, on iOS box-none is not supported on UIViews but does not swallow touch events
  const pointerEvents = Platform.OS === 'android' ? { pointerEvents: 'box-none' } : null

  function goTo(path) {
    navigation.navigate(path)
  }

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers, // Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers, // Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: true,
    }).catch((error) => console.log(error))
  }, [])

  /**
   * Gather the videos when the page is loaded
   */
  useEffect(() => {
    if (!completions) {
      // if a user goes straight to ondemand without choosing a program and has unloaded completions, we load them here
      fetchCompletions()
    }
  }, [])

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" />
      <View style={styles.textContainer} pointerEvents="none">
        <View style={styles.textSectionContainer}>
          <View style={styles.textSectionButton}>
            <Text style={styles.textSectionTitle}>ON DEMAND</Text>
            <Text style={styles.textSectionSubtitle}>CLASSES</Text>
          </View>
        </View>
        <View style={styles.textSectionContainer}>
          <View style={styles.textSectionButton}>
            <Text style={styles.textSectionTitle}>GUIDANCE</Text>
            <Text style={styles.textSectionSubtitle}>VIDEOS</Text>
          </View>
        </View>
      </View>

      <View style={styles.topImageContainer}>
        <Pressable style={styles.textSectionButton} onPress={() => goTo('OnDemandCategories')}>
          <RNImage source={OnDemandLgBg} resizeMode="cover" style={styles.topImage} />
        </Pressable>
      </View>

      <Svg height={w + vs(100)} width={w} style={styles.bottomImageContainer} {...pointerEvents}>
        <Defs>
          <ClipPath id="clip">
            <Polygon points={clipPathPoints} />
          </ClipPath>
        </Defs>
        <Image
          x="0"
          y="0"
          width={w}
          height={h}
          href={GuidanceBg}
          clipPath="url(#clip)"
          onPress={() => goTo('GuidanceCategories')}
          preserveAspectRatio="xMinYMin meet"
        />
        <Line x1="-2" y1="250" x2={w + 2} y2="2" stroke={globals.styles.colors.colorWhite} strokeWidth="5" />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topImageContainer: {
    width: w,
    height: '70%',
  },
  topImage: {
    height: '100%',
    width: w,
  },
  bottomImageContainer: {
    position: 'absolute',
    bottom: 0,
  },
  textContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
  },
  textSectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSectionButton: {
    flex: 1,
    width: w,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSectionTitle: {
    color: globals.styles.colors.colorWhite,
    fontSize: 60,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    height: 60,
  },
  textSectionSubtitle: {
    color: globals.styles.colors.colorWhite,
    fontSize: 25,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
})

Guidance.navigationOptions = {
  headerShown: false,
}
