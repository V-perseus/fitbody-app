import React from 'react'
import RNRestart from 'react-native-restart'
import { Text, ImageBackground, StatusBar, TouchableOpacity } from 'react-native'

import globals from '../../config/globals'
import { checkAndRedirect } from '../../config/utilities'

import BackgroundImage from '../../../assets/images/backgrounds/error.png'
import AlertIcon from '../../../assets/images/svg/icon/40px/alert.svg'

import styles from './styles'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    
  }

  onRestart() {
    RNRestart.Restart()
  }

  handleEmail() {
    checkAndRedirect('hello@fitbodyapp.com')
  }

  render() {
    const backgroundImageStyle = [globals.bgImage.style, { alignItems: 'center', justifyContent: 'center' }]

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ImageBackground source={BackgroundImage} style={backgroundImageStyle} imageStyle={globals.bgImage.imageStyle}>
          <StatusBar barStyle="light-content" />

          <AlertIcon color={globals.styles.colors.colorWhite} />

          <Text style={styles.titleLargeText}>HEY BABE!</Text>
          <Text style={styles.titleTextSmall}>THERE WAS AN UNEXPECTED ERROR</Text>

          <Text style={styles.bodyTextTop}>
            If this problem persists, please <Text style={styles.bodyTextBold}>delete and reinstall</Text> your app. This will not affect
            your saved data.
          </Text>

          <Text style={styles.bodyText}>
            If after reinstalling, you continue to receive this error, please email us at{' '}
            <Text onPress={this.handleEmail}>hello@fitbodyapp.com</Text>
          </Text>

          <TouchableOpacity style={styles.button} onPress={this.onRestart}>
            <Text style={styles.buttonText}>EXIT</Text>
          </TouchableOpacity>
        </ImageBackground>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
