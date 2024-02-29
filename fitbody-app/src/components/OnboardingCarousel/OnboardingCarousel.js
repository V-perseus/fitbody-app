import React, { Component } from 'react'
import { View, Image, Text, Dimensions } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'

// Assets
import styles from './styles'
import globals from '../../config/globals'

import Trial from '../../../assets/images/onboarding/trial.png'
import Trainers from '../../../assets/images/onboarding/onboarding-trainers.png'
import Videos from '../../../assets/images/onboarding/group.png'
import Meals from '../../../assets/images/onboarding/meals.png'
import Emojis from '../../../assets/images/onboarding/emojis.png'

export default class OnboardingCarousel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeSlide: 0,
      slides: [
        {
          id: 0,
          image: Trial,
          title: 'welcome to the fit body app!',
          description: "We know you're going to love everything\nwe offer but just in case, you get 7 days\nfree to test it out!",
        },
        {
          id: 1,
          image: Videos,
          title: 'everything you need in one app!',
          description: '6 expert trainers, 250+ weeks of workouts,\nand 300+ recipes all in your pocket!',
        },
        {
          id: 2,
          image: Trainers,
          title: '6 trainers + 20 Programs',
          description: 'Get results that last. Switch between\ntrainers and their programs at any time!',
        },
        {
          id: 3,
          image: Meals,
          title: 'meal plans + food tracker',
          description:
            'To maximize your results, choose\nbetween custom portion meal plans or\ncreate your own using our food tracker\nand nutrition database',
        },
        {
          id: 4,
          image: Emojis,
          margin: 0,
          title: 'wellness journal',
          description: 'Log your daily moods, goals, and\nachievements to keep track of your\nmental and emotional well-being',
        },
      ],
    }
  }

  /**
   * Render out a single slide
   */
  renderCarouselItem({ item }, parallaxProps) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }} key={item.id}>
        <View style={{ flex: 1 }}>
          <Image
            source={item.image}
            style={[styles.image, item.margin === 0 ? { width: Dimensions.get('window').width - item.margin } : null]}
            resizeMode={'contain'}
          />
        </View>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    )
  }

  /**
   * Render them all!
   */
  render() {
    const { activeSlide, slides } = this.state

    return (
      <View style={styles.container}>
        <Carousel
          // enableSnap={false}
          useMomentum={true}
          scrollEndDragDebounceValue={40}
          decelerationRate={0.9}
          ref={(c) => (this._slider1Ref = c)}
          data={slides}
          useScrollView={false}
          callbackOffsetMargin={50}
          renderItem={this.renderCarouselItem}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
          removeClippedSubviews={false}
          containerCustomStyle={{ flex: 1 }}
          slideStyle={{ flex: 1, alignItems: 'center' }}
          windowSize={1}
          sliderWidth={globals.window.width}
          itemWidth={globals.window.width}
          firstItem={0}
          // useScrollView={true}
        />
        <Pagination
          activeDotIndex={activeSlide}
          dotsLength={slides.length}
          inactiveDotOpacity={0.3}
          inactiveDotScale={1}
          dotColor={globals.styles.colors.colorLove}
          inactiveDotColor={globals.styles.colors.colorGrayDark}
          containerStyle={styles.paginationContainer}
          dotContainerStyle={styles.dotContainer}
          dotStyle={styles.dots}
        />
      </View>
    )
  }
}
