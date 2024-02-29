import { AsyncThunkAction, unwrapResult, ThunkDispatch, Action } from '@reduxjs/toolkit'
import { useCallback } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './'

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, Action>

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types
export const useAppThunkDispatch = () => useDispatch<AppThunkDispatch>() // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useUnwrapAsyncThunk = () => {
  const dispatch = useAppThunkDispatch()
  return useCallback(
    <R extends any>(asyncThunk: AsyncThunkAction<R, any, any>): Promise<R> => dispatch(asyncThunk).then(unwrapResult),
    [dispatch],
  )
}
