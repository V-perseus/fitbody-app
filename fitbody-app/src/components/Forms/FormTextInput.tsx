import React, { forwardRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native'

import CircleError from '../../../assets/images/svg/icon/24px/circle/close.svg'
import CircleCheckedIcon from '../../../assets/images/svg/icon/24px/circle/check.svg'
import globals from '../../config/globals'

interface IFormTextInputProps {
  label: string
  containerStyle?: ViewStyle
  inputStyle?: ViewStyle
  showValidation?: boolean
  valid: boolean
  validating: boolean
  validationText: string
  helpText?: string
  placeholder?: string
  secure?: boolean
  onToggleSecure?: () => void
  secureTextEntry?: boolean
  placeholderTextColor?: string
  autoFocus?: boolean
  value: string
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  autoCorrect?: boolean
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'number-pad' | 'decimal-pad'
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send'
  onChangeText: (text: string) => void
  onSubmitEditing?: (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void
  customSlotRight?: () => JSX.Element
  testID?: string
}
export const FormTextInput = forwardRef<TextInput, IFormTextInputProps>((props, ref) => {
  const {
    label,
    containerStyle,
    inputStyle,
    showValidation = false,
    valid,
    validating,
    validationText,
    helpText,
    placeholder,
    secure = false,
    onToggleSecure,
    secureTextEntry = false,
    placeholderTextColor = globals.styles.colors.colorTransparentBlack50,
    autoFocus = false,
    value,
    autoCapitalize = 'none',
    autoCorrect = false,
    keyboardType = 'default',
    returnKeyType,
    onChangeText,
    onSubmitEditing,
    customSlotRight = null,
    ...rest
  } = props
  const [dirty, setDirty] = useState(false)

  function onChange(text: string) {
    if (text.trim() === '') {
      setDirty(false)
    } else {
      setDirty(true)
    }
    onChangeText(text)
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.textField, inputStyle]}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        autoFocus={autoFocus}
        value={value}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onChangeText={onChange}
        ref={ref}
        onSubmitEditing={onSubmitEditing}
        {...rest}
      />

      {/* Accepts any component in the right side of input */}
      {customSlotRight ? (
        <View style={styles.rightSlot}>{customSlotRight()}</View>
      ) : (
        <>
          {/* Show and be able to toggle secure password mode or show valid/invalid indicator icon */}
          {secure ? (
            <Pressable hitSlop={20} style={styles.passwordEye} onPress={onToggleSecure}>
              <Text style={styles.isSecureText}>{secureTextEntry ? 'SHOW' : 'HIDE'}</Text>
            </Pressable>
          ) : showValidation && dirty ? (
            <>
              <CircleCheckedIcon style={[styles.checkMark, { opacity: valid ? 1 : 0 }]} color={globals.styles.colors.colorGreen} />
              <CircleError style={[styles.checkMark, { opacity: !valid ? 1 : 0 }]} color={globals.styles.colors.colorLove} />
            </>
          ) : null}
        </>
      )}

      {/* Show text underneath input as an invalid state or as a helpful hint */}
      {validating && !valid ? (
        <Text style={styles.validateText}>{validationText}</Text>
      ) : helpText ? (
        <Text style={styles.helpText}>{helpText}</Text>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  label: {
    color: globals.styles.colors.colorBlack,
    fontSize: 16,
    marginBottom: 2,
    ...globals.styles.fonts.primary.boldStyle,
  },
  checkMark: {
    position: 'absolute',
    right: 10,
    marginTop: 32,
  },
  textField: {
    color: globals.styles.colors.colorBlack,
    borderWidth: 1,
    borderRadius: 3,
    height: 40,
    marginBottom: 4,
    fontSize: 16,
    paddingLeft: 6,
  },
  passwordEye: {
    zIndex: 10,
    right: 10,
    position: 'absolute',
    marginTop: 37,
  },
  isSecureText: {
    color: globals.styles.colors.colorBlack,
    fontSize: 12,
  },
  validateText: {
    ...globals.styles.fonts.primary.semiboldStyle,
    color: globals.styles.colors.colorLove,
    fontSize: 14,
    height: 23,
  },
  helpText: {
    fontSize: 12,
    color: globals.styles.colors.colorBlack,
    height: 17,
  },
  spacer: {
    height: 23,
  },
  rightSlot: {
    zIndex: 10,
    right: 10,
    position: 'absolute',
    marginTop: 34,
  },
})
