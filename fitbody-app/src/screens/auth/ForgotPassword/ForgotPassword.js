import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import { Keyboard, StatusBar, Text, View, TouchableOpacity } from 'react-native'

// API
import api from '../../../services/api'

// Services
import { setErrorMessage } from '../../../services/error'

// Assets
import styles from './styles'
import globals from '../../../config/globals'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'
import { FormTextInput } from '../../../components/Forms/FormTextInput'

export default class ForgotPassword extends Component {
  /**
   * Navigation props
   */
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation
    return {
      headerTitle: 'Forgot Password',
      headerLeft: () => <HeaderButton onPress={() => navigate('SignInSignUp')} />,
    }
  }

  /**
   * Constructor
   */
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      validEmail: false,
    }
  }

  /**
   * Component Did Mount
   */
  componentWillMount() {
    Keyboard.dismiss()
  }

  /**
   * Test for a valid email
   */
  checkValidEmail(email) {
    this.setState({ email: email })
    if (/(.+)@(.+){2,}\.(.+){2,}/.test(email)) {
      this.setState({ validEmail: true })
    } else {
      this.setState({ validEmail: false })
    }
  }

  /**
   * Submit forgot password request
   */
  submitForgotPassword() {
    if (this.state.validEmail) {
      api.users.forgotPassword(this.state.email).then((data) => {
        setErrorMessage({ error: data.message })
      })
    } else {
      setErrorMessage({ error: 'Please enter a valid email address' })
    }
  }

  /**
   * Render
   */
  render() {
    let validEmailCheckMark = 0

    if (this.state.validEmail) {
      validEmailCheckMark = 1
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.view}>
          <Text style={styles.h1}>Forgot Password</Text>
          <Text style={styles.p}>Enter your registered email &amp; we will send you password reset instructions via email.</Text>

          {/* Email */}
          <FormTextInput
            containerStyle={styles.textFields}
            label="Email:"
            autoCorrect={false}
            autoFocus={true}
            value={this.state.email}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="go"
            onChangeText={(email) => this.checkValidEmail(email)}
          />

          {/* Submit */}
          <TouchableOpacity style={styles.submitContainer} onPress={() => this.submitForgotPassword()}>
            <LinearGradient style={styles.submit} colors={[globals.styles.colors.colorPink, globals.styles.colors.colorLove]}>
              <Text style={styles.buttonText}>SUBMIT</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}
