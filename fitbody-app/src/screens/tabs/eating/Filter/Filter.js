import React, { useState, useMemo, useEffect, useCallback, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'

import globals from '../../../../config/globals'
import { storeFilter } from '../../../../data/meal_plan'

import BottomHover from '../../../../shared/BottomHover'
import Checkbox from '../../../../shared/Settings/Checkbox'
import SectionHeader from '../../../../shared/Settings/SectionHeader'
import { colors } from '../EatingPreference/EatingPreference'

import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

const Filter = (props) => {
  const filters = useSelector((state) => state.data.meal.filters)
  const filterType = props.route.params?.filterType ?? 'mealPlans'
  const [filter, setFilter] = useState(useMemo(() => filters?.[filterType], [filters, filterType]))
  const eatingPreferences = useSelector((state) => state.data.user.eating_preferences)
  const slot = useSelector((state) => state.data.meal.mealTimeSlot)

  const resetFilter = useCallback(() => {
    const newFilter = {
      [filterType]: {
        favoritesOnly: false,
        eatingPreferences: {
          Regular: eatingPreferences.find((x) => x.key === 'REGULAR') ? true : false,
          Vegan: eatingPreferences.find((x) => x.key === 'VEGAN') ? true : false,
          Vegetarian: eatingPreferences.find((x) => x.key === 'VEGETARIAN') ? true : false,
          Pescatarian: eatingPreferences.find((x) => x.key === 'PESCATARIAN') ? true : false,
          Keto: eatingPreferences.find((x) => x.key === 'KETO') ? true : false,
          'Dairy-Free': eatingPreferences.find((x) => x.key === 'DAIRY-FREE') ? true : false,
          'Gluten-Free': eatingPreferences.find((x) => x.key === 'GLUTEN-FREE') ? true : false,
          Mediterranean: eatingPreferences.find((x) => x.key === 'MEDITERRANEAN') ? true : false,
        },
      },
    }

    if (filterType === 'recipes') {
      newFilter[filterType].mealTimes = {
        Breakfast: slot === 1,
        Lunch: slot === 2,
        Dinner: slot === 3,
        Snack: [4, 5, 6].includes(slot),
      }
    }

    storeFilter(newFilter)
    setFilter(newFilter[filterType])
  }, [eatingPreferences, filterType, slot])

  const save = () => {
    storeFilter({ [filterType]: filter })
    setTimeout(() => props.navigation.goBack(), 200)
  }

  useEffect(() => {
    props.navigation.setParams({ reset: resetFilter })
  }, [resetFilter])

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerForceInset: { top: 'always' },
      headerTitle: () => <Text style={globals.header.headerTitleStyle}>FILTER</Text>,
      headerLeft: () => <HeaderButton onPress={() => props.navigation.goBack()} />,
      headerRight: () => (
        <TouchableOpacity
          style={{
            alignSelf: 'stretch',
            height: 24,
            borderWidth: 1,
            borderRadius: 24,
            backgroundColor: globals.styles.colors.colorWhite,
            marginRight: 24,
            borderColor: globals.styles.colors.colorBlack,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={props.route.params?.reset}>
          <Text
            style={{
              fontFamily: globals.fonts.primary.boldStyle.fontFamily,
              fontSize: 10,
              paddingHorizontal: 15,
              color: globals.styles.colors.colorBlack,
            }}>
            RESET
          </Text>
        </TouchableOpacity>
      ),
    })
  }, [props.navigation, props.route])

  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        <Checkbox
          iconName={'StarSelected'}
          iconColor={globals.styles.colors.colorYellow}
          title={'Favorites Only'}
          checked={filter.favoritesOnly}
          onChecked={(checked) => setFilter({ ...filter, favoritesOnly: checked })}
        />
        {filterType === 'recipes' && <SectionHeader title={'Meal Times'} />}
        {filterType === 'recipes' &&
          ['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((k) => (
            <Checkbox
              title={k}
              key={k}
              checked={filter.mealTimes[k]}
              onChecked={(checked) => setFilter({ ...filter, mealTimes: { ...filter.mealTimes, [k]: checked } })}
            />
          ))}
        <SectionHeader title={'Eating Preferences'} />
        {['Regular', 'Vegan', 'Vegetarian', 'Pescatarian', 'Keto', 'Dairy-Free', 'Gluten-Free', 'Mediterranean'].map((k) => (
          <Checkbox
            key={k}
            iconName={k.toUpperCase()}
            iconColor={colors[k.toUpperCase()]}
            title={k}
            checked={filter.eatingPreferences[k]}
            onChecked={(checked) => setFilter({ ...filter, eatingPreferences: { ...filter.eatingPreferences, [k]: checked } })}
          />
        ))}
        <View style={{ height: 110 }} />
      </ScrollView>
      <BottomHover>
        <TouchableOpacity
          onPress={save}
          style={{
            flex: 1,
            marginVertical: 5,
            marginHorizontal: 24,
            marginTop: 25,
            marginBottom: 30,
            height: 56,
            borderRadius: 28,
            backgroundColor: globals.styles.colors.colorPink,
            justifyContent: 'center',
            shadowColor: globals.styles.colors.colorPink,
            shadowOpacity: 0.7,
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 15,
            elevation: 3,
          }}>
          <Text
            style={{
              fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
              fontSize: 16,
              textAlign: 'center',
              color: globals.styles.colors.colorWhite,
            }}>
            SAVE
          </Text>
        </TouchableOpacity>
      </BottomHover>
    </>
  )
}

export default Filter
