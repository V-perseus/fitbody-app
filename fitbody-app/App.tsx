import 'expo-dev-client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, I18nManager, Platform, StyleSheet, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import RNBootSplash from 'react-native-bootsplash'
import * as Sentry from '@sentry/react-native'
import { createClient, AnalyticsProvider, JsonMap } from '@segment/analytics-react-native'
import { DefaultTheme, NavigationContainer, NavigationState } from '@react-navigation/native'
import * as _ from 'lodash'
import Orientation from 'react-native-orientation-locker'
import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import { flatten } from 'flat'
import { setCustomText, setCustomTouchableOpacity } from 'react-native-global-props'
import { Notifications } from 'react-native-notifications'
import { clearTransactionIOS, flushFailedPurchasesCachedAsPendingAndroid, Purchase, useIAP, withIAPContext } from 'react-native-iap'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RNFS from 'react-native-fs'
import { unzip } from 'react-native-zip-archive'
import { requestTrackingPermission } from 'react-native-tracking-transparency'
import LinearGradient from 'react-native-linear-gradient'
import { enableFreeze } from 'react-native-screens'
import * as Updates from 'expo-updates'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { FB_CURRENT_ENV, FB_ENVIRONMENTS } from './env'

// Redux Store
import { store, persistor } from './src/store'
import { download } from './src/data/workout/workoutsSlice'
import { trainerDataExtracted } from './src/data/workout'
import { updateUser } from './src/data/user'

// Application Routes
import NavigationService from './src/services/NavigationService'
import { LoggedOutStack } from './src/config/routes/loggedOutStack'
import { MainStack as LoggedInStack } from './src/config/routes/loggedInStack'

// Components
import GlobalModalProvider from './src/components/GlobalModalProvider'
import LoadingIndicator from './src/components/LoadingIndicator'
import ErrorBoundary from './src/components/ErrorBoundary'

// Assets
import globals from './src/config/globals'
import Logo from './assets/images/logo/fit-body-logo.gif'

// Services
import { hideLoadingModal } from './src/services/loading'
import api from './src/services/api/index'
import { setErrorMessage } from './src/services/error/index'
import { validateAppleSubscription, validateGoogleSubscription } from './src/services/session'
import { useSegmentLogger } from './src/services/hooks/useSegmentLogger'
import { useAppSelector } from './src/store/hooks'

// For reanimated 2
// global.__reanimatedWorkletInit = () => {}

// useScreens()
// enableScreens()

// https://github.com/software-mansion/react-freeze#readme
enableFreeze()

Orientation.lockToPortrait()

// initialize Reactotron debugger. Not in test or dev environment
if (__DEV__ && !process.env.JEST_WORKER_ID) {
  // import('./reactotronConfig').then(() => {
  //   console.log('Reactotron Configured')
  // })
}

// don't run sentry for dev builds
// const routingInstrumentation = new Sentry.RoutingInstrumentation()
// const routingInstrumentation = new Sentry.ReactNavigationInstrumentation()

if (!__DEV__) {
  // Sentry.init({
  //   dsn: 'https://a93c910ff12449f693e951903530c889@o897191.ingest.sentry.io/5841448',
  //   integrations: [
  //     new Sentry.ReactNativeTracing({
  //       tracingOrigins: ['localhost', FB_ENVIRONMENTS.production],
  //       routingInstrumentation,
  //       beforeNavigate: (context) => {
  //         return {
  //           ...context,
  //           tags: {
  //             ...context.tags,
  //             routeName: context.name,
  //           },
  //         }
  //       },
  //     }),
  //   ],
  //   tracesSampleRate: 0.25, // percentage of transactions sent
  //   normalizeDepth: 6,
  //   beforeBreadcrumb(breadcrumb) {
  //     // https://github.com/getsentry/sentry-react-native/issues/2539
  //     // return breadcrumb.category === "ui.click" ? null : breadcrumb;
  //     if (typeof breadcrumb.data === 'function' || typeof breadcrumb.data !== 'object') {
  //       return {
  //         ...breadcrumb,
  //         data: {
  //           payload: breadcrumb.data,
  //         },
  //       }
  //     }
  //     return breadcrumb
  //   },
  //   beforeSend(event) {
  //     let state = store.getState()
  //     let user = _.get(state, 'data.user', false)
  //     let flatState: Record<string, any> = flatten(state)
  //     let key = ''
  //     // cleanup after flatten
  //     for (key in flatState) {
  //       if (
  //         flatState[key] === undefined ||
  //         flatState[key] === null ||
  //         Array.isArray(flatState[key]) ||
  //         key.startsWith('offline') ||
  //         key.startsWith('data.user.notification_meta.progress_weeks_sent')
  //       ) {
  //         delete flatState[key]
  //       }
  //     }
  //     if (user) {
  //       let extra: any = {}
  //       if (_.size(user) > 0) {
  //         if (user.goal) {
  //           extra.goal = user.goal
  //         }
  //         if (Number.isInteger(user.active_week_number)) {
  //           extra.active_week = extra.active_week_number
  //         }
  //         if (Number.isInteger(user.current_week_number)) {
  //           extra.current_week = extra.current_week_number
  //         }
  //       }
  //       event.user = {
  //         email: user.email,
  //         id: user.id ? user.id.toString() : null,
  //         username: user.email,
  //         extra: extra,
  //       }
  //     }
  //     event.tags = { ...event.tags, environment: FB_CURRENT_ENV, devMode: __DEV__ }
  //     event.extra = flatState
  //     return event // if return false, event will not be sent
  //   },
  // })
}

export const translate = _.memoize(
  (key: string) => i18n.t(key, { defaultLocale: 'en' }),
  // @ts-ignore
  (key, config) => (config ? key + JSON.stringify(config) : key),
)

type GetterLangs = Record<string, any>
const translationGetters: GetterLangs = {
  en: () => require('./assets/translations/en.json'),
  // it: () => require("./assets/translations/it.json"),
}

const setI18nConfig = () => {
  // fallback if no available language fits
  const fallback = { languageTag: 'en', isRTL: false }

  const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback
  // clear translation cache
  // translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL)

  // set i18n-js config
  i18n.defaultLocale = 'en-US'
  i18n.translations = { [languageTag]: translationGetters[languageTag]() }
  i18n.fallbacks = true
  i18n.locale = languageTag
}

export const segmentClient = createClient({
  writeKey: 'gRZS1i9BbU6xZpr0v7OzDRO5VVQYO4AD',
  // @ts-ignore
  recordScreenViews: false,
  trackAppLifecycleEvents: true,
  trackAttributionData: true,
  debug: false, // enable/disable console logs
  android: {
    flushInterval: 60,
    collectDeviceId: true,
  },
  ios: {
    trackAdvertising: true,
    trackDeepLinks: true,
  },
})

const App = () => {
  const [showSplash, setShowSplash] = useState(true)
  // For forcing update after language is changed on a users device
  const [, updateState] = useState<{}>()
  const forceUpdate = useCallback(() => updateState({}), [])

  const handleLocalizationChange = () => {
    setI18nConfig()
    forceUpdate()
  }

  useEffect(() => {
    hideLoadingModal()

    setCustomText({ ...globals.styles.fonts.primary, allowFontScaling: false })
    setCustomTouchableOpacity(globals.touchableOpacity)
    setI18nConfig() // set initial config

    checkForUpdates()

    RNLocalize.addEventListener('change', handleLocalizationChange)

    Notifications.registerRemoteNotifications()

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log(`Notification received in foreground: ${JSON.stringify(notification)}`)
      completion({ alert: false, sound: false, badge: false })
    })

    Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
      console.log('Notification Received - Background', notification.payload)

      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      // @ts-ignore -- TODO check that this type is accurate
      completion({ alert: true, sound: true, badge: false })
    })

    Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log('Notification opened:', notification)
      completion()
    })

    Notifications.events().registerRemoteNotificationsRegistered(async (event) => {
      // TODO: Send the token to my server so it could send back push notifications...
      console.log('Device Token Received', event.deviceToken)
      await AsyncStorage.setItem('notification_token', event.deviceToken)
    })

    Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
      console.error('Device token registration failed', event)
    })

    if (Platform.OS === 'ios') {
      Notifications.ios.checkPermissions().then((currentPermissions) => {
        console.log('Badges enabled: ' + !!currentPermissions.badge)
        console.log('Sounds enabled: ' + !!currentPermissions.sound)
        console.log('Alerts enabled: ' + !!currentPermissions.alert)
      })
    }

    Notifications.getInitialNotification()
      .then((notification) => {
        console.log('Initial notification was:', notification ? JSON.stringify(notification) : 'N/A')
      })
      .catch((err) => console.error('getInitialNotifiation() failed', err))

    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange)
    }
  }, [])

  const checkForUpdates = async () => {
    setTimeout(async () => {
      try {
        // if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync()
        if (update.isAvailable) {
          // TODO show user some kind of feedback
          // setUpdateAvailable(true)
          // console.log('update available, fetching...')
          await Updates.fetchUpdateAsync()
          Updates.reloadAsync()
        }
        // }
      } catch (error) {
        console.log('update check failed', error)
        // Alert.alert(JSON.stringify(error))
      }
    }, 3000)
  }

  function handleOnLoadEnd() {
    RNBootSplash.hide()
    setTimeout(async () => {
      setShowSplash(false)
    }, 4500)
    if (Platform.OS === 'ios') {
      setTimeout(async () => {
        const s = await requestTrackingPermission()
        console.log('tracking permission', s)
      }, 5500)
    }
  }

  return (
    <AnalyticsProvider client={segmentClient}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <ActionSheetProvider>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <DownloadTaskWatcher>
                  <SubscriptionWatcher>
                    {showSplash ? (
                      <LinearGradient
                        style={{ ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' }}
                        colors={[globals.styles.colors.colorPink, globals.styles.colors.colorTopaz]}>
                        <Image testID="splash_gif" source={Logo} style={{ width: 375, height: 286 }} onLoadEnd={handleOnLoadEnd} />
                      </LinearGradient>
                    ) : (
                      <GestureHandlerRootView style={{ flex: 1 }}>
                        <MainStack />
                      </GestureHandlerRootView>
                    )}
                  </SubscriptionWatcher>
                </DownloadTaskWatcher>
              </PersistGate>
            </Provider>
          </ActionSheetProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </AnalyticsProvider>
  )
}

// export default withIAPContext(Sentry.wrap(App))
export default withIAPContext(App)

const DownloadTaskWatcher = ({ children }: { children: JSX.Element }) => {
  const downloads = useAppSelector((state) => state.data.workouts.downloads) ?? {}
  const trainersExtracted = useAppSelector((state) => state.data.workouts.trainersExtracted) ?? false

  useEffect(() => {
    const recoverTasks = async () => {
      if (!trainersExtracted /* || true*/) {
        console.log('extracting trainer and program data')
        if (Platform.OS === 'ios') {
          console.log('unzipping trainer and programs data', Date.now())
          await unzip(RNFS.MainBundlePath + '/trainers.zip', RNFS.DocumentDirectoryPath)
          trainerDataExtracted()
          console.log('continuing', Date.now())
        } else if (Platform.OS === 'android') {
          console.log('unzipping trainer and programs data', Date.now())
          const files = await RNFS.readDirAssets('.')
          console.log(files)
          await RNFS.copyFileAssets('trainers.zip', RNFS.DocumentDirectoryPath + '/trainers.zip')
          await unzip(RNFS.DocumentDirectoryPath + '/trainers.zip', RNFS.DocumentDirectoryPath)
          trainerDataExtracted()
          console.log('continuing', Date.now())
        }
      } else {
        console.log('skipping extract')
      }

      console.log('---checking for tasks')

      // console.log('downloads', downloads)

      // let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads()

      // console.log('lostTasks', lostTasks)

      // for (let task of lostTasks) {
      //   console.log(`Task ${task.id} was found!`)
      //   task
      //     .progress((percent) => {
      //       console.log(`Downloaded: ${percent * 100}%`)
      //     })
      //     .done(async () => {
      //       await unzip(`${RNFS.DocumentDirectoryPath}/${task.id}.zip`, RNFS.DocumentDirectoryPath)
      //       store.dispatch(workoutsSlice.actions.downloadComplete(task.id))

      //       console.log('Downlaod is done!')
      //     })
      //     .error((error) => {
      //       console.log('Download canceled due to error: ', error)
      //     }).resume()
      // }

      // const lostTaskIds = lostTasks.map(t => t.id)

      for (let dl of Object.keys(downloads)) {
        const d = downloads[dl]
        console.log('looking at ', d)
        // if (!lostTaskIds.includes(d.downloadId)) {
        // Restart download
        console.log('---restarting download', d.downloadId)
        download(d.links, d.payloadToSave, d.type, false, d.downloadId)
        // }
      }
    }

    recoverTasks()
  }, [])

  return children
}

const SubscriptionWatcher = ({ children }: { children: JSX.Element }) => {
  // RNAdvertisingId.getAdvertisingId()
  //   .then((response) => {
  //     console.log('Advertising id always null?', response)
  //     try {
  //       api
  //         .users
  //         .reportEvent({ name: 'Application Opened', meta: response })
  //         .catch(() => {})
  //     } catch {}
  //   })
  //   .catch((error) => console.error(error))

  const { finishTransaction, currentPurchase, currentPurchaseError } = useIAP()
  const { logEvent } = useSegmentLogger()

  /**
   * Verify a purchase with the Fit Body servers
   */
  const verifyApple = async (purchase: Purchase) => {
    try {
      const res = await validateAppleSubscription(purchase.transactionReceipt)
      handleNewSubscription(res)
    } catch (error) {
      console.log('VERIFY APPLE ERROR:', error)
      hideLoadingModal()
    }
  }

  /**
   * Verify a purchase with the Fit Body servers
   */
  const verifyGoogle = async (purchase: Purchase) => {
    try {
      const res = await validateGoogleSubscription({
        token: purchase.purchaseToken!,
        subscription: purchase.productId,
      })
      handleNewSubscription(res)
    } catch (error) {
      console.log('VERIFY GOOGLE ERROR', error)
      hideLoadingModal()
    }
  }

  const handleNewSubscription = async (data: { is_active: boolean }) => {
    if (data.is_active) {
      try {
        const res = await api.users.getCurrentUserObject()
        updateUser(res.user)

        if (currentPurchase) {
          finishTransaction({ purchase: currentPurchase, isConsumable: false })
        }
        hideLoadingModal()

        const plan = res.user.plans.find((p) => p.is_active)

        const payload = {
          plan_name: plan?.subscription_title,
          start_date: plan?.created_at,
        }
        logEvent(res.user, 'Subscription Started', payload)
        NavigationService.canGoBack()
      } catch (error) {
        hideLoadingModal()
      }
    } else {
      hideLoadingModal()
    }
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      flushFailedPurchasesCachedAsPendingAndroid().catch(() => {
        // exception can happen here if:
        // - there are pending purchases that are still pending (we can't consume a pending purchase)
        // in any case, you might not want to do anything special with the error
      })
    }
    if (currentPurchase) {
      // console.log('Handling current purchase for', currentPurchase.productId)
      const receipt = currentPurchase.transactionReceipt
      if (receipt) {
        if (Platform.OS === 'ios') {
          if (__DEV__) {
            clearTransactionIOS()
          }
          verifyApple(currentPurchase)
        } else {
          verifyGoogle(currentPurchase)
        }
      }
    }
  }, [currentPurchase])

  useEffect(() => {
    if (currentPurchaseError) {
      hideLoadingModal()
      // This should NOT be a triple equal, typing is wrong for responseCode
      // its a string but type says number
      if (Platform.OS === 'ios' && currentPurchaseError?.responseCode == 2) {
        setErrorMessage({ error: 'Purchase has been cancelled.' })
      } else {
        setErrorMessage({ error: currentPurchaseError.message })
      }
      console.warn('purchaseErrorListener', currentPurchaseError)
    }
  }, [currentPurchaseError])

  return children
}

const MainStack = () => {
  const routeNameRef = React.useRef<string>()
  // const routingNavigationRef = React.useRef()

  const apiToken = useAppSelector((state) => state.services.session.apiToken)
  const isAuthenticated = useMemo(() => apiToken !== null, [apiToken])

  // gets the current screen from navigation state
  // const getActiveRoute = (navigationState) => {
  //   if (!navigationState) {
  //     return null
  //   }
  //   const route = navigationState.routes[navigationState.index]
  //   // dive into nested navigators
  //   if (route?.routes) {
  //     return getActiveRoute(route)
  //   }
  //   return route
  // }

  function trackScreenTransition(state: NavigationState | undefined) {
    hideLoadingModal()
    // console.log(prevState, currentState)
    // console.log('NAV STATE', state)

    // const currentScreen = getActiveRoute(currentState)
    // const prevScreen = getActiveRoute(prevState)
    // console.log("CURRENT SCREEN", currentScreen)

    // if (prevScreen !== currentScreen) {
    //   // the line below uses the Google Analytics tracker
    //   // change the tracker here to use other Mobile analytics SDK.

    //   const screenName = currentScreen.routeName
    //   const params = JSON.parse(JSON.stringify(currentScreen.params || {}))

    //   analytics.screen(screenName, params == {} ? null : params)
    // }

    const previousRouteName = routeNameRef.current
    const currentRouteName = NavigationService.navigator.current?.getCurrentRoute()?.name
    const currentParams = (NavigationService.navigator.current?.getCurrentRoute()?.params as JsonMap) || undefined

    if (previousRouteName !== currentRouteName) {
      // The line below uses the expo-firebase-analytics tracker
      // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
      // Change this line to use another Mobile analytics SDK
      segmentClient.screen(currentRouteName!, currentParams)

      // sentry screen transition performance monitoring
      // routingInstrumentation.onRouteWillChange({
      //   name: currentRouteName,
      //   description: `From ${previousRouteName} -> ${currentRouteName}`,
      //   op: 'navigation',
      // })
    }

    // Save the current route name for later comparision
    routeNameRef.current = currentRouteName
  }
  // Overrides the default screen background so that modals can be transparent
  // If a color is required, it needs to be explicitly set on the screen/navigator
  const AppTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  }

  function onReady() {
    // set global navigation ref
    // this is used in certain places where traditional navigation is otherwise unavailable
    routeNameRef.current = NavigationService?.navigator?.current?.getCurrentRoute()?.name
    // routingInstrumentation.registerNavigationContainer(NavigationService.navigator)
  }

  return (
    <NavigationContainer
      onStateChange={trackScreenTransition}
      ref={NavigationService.setTopLevelNavigator}
      theme={AppTheme}
      onReady={onReady}>
      <View style={{ flex: 1 }}>
        {isAuthenticated ? <LoggedInStack /> : <LoggedOutStack />}
        <GlobalModalProvider />
        <LoadingIndicator />
      </View>
    </NavigationContainer>
  )
}
