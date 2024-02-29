import React from 'react'
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react-native'
import { NavigationContext } from '@react-navigation/native'

import ProperFormTips from '../../../src/features/workouts/components/ProperFormTips/ProperFormTips'
import globals from '../../../src/config/globals'

jest.mock('expo-av', () => {
  const { Audio } = jest.requireActual('expo-av')
  Audio.Sound.createAsync = jest.fn(() =>
    Promise.resolve({ sound: { playAsync: jest.fn(), unloadAsync: jest.fn(), stopAsync: jest.fn() } }),
  )
  return { Audio }
})

afterEach(cleanup)
// fake NavigationContext value data
const navContext = {
  isFocused: () => true,
  // addListener returns an unscubscribe function.
  addListener: jest.fn(() => jest.fn()),
}

const renderProps = (props = {}) => ({
  content: 'this is a tip',
  audioUrl: 'https://www.google.com',
  autoplayEnabled: false,
  onOpenStateChange: jest.fn(),
  open: false,
  disabled: false,
  ...props,
})

describe('ProperFormTips', () => {
  it('renders snapshot correctly', () => {
    const tree = render(
      <NavigationContext.Provider value={navContext}>
        <ProperFormTips {...renderProps()} />
      </NavigationContext.Provider>,
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render header and content text', () => {
    const { queryByText } = render(
      <NavigationContext.Provider value={navContext}>
        <ProperFormTips {...renderProps()} />
      </NavigationContext.Provider>,
    )
    expect(queryByText(/Proper Form Tips/)).not.toBeNull()
    expect(queryByText(/this is a tip/)).not.toBeNull()
  })

  // audio toggle buttons have been temp disabled
  // it('should show play buttons when in opened state', async () => {
  //   const { queryByTestId } = render(
  //     <NavigationContext.Provider value={navContext}>
  //       <ProperFormTips {...renderProps({ open: true })} />
  //     </NavigationContext.Provider>,
  //   )
  //   expect(queryByTestId('play')).not.toBeNull()
  //   expect(queryByTestId('stop')).toBeNull()
  // })

  // it('should hide play button when menu is closed', async () => {
  //   const { queryByTestId } = render(
  //     <NavigationContext.Provider value={navContext}>
  //       <ProperFormTips {...renderProps({ open: false })} />
  //     </NavigationContext.Provider>,
  //   )
  //   expect(queryByTestId('play')).toBeNull()
  //   expect(queryByTestId('stop')).toBeNull()
  // })

  // audio toggle buttons have been temp disabled
  // it('should toggle play/stop when play is pressed', async () => {
  //   const { queryByTestId } = render(
  //     <NavigationContext.Provider value={navContext}>
  //       <ProperFormTips {...renderProps({ open: true, autoplayEnabled: true })} />
  //     </NavigationContext.Provider>,
  //   )
  //   const playBtn = queryByTestId('play')
  //   expect(playBtn).not.toBeNull()
  //   act(() => {
  //     fireEvent.press(playBtn)
  //   })
  //   await waitFor(() => queryByTestId('stop'))
  //   expect(queryByTestId('play')).toBeNull()
  //   expect(queryByTestId('stop')).not.toBeNull()
  // })

  it('should be properly disabled', async () => {
    const { queryByTestId, queryByText } = render(
      <NavigationContext.Provider value={navContext}>
        <ProperFormTips {...renderProps({ disabled: true })} />
      </NavigationContext.Provider>,
    )
    const playBtn = queryByTestId('play')
    expect(playBtn).toBeNull()
    expect(queryByText(/Proper Form Tips/)).toHaveStyle({ color: globals.styles.colors.colorGrayDark })
  })
})
