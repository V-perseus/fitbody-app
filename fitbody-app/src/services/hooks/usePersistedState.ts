import { persistScreenState } from '../../data/meal_plan'
import { useAppSelector } from '../../store/hooks'

export const usePersistedState = (screenName: string, key: string, initialState: any) => {
  const val = useAppSelector((state) =>
    state.data.meal.persistedScreenState?.[screenName]?.[key] !== null &&
    state.data.meal.persistedScreenState?.[screenName]?.[key] !== undefined
      ? state.data.meal.persistedScreenState?.[screenName]?.[key]
      : initialState,
  )

  const updateState = (newValue: any) => {
    persistScreenState({ screenName, state: { [key]: newValue } })
  }

  return [val, updateState]
}
