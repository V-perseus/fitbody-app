import { createSelector } from '@reduxjs/toolkit'
import moment from 'moment'

import { RootState } from '../../store'
import { storeRegistry } from '../../store/storeRegistry'
import { IQuiz } from './types'

export const get = () => storeRegistry.getState().data.user

export const userSelector = (state: RootState) => state.data.user

export const userQuizSelector = (state: RootState): IQuiz | null => state.data.user?.quiz || null

export const userQuizCompleteSelector = createSelector(
  (state: RootState) => state.data.user.quiz,
  (quizData) => (quizData && quizData.level && quizData.goal && quizData.location ? true : false),
)

export const isRestrictedSelector = (state: RootState) => state.data.user.is_restricted

export const trialDaysRemainingSelector = createSelector(
  (state: RootState) => state.data.user.trial_expires_on,
  (trialExpiresOn) => {
    if (!trialExpiresOn) {
      return null
    }
    const daysRemaining = moment(trialExpiresOn).diff(moment.utc(), 'days')
    return daysRemaining >= 0 ? daysRemaining : null
  },
)

export const userProgramLevelSelector = createSelector(
  (state: RootState) => state.data.user,
  (state: RootState) => state.data.workouts.trainers,
  (state: RootState) => state.data.workouts.currentProgram,
  (user, trainers, currentProgram) => {
    const trainerForCurrentProgram = trainers.find((t) => t.programs.find((pId) => pId === currentProgram?.id))
    if (!trainerForCurrentProgram) {
      return null
    }
    return user.meta?.trainers[trainerForCurrentProgram.id]?.level_id
  },
)
