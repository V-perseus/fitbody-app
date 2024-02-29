import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../../store'
import { IVideoCategory } from './types'

export const onDemandCategoriesObjectSelector = createSelector(
  (state: RootState) => state.data.media.categories['On Demand'],
  (onDemandArray) => {
    return onDemandArray.reduce((prev, next) => {
      if (next.id) {
        prev[next.id] = next
      }
      return prev
    }, {} as Record<number, IVideoCategory>)
  },
)
