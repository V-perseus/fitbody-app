import React, { useMemo, memo, useEffect, useState, useRef, useCallback } from 'react'
import { View, TouchableOpacity, Text, Animated, Dimensions } from 'react-native'
import { scale, moderateScale } from 'react-native-size-matters/extend'

import { useStateSafe } from '../../../../services/hooks/useStateSafe'

import CircleOutlineIcon from '../../../../../assets/images/svg/icon/24px/circle/circle-outline.svg'
import CircleCheckedIcon from '../../../../../assets/images/svg/icon/24px/circle/check-filled.svg'
import CircleAddIcon from '../../../../../assets/images/svg/icon/40px/circle/add.svg'
import globals from '../../../../config/globals'

const DiaryListHead = (props) => {
  const totals = useMemo(() => {
    return (props.items || []).reduce(
      (total, current) => {
        total.calories += current.calories
        total.protein += current.protein
        total.carbs += current.carbs
        total.fats += current.fats

        return total
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 },
    )
  }, [props.items])

  const xValue = useRef(new Animated.Value(0)).current
  const macrosOpacityValue = useRef(new Animated.Value(props.showMacros ? 1 : 0)).current
  const [macrosVisible, setMacrosVisible] = useStateSafe(props.showMacros)

  let [slotSelected, setSlotSelected] = useState(false)
  let [selected, setSelected] = useState([])

  useEffect(() => {
    setSelected(props.selected)
  }, [props.selected])

  useEffect(() => {
    setSlotSelected((selected || []).length === (props.items || []).length && (props.items || []).length > 0)
  }, [selected, props.items])

  useEffect(() => {
    Animated.timing(xValue, {
      toValue: props.editMode ? scale(48) : scale(0),
      duration: 100,
      // easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }, [props.editMode])

  useEffect(() => {
    if (props.showMacros) {
      setMacrosVisible(true)
    }
    Animated.timing(macrosOpacityValue, {
      toValue: props.showMacros ? 1 : 0,
      duration: 500,
      // easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setMacrosVisible(props.showMacros)
    })
  }, [props.showMacros])

  const editTransform = {
    transform: [
      {
        translateX: xValue,
      },
    ],
  }

  const macrosTransform = {
    // transform: [{
    opacity: macrosOpacityValue,
    // }]
  }

  const onToggleSelect = (items, selectionActive, toggleAll = false) => {
    // console.log('items', items)
    // console.log('selectionActive', selectionActive)

    let newItems = []
    if (!selectionActive) {
      newItems = toggleAll ? items : [...selected, ...items]
    } else {
      newItems = toggleAll
        ? []
        : selected.filter((x) => !items.find((i) => i.type === x.type && i.id === x.id && i.meal_time_slot_id === x.meal_time_slot_id))
    }

    setSelected(newItems)

    // console.log('selected', newItems)
  }

  const { handlePress, slot } = props

  const addFood = useCallback(() => handlePress(slot.id), [handlePress, slot])

  const styles = {
    titleContainer: {
      width: Dimensions.get('window').width,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: scale(24),
      paddingRight: scale(19),
      backgroundColor: globals.styles.colors.colorGrayLight,
      height: moderateScale(66),
    },
    textContainer: {
      flex: 1,
    },
    selectIcon: {
      marginRight: scale(24),
    },
    macroText: {
      fontFamily: globals.fonts.primary.style.fontFamily,
      fontSize: moderateScale(12),
      marginLeft: 1,
    },
    calorieText: {
      fontFamily: globals.fonts.primary.style.fontFamily,
      fontSize: moderateScale(12),
    },
    macrosContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    macros: {
      fontSize: moderateScale(16),
      fontFamily: globals.fonts.secondary.style.fontFamily,
      color: globals.styles.colors.colorGrayDark,
    },
    dot: {
      width: 3.3,
      height: 3.3,
      borderRadius: 999,
      backgroundColor: globals.styles.colors.colorPink,
      marginLeft: scale(4.5),
      marginRight: scale(4.5),
    },
    mealSlotName: [
      {
        fontSize: moderateScale(23),
        fontFamily: globals.fonts.secondary.style.fontFamily,
        color: globals.styles.colors.colorBlack,
        lineHeight: moderateScale(24),
      },
      macrosVisible ? null : { top: scale(3) },
    ],
  }

  return (
    <View style={styles.titleContainer}>
      <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', left: scale(-48) }, editTransform]}>
        <TouchableOpacity
          onPress={() => {
            onToggleSelect(
              (props.items || []).map((r) => ({ type: r.type, id: r.id, meal_time_slot_id: props.slot.id })),
              slotSelected,
              true,
            )

            props.onToggleSelect(
              (props.items || []).map((r) => ({ type: r.type, id: r.id, meal_time_slot_id: props.slot.id })),
              slotSelected,
              true,
            )
          }}>
          {slotSelected ? (
            <CircleCheckedIcon style={styles.selectIcon} width={scale(24)} height={scale(24)} color={globals.styles.colors.colorPurple} />
          ) : (
            <CircleOutlineIcon style={styles.selectIcon} width={scale(24)} height={scale(24)} color={globals.styles.colors.colorGray} />
          )}
        </TouchableOpacity>
        <View>
          <Text style={styles.mealSlotName}>{props.slot.mealtimeslot.slot_name}:</Text>
          {props.items?.length > 0 && macrosVisible && (
            <Animated.View style={[styles.macrosContainer, { opacity: macrosOpacityValue }]}>
              <Text style={styles.macros}>
                {Math.round(totals.calories)}
                <Text style={styles.calorieText}> Cal</Text>
              </Text>
              <View style={styles.dot} />
              <Text style={styles.macros}>
                {Math.round(totals.protein)}
                <Text style={styles.macroText}>g Protein</Text>
              </Text>
              <View style={styles.dot} />
              <Text style={styles.macros}>
                {Math.round(totals.carbs)}
                <Text style={styles.macroText}>g Carbs</Text>
              </Text>
              <View style={styles.dot} />
              <Text style={styles.macros}>
                {Math.round(totals.fats)}
                <Text style={styles.macroText}>g Fats</Text>
              </Text>
            </Animated.View>
          )}
        </View>
      </Animated.View>
      {props.type === 0 && !props.editMode && (
        <TouchableOpacity onPress={addFood}>
          <CircleAddIcon width={scale(40)} height={scale(40)} color={globals.styles.colors.colorPink} />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default memo(DiaryListHead)
