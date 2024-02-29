import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import { useSelector } from 'react-redux'
import { Keyboard, StatusBar, Text, TextInput, View, TouchableOpacity, TextStyle } from 'react-native'

// API
import api from '../../../../services/api'

// Services
import { setErrorMessage } from '../../../../services/error'
import { userSelector } from '../../../../data/user/selectors'

// Components
import CircleCheckIcon from '../../../../../assets/images/svg/icon/24px/circle/check.svg'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

// Assets
import styles from './styles'
import globals from '../../../../config/globals'
import { NavigationProp } from '@react-navigation/native'
import { AccountStackParamList } from '../../../../config/routes/routeTypes'

interface ChangePasswordProps {
  navigation: NavigationProp<AccountStackParamList, 'ChangePassword'>
}
const ChangePassword = ({ navigation }: ChangePasswordProps) => {
  const user = useSelector(userSelector)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirmed, setNewPasswordConfirmed] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [matchingPasswords, setMatchingPasswords] = useState(false)

  const newPasswordRef = useRef<TextInput>(null)
  const confirmPasswordRef = useRef<TextInput>(null)

  useEffect(() => {
    const { goBack } = navigation
    navigation.setOptions({
      headerTitle: () => <Text style={globals.header.headerTitleStyle as TextStyle}>Change Password</Text>,
      headerLeft: () => <HeaderButton onPress={() => goBack()} />,
    })
  }, [navigation])

  useEffect(() => {
    Keyboard.dismiss()
  }, [])

  /**
   * Test for newPassword length
   */
  function checkValidPasswordLength(pwd: string) {
    setNewPassword(pwd)
    if (pwd.length >= 6) {
      setValidPassword(true)
    } else {
      setValidPassword(false)
    }
  }

  /**
   * Test for matching new passwords
   */
  function checkNewPasswordsMatch(confirmed: string) {
    setNewPasswordConfirmed(confirmed)
    if (confirmed === newPassword) {
      setMatchingPasswords(true)
    } else {
      setMatchingPasswords(false)
    }
  }

  /**
   * Submit forgot password request
   */
  function submitChangePassword() {
    const { goBack } = navigation
    if (matchingPasswords) {
      api.users
        .updateUserProfile({
          id: user.id,
          password: newPassword,
          old_password: oldPassword,
        })
        .then(() => {
          setErrorMessage({ error: 'Password changed successfully!' })
          goBack()
        })
        .catch(() => {})
    } else {
      setErrorMessage({ error: 'New passwords do not match' })
    }
  }

  /**
   * Render
   */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.view}>
        <Text style={styles.h1}>Change Password</Text>
        <Text style={styles.p}>Password must contain one lowercase letter, one number and be at least 6 characters long.</Text>

        {/* Old Password */}
        <View style={styles.relative}>
          <Text style={styles.label}>OLD PASSWORD</Text>
          <TextInput
            style={styles.textFields}
            autoCorrect={false}
            placeholder="* * * * * * * *"
            placeholderTextColor={globals.styles.colors.colorGrayDark}
            secureTextEntry={true}
            value={oldPassword}
            autoCapitalize="none"
            returnKeyType="next"
            onChangeText={setOldPassword}
            onSubmitEditing={() => newPasswordRef.current?.focus()}
          />
        </View>

        {/* New Password */}
        <View style={styles.relative}>
          <Text style={styles.label}>NEW PASSWORD</Text>
          <View style={[styles.checkMark, { opacity: validPassword ? 1 : 0 }]}>
            <CircleCheckIcon color={globals.styles.colors.colorGreen} />
          </View>
          <TextInput
            style={styles.textFields}
            autoCorrect={false}
            placeholderTextColor={globals.styles.colors.colorGrayDark}
            secureTextEntry={true}
            value={newPassword}
            autoCapitalize="none"
            returnKeyType="next"
            onChangeText={checkValidPasswordLength}
            ref={newPasswordRef}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.relative}>
          <Text style={styles.label}>CONFIRM PASSWORD</Text>
          <View style={[styles.checkMark, { opacity: matchingPasswords ? 1 : 0 }]}>
            <CircleCheckIcon color={globals.styles.colors.colorGreen} />
          </View>
          <TextInput
            style={styles.textFields}
            autoCorrect={false}
            placeholderTextColor={globals.styles.colors.colorGrayDark}
            secureTextEntry={true}
            value={newPasswordConfirmed}
            autoCapitalize="none"
            onChangeText={checkNewPasswordsMatch}
            ref={confirmPasswordRef}
            onSubmitEditing={submitChangePassword}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitContainer} onPress={submitChangePassword}>
          <LinearGradient style={styles.submit} colors={[globals.styles.colors.colorPink, globals.styles.colors.colorLove]}>
            <Text style={styles.buttonText}>SUBMIT</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ChangePassword
