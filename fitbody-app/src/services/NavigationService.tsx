import React from 'react'
import { CommonActions, NavigationContainerRef, Route } from '@react-navigation/native'

type NavigatorRefType = NavigationContainerRef<ReactNavigation.RootParamList>

let _navigator = React.createRef<NavigatorRefType>()

let _initialScreen

function setTopLevelNavigator(navigatorRef: NavigatorRefType, initialScreen = null) {
  // @ts-ignore
  _navigator.current = navigatorRef
  _initialScreen = initialScreen
}

function sendToPaywall(params?: { from: string; params?: any }) {
  if (_navigator.current) {
    _navigator.current.dispatch(CommonActions.navigate({ name: 'Subscription', params: { from: params?.from, params } }))
  }
}

function navigate(routeName: string, params: Record<string, any>) {
  if (_navigator.current) {
    _navigator.current.dispatch(
      CommonActions.navigate({
        key: routeName,
        name: routeName,
        params,
      }),
    )
  }
}

function reset(routes: Omit<Route<string>, 'key'>[], index = 0) {
  if (_navigator.current) {
    _navigator.current.dispatch(
      CommonActions.reset({
        index: index,
        routes: routes,
      }),
    )
  }
}

function goBack() {
  if (_navigator.current) {
    _navigator.current.dispatch(CommonActions.goBack())
  }
}

function canGoBack() {
  if (_navigator.current) {
    if (_navigator.current.canGoBack()) {
      _navigator.current.dispatch(CommonActions.goBack())
    }
  }
}

export default {
  navigator: _navigator,
  sendToPaywall,
  initialScreen: _initialScreen,
  setTopLevelNavigator,
  navigate,
  goBack,
  canGoBack,
  reset,
}
