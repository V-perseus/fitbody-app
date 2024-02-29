import React, { memo } from 'react'
import {
  Pressable,
  View,
  Image,
  Text,
  Dimensions,
  ActivityIndicator,
  TextStyle,
  NativeSyntheticEvent,
  ImageErrorEventData,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native'
import { Grayscale } from 'react-native-image-filter-kit'
import { ms } from 'react-native-size-matters/extend'

import ChevronRight from '../../../../../assets/images/svg/icon/16px/cheveron/right.svg'
import Checked from '../../../../../assets/images/svg/icon/32px/circle/checked.svg'
import Offline from '../../../../../assets/images/svg/icon/40px/offline.svg'

import globals from '../../../../config/globals'
import { useAppSelector } from '../../../../store/hooks'

/*
  Deprecated in favor of Goal.tsx which already did the same and more
*/

interface ICategoryCardProps {
  title: string
  subtitle: string
  titleStyle?: TextStyle
  downloading?: boolean
  downloaded: boolean
  onPress: () => void
  image: ImageSourcePropType
  workoutCount: number
  completedCount: number
  programColor: string
  showCheckmarks: boolean
}
export const CategoryCard: React.FC<ICategoryCardProps> = memo(
  ({
    title,
    subtitle,
    titleStyle,
    downloading,
    downloaded,
    onPress,
    image,
    workoutCount,
    completedCount,
    programColor,
    showCheckmarks,
  }) => {
    const isOnline = useAppSelector((state) => state.offline.online)

    function handleImageError(error: NativeSyntheticEvent<ImageErrorEventData>) {
      console.log('Categtory Card image load error: ', error)
    }

    function handleCardPress() {
      if (downloading) {
        return
      }
      onPress()
    }

    return (
      <Pressable onPress={handleCardPress} style={({ pressed }) => functionalStyles.container(pressed)}>
        <>
          {!downloaded && !isOnline ? (
            <>
              <Grayscale image={<Image style={styles.image} resizeMode="cover" source={image} onError={handleImageError} />} />
              <View
                style={{
                  ...styles.image,
                  flexDirection: 'column',
                  alignSelf: 'center',
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Offline color={'black'} />
              </View>
            </>
          ) : downloading ? (
            <Grayscale image={<Image style={styles.image} resizeMode="cover" source={image} />} />
          ) : (
            <Image style={styles.image} resizeMode="cover" source={image} onError={handleImageError} />
          )}
          <View style={styles.titleContainer}>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text style={[styles.title, titleStyle]}>{title.toUpperCase()}</Text>
                <Text style={styles.subtitle}>{!downloaded && !isOnline ? 'OFFLINE - RECONNECT TO ACCESS' : subtitle}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {downloaded ? (
                [...Array(workoutCount)].map((_, i) => (
                  <Checked
                    key={`${i}_checked`}
                    style={{ marginRight: 4 }}
                    width={ms(32, 2)}
                    height={ms(32, 2)}
                    color={i < completedCount ? programColor : globals.styles.colors.colorGrayDark}
                  />
                ))
              ) : showCheckmarks && isOnline ? (
                <ActivityIndicator />
              ) : null}

              {/* <>
                    <Checked key={`${'i'}_checked`} style={{ marginRight: 4 }} color={programColor} /><Text>6 / 6</Text><Checked key={`${'i'}_checked`} style={{ marginRight: 4 }} color={'programColor'} /><Text>4</Text></> */}

              {(isOnline || downloaded) && <ChevronRight style={{ marginLeft: 4 }} color={globals.styles.colors.colorGray} />}
            </View>
          </View>
        </>
      </Pressable>
    )
  },
)

const functionalStyles = {
  container: (pressed: boolean): ViewStyle => ({
    marginTop: 20,
    borderRadius: 7.7,
    flexDirection: 'column',
    marginHorizontal: 24,
    backgroundColor: globals.styles.colors.colorWhite,
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOffset: {
      width: 0,
      height: 0, // pressed ? 2 : 7,
    },
    shadowOpacity: pressed ? 0.25 : 0.43,
    shadowRadius: pressed ? 3.84 : 9.51,

    elevation: pressed ? 5 : 15,
  }),
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: Dimensions.get('window').width * 0.422,
    borderTopLeftRadius: 7.7,
    borderTopRightRadius: 7.7,
  },
  titleContainer: {
    paddingVertical: 14,
    paddingLeft: 24,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 25,
  },
  subtitle: {
    color: globals.styles.colors.colorGrayDark,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 14,
    marginTop: -3,
  },
})
