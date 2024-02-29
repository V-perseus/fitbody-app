import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { Text, Animated, Easing, View, TouchableOpacity, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import _ from 'lodash'

import { TOOLTIPS, TRANSITION_TYPES } from './tooltipConfig'
import globals from '../../config/globals'
import { updateTooltipsViewed } from '../../data/user'

import styles from './styles'

export const CarouselButton = ({ navigation, index, slideIndex, setSlideIndex, slideCount, onClose, openedManually }) => {
  const isLastBackgroundSlide = slideIndex === slideCount - 1

  function handleOnPress() {
    if (!isLastBackgroundSlide) {
      setSlideIndex(slideIndex)
    } else {
      onClose()
      if (openedManually) {
        navigation.goBack(null)
      }
    }
  }

  return (
    <TouchableOpacity onPress={handleOnPress} key={index} activeOpacity={1}>
      <View>
        <Text style={styles.buttonText}>TAP TO {`${isLastBackgroundSlide ? 'CLOSE' : 'CONTINUE'}`}</Text>
      </View>
    </TouchableOpacity>
  )
}

export const CarouselSlide = ({ item, fadeProp, slideProp }) => {
  const animatedStyles = useMemo(
    () => [
      styles.carouselContainer,
      {
        transform: [{ translateX: slideProp }],
        opacity: fadeProp,
      },
    ],
    [slideProp, fadeProp],
  )

  return (
    <Animated.View style={animatedStyles}>
      <View>
        <View style={styles.slideContainer}>
          <Image source={item.baseLayerImage} resizeMode="contain" style={styles.baseLayerImage} />
        </View>
      </View>
    </Animated.View>
  )
}

const TooltipCarousel = ({ navigation, route }) => {
  const [slides, setSlides] = useState([])
  const [name, setName] = useState('')
  const [slideIndex, setSlideIndexValue] = useState(0)

  const [slideOffsetAnim] = useState(new Animated.Value(0))
  const [fadeAnim] = useState(new Animated.Value(1))

  const openedManually = route.params?.openedManually
  const subTitle = route.params?.subTitle ?? 'TUTORIAL'
  const to = route.params?.to ?? null

  useEffect(() => {
    const nameParam = route.params?.name
    const availableSlides = TOOLTIPS[nameParam].slides
    setSlides(availableSlides)
    setSlideIndexValue(0)
    setName(nameParam.toUpperCase())
  }, [])

  const setSlideIndex = useCallback(
    (currentIndex) => {
      const currentSlideTransition = slides[currentIndex].transitionType

      if (currentSlideTransition === TRANSITION_TYPES.fade) {
        Animated.timing(fadeAnim, {
          useNativeDriver: false,
          toValue: 0,
          duration: 250,
          easing: Easing.circle,
        }).start(() => {
          setSlideIndexValue(currentIndex + 1)
          Animated.timing(fadeAnim, {
            useNativeDriver: false,
            toValue: 1,
            duration: 250,
            easing: Easing.circle,
          }).start()
        })
      } else if (currentSlideTransition === TRANSITION_TYPES.slide) {
        Animated.timing(slideOffsetAnim, {
          useNativeDriver: true,
          toValue: -globals.window.width,
          duration: 250,
          easing: Easing.bezier(0, 0, 0.2, 1),
        }).start(() => {
          slideOffsetAnim.setValue(globals.window.width * 2)
          setSlideIndexValue(currentIndex + 1)
          Animated.timing(slideOffsetAnim, {
            useNativeDriver: true,
            toValue: 0,
            duration: 250,
            easing: Easing.bezier(0, 0, 0.2, 1),
          }).start()
        })
      } else {
        setSlideIndexValue(currentIndex + 1)
      }
    },
    [slides],
  )

  function onClose() {
    const nameParam = route.params?.name
    const tooltipId = TOOLTIPS[nameParam].id

    tooltipId && updateTooltipsViewed(tooltipId)
    if (to) {
      navigation.navigate(to)
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient style={styles.gradientBg} colors={[globals.styles.colors.colorPink, globals.styles.colors.colorLavender]} />

      <View style={styles.headerContainer}>
        <Text style={styles.tipNameText}>{name.toUpperCase()}</Text>
        <View style={styles.rowAlignCenter}>
          <Text style={styles.whiteText}>{subTitle}</Text>
        </View>
      </View>

      {slides.length > 0 && (
        <View style={styles.middle}>
          <CarouselSlide item={slides[slideIndex]} fadeProp={fadeAnim} slideProp={slideOffsetAnim} />
          <View style={styles.buttonContainer}>
            <CarouselButton
              navigation={navigation}
              slideIndex={slideIndex}
              setSlideIndex={setSlideIndex}
              slideCount={_.size(slides)}
              slides={slides}
              onClose={onClose}
              openedManually={openedManually}
            />
          </View>
        </View>
      )}
    </View>
  )
}

export default TooltipCarousel
