import React, { useRef, useEffect } from 'react'
import { View, FlatList, TouchableOpacity } from 'react-native'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { useSelector } from 'react-redux'

// Assets
import styles from './styles'
import globals from '../../config/globals'
import { MoodsIconMap } from '../../config/svgs/dynamic/moodsMap'

import { moodsSelector } from '../../data/journal/selectors'
import { IMood } from '../../data/journal/types'

interface IMoodCarouselProps {
  mainMood: number
  onChangeMood: (id: number) => void
}
const MoodCarousel: React.FC<IMoodCarouselProps> = ({ mainMood, onChangeMood }) => {
  const moods = useSelector(moodsSelector)

  const thumbList = useRef<FlatList>(null)
  const mainCarousel = useRef<ICarouselInstance>(null)

  useEffect(() => {
    const index = moods.findIndex((item) => item.id === mainMood)
    if (index < 0) {
      return
    }
    setTimeout(() => {
      thumbList?.current?.scrollToIndex({ index, viewPosition: 0.5 })
      mainCarousel?.current?.scrollTo({ index })
    }, 750)
  }, [mainMood, moods])

  const handleTapThumbItem = (index: number) => {
    if (onChangeMood) {
      onChangeMood(moods[index].id!)
    }
  }

  function handleSnapToMainItem(index: number) {
    if (onChangeMood) {
      onChangeMood(moods[index].id!)
    }
  }

  function renderThumbItem({ item, index }: { item: IMood; index: number }) {
    const selectedMoodIndex = moods.findIndex((m) => m.id === mainMood)
    const opacity = selectedMoodIndex === index ? 1 : 0.7
    const SvgIcon = MoodsIconMap[item.icon_key]
    return (
      <TouchableOpacity style={{ width: 41, height: 25 }} onPress={() => handleTapThumbItem(index)}>
        <View style={[styles.thumbItem, { opacity }]}>
          <SvgIcon height={25} width={25} color={globals.styles.colors.colorWhite} />
        </View>
      </TouchableOpacity>
    )
  }

  function renderMainItem({ item }: { item: IMood }) {
    const SvgIcon = MoodsIconMap[item.icon_key]
    return (
      <View style={styles.mainItem}>
        <View style={styles.mainItemBackground} />
        <SvgIcon style={styles.mainItemIcon} height={169} width={169} color={globals.styles.colors.colorWhite} />
      </View>
    )
  }

  const keyExtractor = (_: any, index: number) => `mood-carousel-${index}`

  const selectedMoodIndex = moods.findIndex((item) => item.id === mainMood)

  if (selectedMoodIndex === -1) {
    return null
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.thumbListContainer}
        ref={thumbList}
        data={moods}
        renderItem={renderThumbItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        extraData={mainMood}
        getItemLayout={(_, index) => ({ length: 44, offset: 44 * index, index })}
        onScrollToIndexFailed={() => null}
        keyExtractor={keyExtractor}
      />
      <View style={styles.carousel}>
        <Carousel
          loop={false}
          ref={mainCarousel}
          data={moods}
          renderItem={renderMainItem}
          onSnapToItem={handleSnapToMainItem}
          mode="parallax"
          modeConfig={{
            parallaxScrollingOffset: globals.window.width - 160,
            // parallaxScrollingOffset: 250,
            parallaxAdjacentItemScale: 0.6,
          }}
          style={{ height: 197 }}
          width={globals.window.width}
          height={197}
        />
      </View>
    </View>
  )
}

export default MoodCarousel
