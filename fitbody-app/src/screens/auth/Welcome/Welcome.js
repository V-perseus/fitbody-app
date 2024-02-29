import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import i18n from 'i18n-js'
import { SafeAreaView } from 'react-native-safe-area-context'

// Services & Data
import { hideLoadingModal } from '../../../services/loading'

// Components
import OnboardingCarousel from '../../../components/OnboardingCarousel'
import { ButtonSquare } from '../../../components/Buttons/ButtonSquare'

// Assets
import styles from './styles'
import globals from '../../../config/globals'

export default class Welcome extends Component {
  /**
   * Navigation
   */
  static navigationOptions = {
    headerShown: false,
  }

  /**
   * Hide any loaders that may be showing
   */
  componentWillMount() {
    hideLoadingModal()
  }

  render() {
    const { navigate } = this.props.navigation

    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.logoContainer} />
        <OnboardingCarousel />

        {/* Sign In/Up Buttons */}
        <LinearGradient style={styles.buttonContainer} colors={globals.styles.workouts.gradients.SHRED}>
          <ButtonSquare
            testID="loginbutton"
            style={[styles.gradientButton, styles.loginButton]}
            onPress={() => navigate('SignInSignUp')}
            text={i18n.t('app.register.login').toUpperCase()}
            textStyle={styles.buttonLabel}
          />
          <ButtonSquare
            testID="signupbutton"
            style={[styles.gradientButton, styles.signupButton]}
            onPress={() => navigate('SignUp')}
            text="SIGN UP"
            textStyle={[styles.buttonLabel, styles.signupLabel]}
          />
        </LinearGradient>
      </SafeAreaView>
    )
  }
}
