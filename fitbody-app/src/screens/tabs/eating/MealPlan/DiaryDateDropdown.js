import React, { useMemo } from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { moderateScale } from 'react-native-size-matters/extend'
import moment from 'moment'

import Tips from '../../../../../assets/images/svg/icon/24px/tips.svg'
import ChevronDown from '../../../../../assets/images/svg/icon/16px/cheveron/down.svg'
import SelectMultipleIcon from '../../../../../assets/images/svg/icon/24px/select-multiple.svg'
import CloseIcon from '../../../../../assets/images/svg/icon/24px/close.svg'

import globals from '../../../../config/globals'
import styles from './styles'

export const DiaryDateDropdown = ({ navigation, mealPlan, toggleSelect, editMode, setShowDatePicker }) => {
  const storedDay = useSelector((state) => state.data.meal.day)
  const today = useMemo(() => (storedDay ? moment(storedDay) : moment()), [storedDay])

  function showTooltips() {
    navigation.navigate('Tooltips', { screen: 'Tooltip', params: { name: 'meal plans', openedManually: true } })
  }

  return (
    <Pressable style={styles.headerDateButton} onPress={() => setShowDatePicker(true)}>
      <View style={styles.headerDateView}>
        <View style={styles.rowAlignEnd}>
          <Text style={styles.headerDate}>
            {today.format('dddd').toUpperCase()}
            {'\n'}
            <Text style={styles.headerDateText}>{today.format('MMMM, D').toUpperCase()}</Text>
          </Text>
          <ChevronDown color={globals.styles.colors.colorBlack} style={styles.headerDateChevronDown} />
        </View>
        <Pressable onPress={showTooltips} hitSlop={8}>
          <Tips color={globals.styles.colors.colorBlack} />
        </Pressable>
      </View>
      {!mealPlan?.meal_set && mealPlan?.items.length > 0 && (
        <TouchableOpacity onPress={toggleSelect} style={styles.toggleSelect}>
          {editMode ? (
            <CloseIcon width={moderateScale(24)} height={moderateScale(24)} color={globals.styles.colors.colorBlack} />
          ) : (
            <SelectMultipleIcon color={globals.styles.colors.colorPurple} width={moderateScale(24)} height={moderateScale(24)} />
          )}
        </TouchableOpacity>
      )}
    </Pressable>
  )
}
