import { combineReducers } from 'redux'
import { AnyAction, configureStore, StoreEnhancer } from '@reduxjs/toolkit'
import { persistStore, persistReducer, createMigrate, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import * as Sentry from '@sentry/react-native'
import createSentryMiddleware from 'redux-sentry-middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MigrationManifest } from 'redux-persist/es/types'

import { createOffline } from '@redux-offline/redux-offline'
import offlineConfig from '@redux-offline/redux-offline/lib/defaults'

// Middlewares
import initSubscriber from 'redux-subscriber'
import reactotron from '../../reactotronConfig'
// segment.io
import analyticsMiddleware from './analyticsMiddleware'

// Reducers
import { dataReducer } from '../data/reducer'
import { servicesReducer } from '../services/reducer'

import {
  addDisclaimerAccepts,
  forceCategoriesRefresh,
  forceWorkoutsRefresh,
  resetTrainerExtraction,
  wipeMealPlans,
  setInitialWorkoutsState,
  forceChallengeAndCategoriesRefresh,
  clearUserEvents,
  addMealIngredientsOnly,
  resetUserQuiz,
} from './migrations'
import effect from './effect'
import { storeRegistry } from './storeRegistry'

// Combined Main Reducer
export const appReducer = combineReducers({
  data: dataReducer,
  services: servicesReducer,
})

const {
  middleware: offlineMiddleware,
  enhanceReducer: offlineEnhanceReducer,
  enhanceStore: offlineEnhanceStore,
} = createOffline({
  ...offlineConfig,
  effect,
  // discard: (error, action, retries) => error.permanent || retries > 10,
  // Ignore warning from persist key, types are outdated
  persist: false,
})

// report redux actions as breadcrumbs to Sentry
const sentryLogger = createSentryMiddleware(Sentry, {
  breadcrumbDataFromAction: (action: AnyAction) => {
    if (action?.payload) {
      return action.payload
    }
    return
  },
})

// const middlewares = composeWithDevTools(offlineEnhanceStore, applyMiddleware(thunk, sentryLogger, analyticsMiddleware, offlineMiddleware))

const migrations: MigrationManifest = {
  1: (state) => state,
  2: (state) => state,
  3: (state) => wipeMealPlans(state),
  4: (state: any) => ({ ...state, data: { ...state?.data, workouts: {} } }),
  5: (state) => setInitialWorkoutsState(state),
  6: (state) => resetTrainerExtraction(state),
  7: (state) => resetTrainerExtraction(state),
  8: (state) => resetTrainerExtraction(state),
  9: (state) => addDisclaimerAccepts(state),
  10: (state) => resetTrainerExtraction(state),
  11: (state) => forceWorkoutsRefresh(state),
  12: (state) => forceCategoriesRefresh(state),
  13: (state) => forceChallengeAndCategoriesRefresh(state),
  14: (state) => clearUserEvents(state),
  15: (state) => addMealIngredientsOnly(state),
  16: (state) => resetUserQuiz(state),
}

// Persist config
const persistConfig = {
  key: 'root',
  timeout: 0,
  storage: AsyncStorage,
  version: 16,
  migrate: createMigrate(migrations, { debug: false }),
}

// Persisted reducer TODO look in to inferring proper type
// https://github.com/reduxjs/redux-toolkit/issues/1831
type APPSTATE = {
  data: ReturnType<typeof dataReducer>
  services: ReturnType<typeof servicesReducer>
  offline: { online: boolean }
}
const persistedReducer = persistReducer<APPSTATE, any>(persistConfig, offlineEnhanceReducer(appReducer))

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
  // actionTransformer: (action) => {
  //   return null
  // },
})

// Use reactotron redux enhancer only in dev
const combineEnhancers = (defaultEnhancers: readonly StoreEnhancer[]): StoreEnhancer[] => {
  const enhancers = [offlineEnhanceStore, sentryReduxEnhancer] as StoreEnhancer[]
  // checking for reactotron.createEnhancer() which does not exist when running tests
  // if (__DEV__ && reactotron?.createEnhancer?.()) {
  //   enhancers.push(reactotron.createEnhancer() as StoreEnhancer)
  // }
  enhancers.push(...defaultEnhancers)
  return enhancers
}

const IGNORED_ACTIONS = [
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  // these following actions are ignored because they can contain formData, which is not a serializable type
  'progress_photos/sendProgressPhotos',
  'Offline/BUSY',
  'Offline/COMPLETE_RETRY',
  'Offline/SCHEDULE_RETRY',
  'loading/CLEAR',
  'SAVE_PROGRESS_PHOTOS_ROLLBACK',
]

const middlewares = [sentryLogger, analyticsMiddleware, offlineMiddleware]
if (__DEV__) {
  const createDebugger = require('redux-flipper').default
  middlewares.push(createDebugger({ actionsBlacklist: IGNORED_ACTIONS }))
}

// Our main store
// export const store = createStore(persistedReducer, middlewares)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: IGNORED_ACTIONS,
      },
    }).concat(middlewares),
  enhancers: (defaultEnhancers) => combineEnhancers(defaultEnhancers),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// export type RootState = { [key in keyof typeof reducers]: ReturnType<typeof reducers[key]> }
export type PersistState = ReturnType<typeof persistor.getState>
export type AppDispatch = typeof store.dispatch

// makes store available while avoiding require cycles with store.getState()
storeRegistry.init(store)

export default store

// Our main persistor
export const persistor = persistStore(store)

// Set up our watcher for authentication
initSubscriber(store)
