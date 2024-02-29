import { AnyAction, Middleware } from '@reduxjs/toolkit'
import * as _ from 'lodash'
import moment from 'moment'

import { segmentClient } from '../../App'

import { GET_QUIZ_QUESTIONS } from '../data/workout/types'

const analyticsMiddleware: Middleware = (store) => (next) => (action: AnyAction) => {
  let state = {}

  let programList, goal, currentProgram, workout

  switch (action.type) {
    case 'users/update':
      if (!action.payload) {
        break
      }
      if (action.payload.workout_goal !== store.getState().data.user.workout_goal) {
        segmentClient.track('Goal Selected', {
          email_address: action.payload.email,
          action: action.payload.action,
        })
      } else if (action.payload.action === 'MacroCalculatorUpdated') {
        segmentClient.track('Macro Calculator Updated', {
          email_address: action.payload.email,
          action: action.payload.action,
        })
      }

      break
    case 'persist/REHYDRATE':
      // on rehdyrate event, check to see if user data is present
      let user = _.get(action, 'payload.data.user', false)
      if (!user) {
        break
      }
      if (user.id && user.email) {
        segmentClient.identify(user.id, user)
        segmentClient.track('SignOn', {
          email_address: user.email,
          signon_method: 'email',
        })
      }
      break
    case 'workouts/workoutStarted':
      workout = action.payload
      state = store.getState()
      programList = _.get(state, 'data.user.meta.programs', false)
      goal = _.get(state, 'data.user.workout_goal', false)

      if (goal && goal.toLowerCase) {
        goal = goal.toLowerCase()
      }
      if (!action.payload || !programList || !goal) {
        break
      }
      currentProgram = programList[goal]
      if (workout.is_challenge) {
        segmentClient.track('Monthly Challenge Started', {
          challenge_month: moment().format('M'),
          user_fitness_level: workout.level,
          user_program_week: currentProgram.current_week + '',
          user_program_round: Math.ceil(currentProgram.current_week / 12) + '',
          user_program: goal,
          challenge_id: workout.id + '',
          challenge_name: workout.challenge_name,
        })
      } else {
        segmentClient.track('Workout Started', {
          workout_day_id: _.get(state, 'data.workouts.currentWorkout.id', ''),
          resistance_bands: _.get(state, 'data.user.resistance_bands', '') + '',
          user_program_week: currentProgram.current_week + '',
          user_program_round: Math.ceil(currentProgram.current_week / 12) + '',
          user_program: goal,
          workout_id: workout.id + '',
          muscle_group: workout.title,
          user_fitness_level: workout.level,
        })
      }
      break
    case 'workouts/submitCompletion':
      workout = action.payload
      state = store.getState()
      programList = _.get(state, 'data.user.meta.programs', false)
      goal = _.get(state, 'data.user.workout_goal', false)
      if (goal && goal.toLowerCase) {
        goal = goal.toLowerCase()
      }
      if (!action.payload || !programList || !goal) {
        break
      }
      currentProgram = programList[goal]
      segmentClient.track('Workout Completed', {
        workout_day_id: _.get(state, 'data.workouts.currentWorkout.id', ''),
        user_fitness_level: workout.level_title,
        muscle_group: workout.workout_category,
        user_program_week: workout.week_number,
        user_program_round: Math.ceil(workout.week_number / 12) + '',
        user_program: goal,
        resistance_bands: _.get(state, 'data.user.resistance_bands', '') + '',
        workout_id: workout.workout_id + '',
      })
      break
    case `${GET_QUIZ_QUESTIONS}/fulfilled`:
      segmentClient.track('Quiz Started')
      break
    default:
      break
  }
  next(action)
}

export default analyticsMiddleware
