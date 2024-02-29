import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { View, Text, Keyboard, StatusBar, TouchableOpacity, Linking, ImageBackground, TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as RNLocalize from 'react-native-localize'

// API
import api from '../../../services/api'

// Services & Data
import { updateSession } from '../../../services/session'
import { updateUser } from '../../../data/user'
import { checkExistingProgram } from '../../../data/workout'
import { getMonth, getWeek } from '../../../services/dates'
import { useSegmentLogger } from '../../../services/hooks/useSegmentLogger'

// Assets
import styles from './styles'
import globals from '../../../config/globals'
import BackgroundImage from '../../../../assets/images/signin/login-bg.png'
import Logo from '../../../../assets/images/logo/fitbody_white.svg'

// Components
import ContactSupport from '../../../components/ContactSupport/ContactSupport'
import { FormTextInput } from '../../../components/Forms/FormTextInput'
import { ButtonSquare } from '../../../components/Buttons/ButtonSquare'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'

// Types
import { SignInSignUpOptionsProps } from '../../../config/routes/routeTypes'

const CURRENT_ENV = globals.currentEnv

interface ILoginProps extends SignInSignUpOptionsProps {}
const Login: React.FC<ILoginProps> = ({ navigation }) => {
  const { identifyUser } = useSegmentLogger()

  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [validating, setValidating] = useState(false)
  const [validEmail, setValidEmail] = useState(false)
  const [validPassword, setValidPassword] = useState(false)

  useEffect(() => {
    setValidEmail(email !== null && /(.+)@(.+){2,}\.(.+){2,}/.test(email))
    setValidPassword(password !== null && password.length > 1)
  }, [email, password])

  const emailInput = useRef<TextInput>(null)
  const passwordInput = useRef<TextInput>(null)

  useEffect(() => {
    getMonth()
    getWeek()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  function signIn() {
    Keyboard.dismiss()
    setValidating(true)
    if (email && password && validEmail && validPassword) {
      api.users
        .signInWithEmail({
          email,
          password,
          timezone: RNLocalize.getTimeZone(),
          trial: true,
        })
        .then((data) => {
          // Error shown in api.js
          if (typeof data !== 'undefined') {
            identifyUser(data.user)
            // strip out events field coming from backend. It pollutes app state
            updateUser({
              ...data.user,
              events: [],
            })
            checkExistingProgram(data.user.workout_goal)
            updateSession({
              userId: data.user.id,
              apiToken: data.user.api_token,
              activePlan: data.active_plan,
            })
          }
        })
        .catch(() => {
          // don't need to do anything here... just catch the rejection
          // so the app doesn't crash lmao
        })
    }
  }

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ marginBottom: 0 }}
      style={styles.scrollView}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      testID="login_scrollview"
      getTextInputRefs={() => {
        return [emailInput, passwordInput]
      }}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={BackgroundImage} resizeMode="cover" style={styles.backgroundImage}>
        <Logo style={styles.logo} />
      </ImageBackground>

      <HeaderButton onPress={navigation.goBack} iconColor={globals.styles.colors.colorWhite} style={styles.headerButton} />

      <View style={styles.view}>
        <Text style={styles.loginText}>LOG IN</Text>
        {/* Email */}
        <FormTextInput
          ref={emailInput}
          containerStyle={{ marginBottom: 10 }}
          label="Email:"
          value={email || ''}
          validating={validating}
          valid={validEmail}
          showValidation
          validationText="Please enter a valid email address"
          onChangeText={setEmail}
          autoFocus={true}
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passwordInput.current?.focus()}
          testID="login_email"
        />

        {/* Password */}
        <FormTextInput
          ref={passwordInput}
          label="Password:"
          valid={validPassword}
          validating={validating}
          validationText="Please enter your password"
          secureTextEntry={true}
          value={password || ''}
          returnKeyType="send"
          onChangeText={setPassword}
          onSubmitEditing={signIn}
          testID="login_password"
        />

        <View style={styles.forgotContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>Forgot Password</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <ButtonSquare
            onPress={signIn}
            style={styles.signIn}
            text={`LOG IN ${CURRENT_ENV.includes('staging') ? 'TO STAGING' : ''}`}
            textStyle={styles.buttonText}
            testID="login_button"
          />
        </View>

        <ContactSupport
          style={{ marginVertical: 20 }}
          color={globals.styles.colors.colorBlack}
          linkColor={globals.styles.colors.colorLove}
          navigate={navigation.navigate}
          onPress={() => Linking.openURL('mailto:hello@fitbodyapp.com?subject=Question about my Fit Body app')}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

export default Login
