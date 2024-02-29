import React, { useMemo, useState, memo, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import moment from 'moment'

// Assets
import CircleChevronLeft from '../../../../../assets/images/svg/icon/24px/circle/cheveron-left.svg'
import CircleChevronRight from '../../../../../assets/images/svg/icon/24px/circle/cheveron-right.svg'
import ChevronDown from '../../../../../assets/images/svg/icon/16px/cheveron/down.svg'

// Components
import SinglePickerModal from '../../../../components/SinglePickerModal'
import { ButtonOpacity } from '../../../../components/Buttons/ButtonOpacity'

// Services
import { setErrorMessage } from '../../../../services/error'
import globals from '../../../../config/globals'

// Types
import { IProgram, ProgramTypes } from '../../../../data/workout/types'

// Hooks
import { useAppSelector } from '../../../../store/hooks'

interface IWeekHeaderProps {
  showAllWeeks: boolean
  showRounds: boolean
  round: number
  week: number
  onPressPrevious: () => void
  onPressNext: () => void
  onPickWeek: (wk: number) => void
  currentProgram: IProgram
  additionalContent?: {
    title?: string
    body?: string
  }
  onClose: () => void
}
export const Week_Header: React.FC<IWeekHeaderProps> = memo(
  ({ showAllWeeks, showRounds, round, week, onPressPrevious, onPressNext, onPickWeek, currentProgram, additionalContent, onClose }) => {
    const user = useAppSelector((state) => state.data.user)
    const [showWeekPicker, setShowWeekPicker] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(week - 1)

    useEffect(() => {
      setSelectedIndex(week - 1)
    }, [week])

    useEffect(() => {
      if (additionalContent) {
        setShowWeekPicker(true)
      }
    }, [additionalContent])

    const activeWeek: number = user.meta?.programs[currentProgram?.slug?.toLowerCase()]?.active_week ?? 1

    const maxWeek = useMemo(
      () =>
        showAllWeeks
          ? currentProgram?.total_workout_weeks ?? 1
          : Math.min(
              Math.max(
                Math.floor(moment.duration(moment().diff(moment(user.week_count_updated_at).isoWeekday(0))).asWeeks()) + activeWeek,
                2,
              ),
              currentProgram?.total_workout_weeks ?? 1,
            ),
      [showAllWeeks, currentProgram?.total_workout_weeks, user.week_count_updated_at, activeWeek],
    )

    const weekNrs = [...Array(maxWeek)].map((_, i) => {
      if (currentProgram?.week_meta?.[i]?.label) {
        return `${currentProgram.week_meta[i].label}: Week ${i + 1}`
      } else {
        return `Week ${i + 1}`
      }
    })

    function handlePrevious() {
      week > 1
        ? onPressPrevious()
        : setErrorMessage({
            error: "You're already on week 1!",
          })
    }

    function showCongratsMessage() {
      if (currentProgram.slug === ProgramTypes['GROW + GLOW']) {
        setErrorMessage({
          error: `You finished all ${currentProgram.total_workout_weeks} weeks of ${
            user.workout_goal
          } - congratulations! You can repeat weeks ${currentProgram.total_workout_weeks - 1} - ${
            currentProgram.total_workout_weeks
          } until the big day arrives!`,
          duration: 6000,
        })
      } else {
        setErrorMessage({
          error: `You finished all ${currentProgram.total_workout_weeks} weeks of ${user.workout_goal}! Start back at Week 1 on a higher level or choose another Fit Body program!`,
          duration: 6000,
        })
      }
    }

    function showComingSoonMessage() {
      setErrorMessage({
        error:
          "We release workouts one week at a time to guide you through the program. If you've completed this week and are looking for more, head to the On Demand section!",
        duration: 6000,
      })
    }

    function handleNext() {
      if (maxWeek > week) {
        onPressNext()
      } else if (week >= currentProgram.total_workout_weeks) {
        showCongratsMessage()
      } else {
        showComingSoonMessage()
      }
    }

    return (
      <>
        <View style={styles.container}>
          <ButtonOpacity onPress={handlePrevious}>
            <CircleChevronLeft
              width={24}
              height={24}
              color={week > 1 ? globals.styles.colors.colorBlackDark : globals.styles.colors.colorGrayDark}
            />
          </ButtonOpacity>
          <Pressable onPress={() => setShowWeekPicker(true)} style={styles.rowCenter}>
            <View style={styles.itemsCenter}>
              {showRounds && <Text style={styles.roundLabel}>Round {round}</Text>}
              {!showRounds && currentProgram?.week_meta?.length > 0 && (
                <Text style={[styles.roundLabel, { paddingHorizontal: 4 }]}>
                  {currentProgram.week_meta.find((meta) => meta.week_id === week).label}
                </Text>
              )}
              <Text style={[styles.weekLabel, !showRounds && !currentProgram.week_meta ? { marginTop: 0 } : null]}>WEEK {week}</Text>
            </View>
            <ChevronDown style={styles.chevDown} color={globals.styles.colors.colorBlackDark} />
          </Pressable>
          <ButtonOpacity onPress={handleNext}>
            <CircleChevronRight
              width={24}
              height={24}
              color={maxWeek > week ? globals.styles.colors.colorBlackDark : globals.styles.colors.colorGrayDark}
            />
          </ButtonOpacity>
        </View>
        <SinglePickerModal
          titleStyle={{ fontSize: additionalContent ? 20 : 30 }}
          title={
            showRounds
              ? `ROUND ${Math.max(Math.ceil((selectedIndex + 1) / 12), 1)}`
              : additionalContent?.title
              ? additionalContent.title
              : ' '
          }
          body={additionalContent?.body}
          items={weekNrs}
          selectedIndex={selectedIndex}
          onDateChange={(v) => {
            setShowWeekPicker(false)
            onPickWeek(v)
          }}
          onSelectedIndexChanged={setSelectedIndex}
          onClose={() => {
            onClose?.()
            setShowWeekPicker(false)
          }}
          visible={showWeekPicker}
        />
      </>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    height: 65,
    borderBottomColor: globals.styles.colors.colorGray,
    borderBottomWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundLabel: {
    textAlign: 'right',
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
  },
  weekLabel: {
    textAlign: 'right',
    // marginTop: -6,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 20,
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  chevDown: { marginLeft: 5 },
  itemsCenter: { alignItems: 'center' },
})
