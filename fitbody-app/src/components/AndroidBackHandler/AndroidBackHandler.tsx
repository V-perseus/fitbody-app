import React, { ReactElement, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { BackHandler } from 'react-native'

interface IAndroidBackHandlerProps {
  children: ReactElement<any, any>
  handlePress?: () => void
}
const AndroidBackHandler: React.FC<IAndroidBackHandlerProps> = ({ children, handlePress }) => {
  useFocusEffect(
    useCallback(() => {
      // Returning true from onBackPress denotes that we have handled the event,
      // and react-navigation's listener will not get called, thus not popping the screen.
      // Returning false will cause the event to bubble up and react-navigation's listener will pop the screen.

      const onBackPress = () => {
        if (handlePress && typeof handlePress === 'function') {
          handlePress()
          return true
        }

        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [handlePress]),
  )

  return children
}

export default AndroidBackHandler
