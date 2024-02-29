import React, { Component } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import Carousel, { ParallaxImage } from 'react-native-snap-carousel'
import { Video, Audio, InterruptionModeIOS, InterruptionModeAndroid, ResizeMode } from 'expo-av'

// Assets
import styles from './styles'
import globals from '../../config/globals'

import MacroCalculator from '../../../assets/images/onboarding/Macro-Calculator-Results.png'
import Workout from '../../../assets/images/onboarding/Workout.png'
import Journal from '../../../assets/images/onboarding/Journal.png'

export default class FirstCarouselItem extends Component {
  /**
   * Render out a single slide
   */
  renderCarouselItem({ item }, parallaxProps) {
    return (
      <ParallaxImage
        source={item.image}
        containerStyle={{
          flex: 1,
          // flexShrink:1,
          marginBottom: 20,
          marginHorizontal: 15,
        }}
        style={{
          // flex: 1,
          resizeMode: 'contain',
        }}
        {...parallaxProps}
        parallaxFactor={0}
      />
    )
  }

  render() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.MixWithOthers, // Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true, // the important field
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers, // Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: false,
    })

    const images = [{ image: MacroCalculator }, { image: Workout }, { image: Journal }]

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' ? (
          <Carousel
            firstItem={1}
            scrollEnabled={false}
            ref={(c) => (this._sliderddRef = c)}
            data={images}
            renderItem={this.renderCarouselItem}
            useScrollView={true}
            autoplay={true}
            loop={true}
            windowSize={1}
            containerCustomStyle={styles.container}
            slideStyle={styles.container}
            hasParallaxImages={true}
            inactiveSlideOpacity={1}
            sliderWidth={globals.window.width}
            itemWidth={globals.window.width * (globals.window.height / globals.window.width) * 0.27}
          />
        ) : (
          <Video
            // ref={(ref) => {this.video = ref}}
            // onReadyForDisplay={this.onVideoReady}
            style={StyleSheet.absoluteFillObject}
            source={require('../../../assets/videos/slider.mp4')}
            isLooping
            shouldPlay
            isMuted
            resizeMode={ResizeMode.COVER}
            // bufferForPlaybackMs={500}
          />
        )}
      </View>
    )
  }
}
