import React, { memo, useCallback, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import RAnimated, { Extrapolate, interpolate, SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'

import globals from '../../../../config/globals'
import { ExerciseWeightUnit } from '../../../../data/user/types'
import { ICircuit, IProgram, ITrainer } from '../../../../data/workout/types'
import CircuitCard from '../CircuitCard'

const MODE_CONFIG = {
  parallaxScrollingScale: 0.85,
  parallaxScrollingOffset: 50,
  parallaxAdjacentItemScale: 0.85,
}

interface ICircuitCarouselProps {
  showCarousel: boolean
  circuits: ICircuit[]
  currentProgram: IProgram
  currentTrainer: ITrainer
  exercise_weight_unit: ExerciseWeightUnit
  primaryColor: string
}
const CircuitCarousel: React.FC<ICircuitCarouselProps> = memo(
  ({ showCarousel, circuits, currentProgram, currentTrainer, exercise_weight_unit, primaryColor }) => {
    const progressValue = useSharedValue(0)

    const [currentSlide, setCurrentSlide] = useState(0)

    const renderCarouselItem = useCallback(
      ({ item, index: cardIndex }: { item: ICircuit; index: number }) => {
        return (
          <CircuitCard
            active={cardIndex >= currentSlide - 1 && cardIndex <= currentSlide + 1}
            unit={exercise_weight_unit}
            title={item.circuitMaster?.circuits_title ?? ''}
            program={currentProgram}
            trainer={currentTrainer}
            exercises={item.exercises}
            repsRounds={String(item.rounds_or_reps)}
          />
        )
      },
      [currentProgram, currentTrainer, exercise_weight_unit, currentSlide],
    )

    return (
      <>
        {!!progressValue && (
          <View style={styles.paginationContainer}>
            {circuits.map((_, index) => {
              return (
                <PaginationItem
                  backgroundColor={primaryColor}
                  animValue={progressValue}
                  index={index}
                  key={index}
                  // isRotate={false}
                  length={circuits.length}
                />
              )
            })}
          </View>
        )}

        {showCarousel && (
          <Carousel
            data={circuits}
            vertical={false}
            snapEnabled={true}
            pagingEnabled={true}
            width={globals.window.width}
            windowSize={10}
            loop={false}
            style={styles.carouselContainerStyle}
            height={globals.window.height + 950}
            onSnapToItem={setCurrentSlide}
            renderItem={renderCarouselItem}
            mode="parallax"
            modeConfig={MODE_CONFIG}
            panGestureHandlerProps={{
              activeOffsetX: [-10, 10],
            }}
            onProgressChange={(_, absoluteProgress) => (progressValue.value = absoluteProgress)}
          />
        )}
      </>
    )
  },
)

interface IPaginationItemProps {
  animValue: SharedValue<number>
  index: number
  length: number
  backgroundColor: string
}
const PaginationItem: React.FC<IPaginationItemProps> = ({ animValue, index, length, backgroundColor }) => {
  const width = 9

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1]
    let outputRange = [-width, 0, width]

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1]
      outputRange = [-width, 0, width]
    }

    return {
      transform: [
        {
          translateX: interpolate(animValue?.value, inputRange, outputRange, Extrapolate.CLAMP),
        },
      ],
    }
  }, [animValue, index, length])

  return (
    <View
      style={{
        backgroundColor: backgroundColor + '50',
        width,
        height: width,
        borderRadius: 50,
        overflow: 'hidden',
        marginHorizontal: 4,
      }}>
      <RAnimated.View
        style={[
          {
            borderRadius: 50,
            backgroundColor,
            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    alignSelf: 'center',
    height: 50,
  },
  carouselContainerStyle: {
    // alignSelf: 'flex-start',
    top: -132,
    marginBottom: 67,
  },
})

export default CircuitCarousel
