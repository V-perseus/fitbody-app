import moment from 'moment'
import { Platform } from 'react-native'
import RNFS from 'react-native-fs'
import * as Sentry from '@sentry/react-native'
import { SpanStatus } from '@sentry/tracing'

import { get } from '../../data/user/selectors'
import { setErrorMessage } from '../error'

export const resolveLocalUrl = (path, forVideo = false) => {
  // console.log('trying to resolve', path)
  return path?.startsWith('http') ? path : `${Platform.OS === 'android' || forVideo ? 'file://' : ''}${RNFS.DocumentDirectoryPath}${path}`
}

/**
 * canAdvanceWeek
 *
 * Check if a user can move forward a week
 */
export const canAdvanceWeek = () => {
  const user = get()
  const { active_week, current_week } = user.meta.programs[user.workout_goal.toLowerCase()]

  if (current_week + 1 > active_week) {
    setErrorMessage({
      error:
        active_week == 60
          ? `Hey babe! You finished all 5 rounds of ${user.workout_goal}! Start back at Week 1 on a higher level or choose another Fit Body program!`
          : `Hey babe! Keep going! You’ll unlock week ${current_week + 1} once you’ve completed week ${current_week}`,
    })
    return false
  } else {
    return true
  }
}

/**
 * canAdvanceWeek
 *
 * Check if a user can move forward a week
 */
export const canAdvanceWeekCustom = (lastDay) => {
  const today = moment().format('YYYY-MM-DD')
  if (lastDay >= today) {
    setErrorMessage({
      error: 'Hey babe! Keep going! You’ll unlock next once you’ve completed this week',
    })
    return false
  } else {
    return true
  }
}

/**
 * canRetreatWeek
 *
 * Check if a user can move backwards a week
 */
export const canRetreatWeek = () => {
  const user = get()
  const { current_week } = user.meta.programs[user.workout_goal.toLowerCase()]

  if (current_week - 1 < 1) {
    setErrorMessage({ error: "You're already on week 1!" })
    return false
  } else {
    return true
  }
}

export const sortMoodByOrder = (a, b) => (a.order > b.order ? 1 : -1)

/**
 * transactionHub
 *
 * used for sentry transaction tracking
 * without promises
 */
export const transactionHub = {
  transactions: [],
  startTransaction(transactionContext) {
    const transaction = Sentry.startTransaction(transactionContext)

    this.transactions.push(transaction)

    return transaction
  },
  finishTransaction(op) {
    // Find all the transactions with this op.
    const selectedTransactions = this.transactions.filter((t) => t.op === op)

    // Finish each of the transactions with this op.
    selectedTransactions.forEach((t) => t.finish())

    // Remove these finished transactions from the transaction hub
    this.transactions = this.transactions.filter((t) => t.op !== op)

    return selectedTransactions
  },
}

/**
 * withTransaction
 *
 * like transactionHub but accepts a promise
 * used to wrap a promise and track transaction response time
 *
 * context = {
 *    name: <String identifier for Sentry console>
 * }
 */
export const withTransaction = (promise, context) => {
  // const transaction = Sentry.startTransaction(context)

  return promise
    .catch((e) => {
      // transaction.setStatus(SpanStatus.UnknownError)

      throw e
    })
    .finally(() => {
      // transaction.finish()
    })
}
