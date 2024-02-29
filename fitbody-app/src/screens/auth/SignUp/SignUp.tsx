import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Text, View, Keyboard, StatusBar, ImageBackground, Linking, TextInput } from 'react-native'
import * as RNLocalize from 'react-native-localize'
import { NavigationProp } from '@react-navigation/native'
// import Recaptcha, { RecaptchaHandles } from 'react-native-recaptcha-that-works'

// API
import api from '../../../services/api'

// Services
import { updateUser } from '../../../data/user'
import { updateSession } from '../../../services/session'
import { getMonth, getWeek } from '../../../services/dates'
import { useSegmentLogger } from '../../../services/hooks/useSegmentLogger'

// Components
import ContactSupport from '../../../components/ContactSupport/ContactSupport'
import { FormCheckbox } from '../../../components/Forms/FormCheckbox'
import { FormTextInput } from '../../../components/Forms/FormTextInput'
import { ButtonSquare } from '../../../components/Buttons/ButtonSquare'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'

// Assets
import styles from './styles'
import globals from '../../../config/globals'
import BackgroundImage from '../../../../assets/images/signin/login-bg.png'
import Logo from '../../../../assets/images/logo/fitbody_white.svg'
import { LoggedOutStackParamList } from '../../../config/routes/routeTypes'

interface ISignUpProps {
  navigation: NavigationProp<LoggedOutStackParamList, 'SignUp'>
}
const SignUp = ({ navigation }: ISignUpProps) => {
  const { logEvent } = useSegmentLogger()

  const [email, setEmail] = useState<string>('')
  const [confirmEmail, setConfirmEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [fullName, setFullName] = useState<string>('')
  const [newsletter, setNewsletter] = useState(false)

  const [validating, setValidating] = useState(false)
  const [validEmail, setValidEmail] = useState(false)
  const [validConfirmEmail, setValidConfirmEmail] = useState(false)
  const [validPassword, setValidPassword] = useState(false)
  const [validFullName, setValidFullName] = useState(false)
  const [formValid, setFormValid] = useState(false)
  const [isSecurePasswordField, setIsSecurePasswordField] = useState(true)
  // const [captchaToken, setCaptchaToken] = useState('')

  const refEmailInput = useRef<TextInput | null>(null)
  const refConfirmEmailInput = useRef<TextInput | null>(null)
  const refPasswordInput = useRef<TextInput | null>(null)
  const refFullNameInput = useRef<TextInput | null>(null)
  // const recaptcha = useRef<RecaptchaHandles>(null)

  const nameLengthLimit = 30

  // const sendCaptcha = () => {
  //   recaptcha.current?.open()
  // }

  // const onVerify = (token: string) => {
  //   console.log('success!', token)
  //   setCaptchaToken(token)
  //   signup(token)
  // }

  // const onExpire = () => {
  //   console.warn('expired!')
  //   setCaptchaToken('')
  // }

  // const handleClosePress = () => {
  //   recaptcha.current?.close()
  // }

  // const onError = (error: string) => {
  //   console.log('ERROR', error)
  //   setCaptchaToken('')
  // }

  useEffect(() => {
    const nameRegex = /(http|https|.com)/
    const emailValid = email !== null && /(.+)@(.+){2,}\.(.+){2,}/.test(email)
    setValidEmail(emailValid)

    const emailConfirmValid = email === confirmEmail && confirmEmail && confirmEmail.length > 1 ? true : false
    setValidConfirmEmail(emailConfirmValid)

    const passwordValid = password !== null && /[A-Za-z]/.test(password) && /[0-9]/.test(password) && password.length >= 6
    setValidPassword(passwordValid)

    const fullNameValid = fullName !== null && fullName.length <= nameLengthLimit && !nameRegex.test(fullName.toLowerCase())
    setValidFullName(fullNameValid)

    setFormValid(emailValid && emailConfirmValid && passwordValid && fullNameValid)
  }, [email, confirmEmail, password, fullName])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  function signup(recapToken: string = '') {
    Keyboard.dismiss()
    setValidating(true)
    if (formValid) {
      api.users
        .signUpWithEmail({
          email: email,
          password: password,
          name: fullName,
          newsletter: newsletter,
          timezone: RNLocalize.getTimeZone(),
          trial: true,
          // reCaptchaToken: recapToken ? recapToken : null,
        })
        .then((data) => {
          // if (data.captcha_required) {
          //   sendCaptcha()
          //   return
          // }
          if (!__DEV__) {
            // registers a Segment event
            logEvent(data.user, 'Signup Completed', {
              email_address: data.user.email,
              full_name: data.user.name,
              newsletter_optin: data.user.newsletter,
              oauth_type: 'email',
            })
          }
          updateUser({
            ...data.user,
            origin: 'signup',
          })
          updateSession({
            userId: data.user.id,
            apiToken: data.user.api_token,
            activePlan: data.user.has_active_plans,
          })
          getMonth()
          getWeek()
        })
        .catch(() => {
          // don't need to do anything here... just catch the rejection
          // so the app doesn't crash lmao
        })
    }
  }

  return (
    <>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginBottom: 0 }}
        style={styles.scrollView}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        getTextInputRefs={() => {
          return [refEmailInput, refConfirmEmailInput, refPasswordInput, refFullNameInput]
        }}>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={BackgroundImage} resizeMode="cover" style={styles.backgroundImage}>
          <Logo style={styles.logo} />
        </ImageBackground>

        <HeaderButton onPress={navigation.goBack} iconColor={globals.styles.colors.colorWhite} style={styles.headerButton} />

        <View style={styles.view}>
          <Text style={styles.signupText}>SIGN UP</Text>
          {/* Email */}
          <FormTextInput
            ref={refEmailInput}
            containerStyle={{ marginBottom: 10 }}
            label="Email:"
            value={email}
            validating={validating}
            valid={validEmail}
            showValidation
            validationText="Please enter a valid email address"
            onChangeText={setEmail}
            autoFocus={true}
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => refConfirmEmailInput.current?.focus()}
          />

          {/* Email confirm */}
          <FormTextInput
            ref={refConfirmEmailInput}
            containerStyle={{ marginBottom: 10 }}
            label="Confirm Email:"
            value={confirmEmail}
            validating={validating}
            valid={validConfirmEmail}
            showValidation
            validationText="Please confirm your email address"
            onChangeText={setConfirmEmail}
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => refPasswordInput.current?.focus()}
          />

          {/* Password */}
          <FormTextInput
            ref={refPasswordInput}
            containerStyle={{ marginBottom: 10 }}
            label="Password:"
            valid={validPassword}
            validating={validating}
            showValidation
            validationText="Please enter a valid password"
            helpText="One letter, one number and at least six characters"
            secure
            onToggleSecure={() => setIsSecurePasswordField(() => !isSecurePasswordField)}
            secureTextEntry={isSecurePasswordField}
            value={password}
            returnKeyType="next"
            onChangeText={setPassword}
            onSubmitEditing={() => refFullNameInput.current?.focus()}
          />

          {/* Full name */}
          <FormTextInput
            ref={refFullNameInput}
            containerStyle={{ marginBottom: 10 }}
            label="Full Name:"
            valid={validFullName}
            validating={validating}
            validationText={`Name must be less than ${nameLengthLimit} chars and cannot contain links`}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            returnKeyType="next"
            // onSubmitEditing={() => refFullNameInput.current.focus()}
          />

          {/* Newsletter */}
          <FormCheckbox
            containerStyle={{ marginBottom: 45 }}
            text="I would like to receive the exclusive Fit Body app weekly newsletter with helpful tips for my fitness journey. Sign me up!"
            onPress={() => setNewsletter(() => !newsletter)}
            checked={newsletter}
          />

          {/* Terms & Conditions */}
          <Text style={styles.tc}>By creating my account, I agree to the</Text>
          <Text style={styles.tc}>
            <Text style={styles.tcLink} onPress={() => navigation.navigate('Terms')}>
              Terms & Conditions
            </Text>{' '}
            and{' '}
            <Text style={styles.tcLink} onPress={() => navigation.navigate('Privacy')}>
              Privacy Policy
            </Text>
            .
          </Text>

          <View style={styles.buttonContainer}>
            <ButtonSquare onPress={signup} style={styles.signIn} text={'CREATE MY ACCOUNT'} textStyle={styles.buttonText} />
          </View>

          <ContactSupport
            color={globals.styles.colors.colorBlack}
            linkColor={globals.styles.colors.colorLove}
            navigate={navigation.navigate}
            onPress={() => Linking.openURL('mailto:hello@fitbodyapp.com?subject=Question about my Fit Body app')}
          />
        </View>
      </KeyboardAwareScrollView>
      {/* <Recaptcha
        ref={recaptcha}
        lang="en"
        // headerComponent={<Button title="Close modal" onPress={handleClosePress} />}
        siteKey="6LfO4rAaAAAAAO5XFY4vWVKXZ7rUXj2avU96ZIka"
        baseUrl="https://join.fitbodyapp.com"
        onVerify={onVerify}
        onExpire={onExpire}
        onError={onError}
        size="invisible"
        // size="compact"
      /> */}
    </>
  )
}

export default SignUp
