import React, { useState, memo, useCallback } from 'react'
import { ImageSourcePropType, Pressable, View, Image, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import moment, { Moment } from 'moment'
import { Grayscale } from 'react-native-image-filter-kit'
import { ms } from 'react-native-size-matters/extend'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { CompositeNavigationProp, NavigationProp, useNavigation } from '@react-navigation/native'

// Assets
import ChevronRight from '../../../../../assets/images/svg/icon/24px/cheveron/right.svg'
import Checked from '../../../../../assets/images/svg/icon/32px/circle/checked.svg'
import Info from '../../../../../assets/images/svg/icon/24px/info.svg'
// import Downloading from '../../../../../assets/images/svg/icon/32px/circle/downloading.svg'
import Downloaded from '../../../../../assets/images/svg/icon/32px/circle/downloaded.svg'
import Offline from '../../../../../assets/images/svg/icon/40px/offline.svg'

// State
import { hideCompletion, submitCompletion } from '../../../../data/workout'
import { useAppSelector } from '../../../../store/hooks'

// Components
import DatePickerModal from '../../../../components/DatePickerModal'

// Styles
import globals from '../../../../config/globals'

// types
import { MainBottomTabNavigatorParamList, MainStackParamList } from '../../../../config/routes/routeTypes'
import { ICardioInfo, ICategory, ICompletion, ILevel, IProgram, ITrainer, IWorkout } from '../../../../data/workout/types'

interface IWeekGoalProps {
  id?: number
  title: string
  subtitle: string
  titleStyle?: TextStyle
  downloading?: boolean
  downloaded: boolean
  progress?: number
  onPress: () => void
  image: ImageSourcePropType
  workoutCount: number
  completedCount: number
  programColor: string
  completion?: ICompletion
  onDownloadPress?: () => void
  showCheckmarks: boolean
  cardioInfo?: ICardioInfo
  category: ICategory
  categoryImage: ImageSourcePropType
  currentProgram?: IProgram
  currentTrainer: ITrainer
  workout?: IWorkout
  level?: ILevel
  current_week?: number
}
export const WeekGoal: React.FC<IWeekGoalProps> = memo(
  ({
    id,
    title,
    subtitle,
    titleStyle,
    downloading,
    downloaded,
    progress,
    onPress,
    image,
    workoutCount,
    completedCount,
    programColor,
    completion,
    onDownloadPress,
    category,
    cardioInfo,
    showCheckmarks,
    categoryImage,
    currentProgram,
    currentTrainer,
    workout,
    level,
    current_week,
  }) => {
    const navigation =
      useNavigation<CompositeNavigationProp<NavigationProp<MainBottomTabNavigatorParamList>, NavigationProp<MainStackParamList>>>()
    // const [isCompleted, setIsCompleted] = useState(completion)
    const startDate = useAppSelector((state) => state.data.user.created_at)

    const isOnline = useAppSelector((state) => state.offline.online)

    const [showDatePicker, setShowDatePicker] = useState(false)

    const removeCheckmark = () => {
      if (completion?.id !== undefined) {
        hideCompletion({ id: Number(completion.id) })
      }
    }

    const addCheckmark = (date: Moment) => {
      // setIsCompleted(true)
      if (!currentProgram || !workout || !level) {
        return
      }

      const newCompletion = {
        server: {
          workout_id: workout.id,
          manual: true,
          date: date.format('YYYY-MM-DD'),
          meta: { level_id: level.id },
        },
        local: {
          workout_id: workout.id,
          manual: true,
          date: date.format('YYYY-MM-DD'),
          meta: { level_id: level.id },
          hidden: false,
          category_icon_url: workout.is_challenge ? null : category.icon_url,
          program_color: currentProgram.color,
          program_color_secondary: currentProgram.color_secondary,
          trainer_color: currentTrainer.color,
          trainer_color_secondary: currentTrainer.secondary_color,
          workout_title: workout.title,
          workout_category: category.title,
          level_title: level.title,
          week_number: current_week,
          program_id: currentProgram.id,
          trainer_id: 1,
          challenge_name: null,
          is_challenge: false,
          challenge_day: null,
          challenge_background_img: null,
          is_video: false,
          video_id: null,
          time: 0,
        },
      }

      submitCompletion(newCompletion)
    }

    const toggleCheckmark = useCallback(() => {
      if (completion && !completion.hidden) {
        navigation.navigate('Modals', {
          screen: 'ConfirmationDialog',
          params: {
            yesLabel: 'CLEAR',
            noLabel: 'KEEP CHECK',
            yesHandler: removeCheckmark,
            title: 'Are you sure you want to clear the check for this workout?',
          },
        })
      } else {
        setShowDatePicker(true)
      }
    }, [completion, id, navigation])

    const toGuidanceScreen = () => {
      // bump this to the back of the event loop since it's
      // called from within a modal screen
      setTimeout(() => {
        navigation.navigate('Guidance', { screen: 'GuidanceCategories' })
      }, 400)
    }

    function handleCardioInfoPress() {
      navigation.navigate('Modals', {
        screen: 'ConfirmationDialog',
        params: {
          showCloseButton: true,
          yesLabel: 'VIEW GUIDANCE SECTION',
          noLabel: 'KEEP CHECK',
          hideNoButton: true,
          yesHandler: toGuidanceScreen,
          title: cardioInfo?.name ?? '',
          body: cardioInfo?.description ?? '',
        },
      })
    }

    function handleDownloadPress() {
      onDownloadPress?.()
    }

    return (
      <>
        <Pressable
          onPress={!(!downloaded && !isOnline) && !downloading ? onPress : null}
          style={({ pressed }) => functionalStyles.container(pressed)}>
          <>
            {!downloaded && !isOnline ? (
              <>
                <Grayscale image={<Image style={styles.image} resizeMode="cover" source={categoryImage} />} />
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
              <Grayscale image={<Image style={styles.image} resizeMode="cover" source={categoryImage} />} />
            ) : (
              <Image style={styles.image} resizeMode="cover" source={image} />
            )}
            {id && !(!downloaded && !isOnline) && (
              <Pressable onPress={toggleCheckmark} style={{ position: 'absolute', padding: 12, top: 0, right: 0 }}>
                <Checked
                  width={ms(32, 0)}
                  height={ms(32, 0)}
                  color={completion && !completion.hidden ? programColor : globals.styles.colors.colorGrayDark}
                />
              </Pressable>
            )}
            {id && !!downloaded && (
              <Pressable onPress={handleDownloadPress} style={{ position: 'absolute', padding: 8, top: 12 + ms(32, 0), right: 4 }}>
                <Downloaded width={ms(32, 0)} height={ms(32, 0)} color={globals.styles.colors.colorSkyBlue} />
              </Pressable>
            )}
            {id && !!downloading && !(!downloaded && !isOnline) && (
              <Pressable onPress={handleDownloadPress} style={{ position: 'absolute', padding: 8, top: 44, right: 4 }}>
                <AnimatedCircularProgress
                  style={{ borderWidth: 8, borderRadius: 16, borderColor: globals.styles.colors.colorGrayDark }}
                  size={16}
                  tintColor={globals.styles.colors.colorGrayDark}
                  rotation={0}
                  width={8}
                  padding={0}
                  fill={progress}
                  backgroundColor={globals.styles.colors.colorWhite}
                  backgroundWidth={8}
                />
                {/* <Downloading color={'#bbb'} /> */}
              </Pressable>
            )}
            <View style={styles.titleContainer}>
              <View style={{ flexDirection: 'row' }}>
                <View>
                  {cardioInfo ? (
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.title, titleStyle, !downloaded && !isOnline ? { color: globals.styles.colors.colorBlack } : {}]}>
                        {`${cardioInfo ? cardioInfo.name : ''}`.toUpperCase()}
                      </Text>
                      <Pressable onPress={handleCardioInfoPress} style={{ marginLeft: 6, marginTop: 2 }}>
                        <Info color={globals.styles.colors.colorGrayDark} />
                      </Pressable>
                    </View>
                  ) : (
                    <Text style={[styles.title, titleStyle, !downloaded && !isOnline ? { color: globals.styles.colors.colorBlack } : {}]}>
                      {title.toUpperCase()}
                    </Text>
                  )}
                  <Text style={styles.subtitle}>
                    {!downloaded && !isOnline ? 'OFFLINE - RECONNECT TO ACCESS' : downloading ? 'DOWNLOADING' : subtitle}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {workoutCount > 0 ? (
                  [...Array(workoutCount)].map((_, i) => (
                    <Checked
                      key={`${i}_checked`}
                      style={{ marginRight: 4 }}
                      color={i < completedCount ? programColor : globals.styles.colors.colorGrayDark}
                    />
                  ))
                ) : showCheckmarks ? (
                  <ActivityIndicator />
                ) : null}
                {!(!downloaded && !isOnline) && !downloading && id && (
                  <ChevronRight style={{ marginLeft: 4 }} color={globals.styles.colors.colorGrayDark} />
                )}
              </View>
            </View>
          </>
        </Pressable>
        <DatePickerModal
          todayLink={true}
          // minYear={new Date().getFullYear() - 1}
          // maxDate={moment().add(14, 'days').toDate()}
          date={moment().toDate()}
          title={'What day on the calendar do you want to add this check mark to?'}
          minDate={moment(startDate).toDate()}
          onDateChange={(date) => {
            addCheckmark(moment(date))
            setShowDatePicker(false)
          }}
          onClose={() => setShowDatePicker(false)}
          visible={showDatePicker}
        />
      </>
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
    height: globals.window.width * 0.422,
    borderTopLeftRadius: 7.7,
    borderTopRightRadius: 7.7,
  },
  titleContainer: {
    paddingVertical: 14,
    paddingLeft: 24,
    paddingRight: 22,
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
