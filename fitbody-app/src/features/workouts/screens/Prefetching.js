import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import { useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

// Services and State
import { updateUserProfileOnline } from '../../../data/user'
import { getWeek } from '../../../data/workout'
import { changeDate } from '../../../data/meal_plan'
import { getActivities, getMoods } from '../../../data/journal'
import { getNotifications } from '../../../data/notification'
import { activitiesSelector, moodsSelector } from '../../../data/journal/selectors'
import { isRestrictedSelector } from '../../../data/user/selectors'
import { fetchMedia } from '../../../data/media'

// Hooks
import { useInit } from '../../../services/hooks/useInit'

export const Prefetching = (WrappedComponent) =>
  function Comp(props) {
    const mealDate = useSelector((state) => state.data.meal.day)
    const mealDateSetOn = useSelector((state) => state.data.meal.setOn)
    const notification_token = useSelector((state) => state.data.user.notification_token)
    const notification_os = useSelector((state) => state.data.user.notification_os)
    const userId = useSelector((state) => state.data.user.id)
    const workout_goal = useSelector((state) => state.data.user.workout_goal)
    const program_meta = useSelector((state) => state.data.user.meta.programs)
    const resistance_bands = useSelector((state) => state.data.user.resistance_bands)
    const moods = useSelector(moodsSelector)
    const activities = useSelector(activitiesSelector)
    const isRestricted = useSelector(isRestrictedSelector)
    const week = useSelector((state) =>
      state.data.workouts.weeks && state.data.user.workout_goal
        ? state.data.workouts.weeks[
            `${state.data.user.workout_goal}_${state.data.user.resistance_bands}_${
              state.data.user.meta.programs[state.data.user.workout_goal.toLowerCase()]?.current_week
            }`
          ]
        : null,
    )

    const load = async () => {
      if (mealDate && (!mealDateSetOn || (mealDateSetOn && moment(mealDateSetOn).isBefore(moment(), 'day')))) {
        changeDate(moment().format('YYYY-MM-DD'))
      }

      const tkn = await AsyncStorage.getItem('notification_token')

      if (tkn !== null) {
        if (!notification_token || !notification_os || notification_token !== tkn || notification_os !== Platform.OS) {
          updateUserProfileOnline({
            id: userId,
            notification_token: tkn,
            notification_os: Platform.OS,
          })
        }
      }

      if (workout_goal && !isRestricted) {
        // Get the workouts for the week
        setTimeout(() => {
          if (week == null && workout_goal) {
            getWeek({
              week_id: program_meta[workout_goal.toLowerCase()]?.current_week ?? 1,
              program: workout_goal,
              resistance_bands: resistance_bands,
            })
          }

          getNotifications()
        }, 200)
      }
    }

    const loadJournalData = () => {
      if (isRestricted) {
        return
      }

      if (moods.length < 1) {
        getMoods()
      }

      if (activities.length < 1) {
        getActivities()
      }
    }

    useInit(load)

    const [reloadJournalData] = useInit(loadJournalData)
    useEffect(() => {
      reloadJournalData()
    }, [isRestricted, reloadJournalData])

    useInit(fetchMedia)

    return <WrappedComponent {...props} />
  }
