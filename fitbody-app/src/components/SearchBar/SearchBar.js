import React, { useState } from 'react'
import { Keyboard, Pressable, TextInput, View, StyleSheet } from 'react-native'

import globals from '../../config/globals'

// Components
import SearchIcon from '../../../assets/images/svg/icon/24px/search.svg'
import CloseIcon from '../../../assets/images/svg/icon/24px/close.svg'

export const SearchBar = ({ onSearch, onCancel, placeholder, containerStyle, ...rest }) => {
  const [value, setValue] = useState('')

  function handleChangeText(v) {
    setValue(v)
    onSearch(v)
  }

  function clear() {
    Keyboard.dismiss()
    setValue('')
    onSearch('')
    onCancel && onCancel()
  }

  return (
    <View style={[styles.searchContainer, containerStyle]}>
      <SearchIcon width={24} height={24} color={globals.styles.colors.colorBlack} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={globals.styles.colors.colorGrayDark}
        value={value}
        onChangeText={handleChangeText}
        returnKeyType={'search'}
        {...rest}
      />
      {value.length > 0 && (
        <Pressable onPress={clear} style={styles.clearIcon} hitSlop={8}>
          <CloseIcon width={24} height={24} color={globals.styles.colors.colorBlack} />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    borderRadius: 24,
  },
  searchInput: {
    width: '100%',
    fontSize: 14,
    color: globals.styles.colors.colorBlack,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    borderRadius: 24,
    paddingLeft: 56,
    height: 48,
    backgroundColor: globals.styles.colors.colorGrayLight,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 3,
  },
  clearIcon: {
    position: 'absolute',
    right: 16,
    zIndex: 3,
    height: 24,
    width: 24,
  },
})
