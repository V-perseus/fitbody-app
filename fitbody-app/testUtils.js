import React from 'react'
import { render as rtlRender } from '@testing-library/react-native'
import { configureStore } from '@reduxjs/toolkit'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from 'react-redux'

// Import your own reducer
import { appReducer } from './src/store'
import { ModalStackScreens } from './src/config/routes/loggedInStack'

// custom render method override
function render(ui, { preloadedState, store = configureStore({ reducer: appReducer, preloadedState }), ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react-native'
// override render method
export { render }

// custom navigation mock
const Stack = createStackNavigator()
export const MockedNavigator = ({
  component,
  params = {},
  preloadedState,
  store = configureStore({ reducer: appReducer, preloadedState }),
}) => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="MockedScreen" component={component} initialParams={params} />
          <Stack.Screen name="Modals" component={ModalStackScreens} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
