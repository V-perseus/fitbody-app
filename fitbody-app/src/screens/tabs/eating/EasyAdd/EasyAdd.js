import React, { useState, useMemo, useEffect, useCallback, useRef, useLayoutEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// Assets
import globals from '../../../../config/globals'
import StarSelectedIcon from '../../../../../assets/images/svg/icon/24px/star.svg'
import StarOutlineIcon from '../../../../../assets/images/svg/icon/24px/star-outline.svg'

// Components
import BottomHover from '../../../../shared/BottomHover'
import NutritionFacts from '../../../../components/NutritionFacts'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

import api from '../../../../services/api'
import { storeMealPlan, storeFavorites, storeItemHistory, addEasyAddIngredient, setIngredientsOnly } from '../../../../data/meal_plan'

import Styles from './styles'

const EasyAdd = ({ navigation, route }) => {
  const mpr = useSelector((state) => state.data.user.mpr)
  const eatingPreferences = useSelector((state) => state.data.user.eating_preferences)
  const goal = useSelector((state) => state.data.user.goal)
  const ingredientsOnly = useSelector((state) => state.data.meal.ingredientsOnly)

  const slot = useSelector((state) => state.data.meal.mealTimeSlot)
  const day = useSelector((state) => state.data.meal.day)
  const favorites = useSelector((state) => state.data.meal.favorites) || []

  const existingEasyAdd = route.params?.easyAdd
  const addAfterUpdate = route.params?.addAfterUpdate

  const [name, setName] = useState(existingEasyAdd?.name || '')
  const [protein, setProtein] = useState(existingEasyAdd?.protein)
  const [carbs, setCarbs] = useState(existingEasyAdd?.carbs)
  const [fats, setFats] = useState(existingEasyAdd?.fats)

  const [dirty, setDirty] = useState(false)

  const [favorite, setFavorite] = useState(
    existingEasyAdd
      ? favorites.find((f) => f.type === 'easy_add_recipe' && f.id === (existingEasyAdd.base_easy_add_recipe_id || existingEasyAdd.base_id))
      : false,
  )

  // create ref to avoid infinte rerenders
  const setParams = useRef(navigation.setParams)

  const calories = useMemo(() => (protein || 0) * 4 + (carbs || 0) * 4 + (fats || 0) * 9, [protein, carbs, fats])

  const nutritionFactsRecipe = useMemo(
    () => ({ calories: calories || 0, protein: protein || 0, carbs: carbs || 0, fats: fats || 0 }),
    [calories, fats, carbs, protein],
  )

  useEffect(() => {
    setParams.current({ favorite, toggleFavorite })
  }, [setParams, favorite, toggleFavorite])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerForceInset: { top: 'always' },
      headerTitle: () => <Text style={globals.header.headerTitleStyle}>EASY ADD</Text>,
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
      headerShadowVisible: false,
      headerRight: () => (
        <TouchableOpacity style={Styles.HeaderRightIcon} onPress={route.params?.toggleFavorite}>
          {route.params?.favorite ? (
            <StarSelectedIcon color={globals.styles.colors.colorYellow} />
          ) : (
            <StarOutlineIcon color={globals.styles.colors.colorBlack} />
          )}
        </TouchableOpacity>
      ),
    })
  }, [navigation, route])

  const toggleFavorite = useCallback(async () => {
    if (existingEasyAdd) {
      if (favorite) {
        const resp = await api.eating.removeEasyAddFromFavorites({ id: existingEasyAdd.base_easy_add_recipe_id || existingEasyAdd.id })
        storeFavorites({ data: resp.data })
      } else {
        const resp = await api.eating.addEasyAddToFavorites({ id: existingEasyAdd.base_easy_add_recipe_id || existingEasyAdd.id })
        storeFavorites({ data: resp.data })
      }
    }

    setFavorite(!favorite)
  }, [existingEasyAdd, favorite])

  async function save() {
    if (existingEasyAdd && dirty) {
      await api.eating.updateEasyAdd(existingEasyAdd.base_easy_add_recipe_id || existingEasyAdd.id, {
        name,
        fats,
        carbs,
        protein,
        favorite,
      })

      storeItemHistory({
        item: {
          id: existingEasyAdd.id,
          name,
          calories,
          fats,
          carbs,
          protein,
          base_id: existingEasyAdd.base_easy_add_recipe_id || existingEasyAdd.id,
          type: 'easy_add_recipe',
        },
      })

      if (!ingredientsOnly) {
        api.eating.listMeals(day).then((data) => {
          if (!data.error) {
            storeMealPlan({ date: day, data: data.data })
          }
          if (!addAfterUpdate) {
            navigation.goBack()
          } else {
            setDirty(false)
            return
          }
        })
      } else {
        setDirty(false)
        return
        // dispatch(
        //   addEasyAddIngredient({ ingredient: { id: existingEasyAdd.id, name, calories, fats, carbs, protein, type: 'easy_add_recipe' } }),
        // )
        // navigation.navigate('IndividualRecipe')
      }
    } else if (!existingEasyAdd) {
      const response = await api.eating.createEasyAdd({ name, fats, carbs, protein, is_favorite: false })
      if (response.data?.id) {
        const id = response.data.id

        const resp = await api.eating.addEasyAddToDiary({
          date: day,
          easy_add_recipe_id: id,
          meal_time_slot_id: slot,
        })

        storeItemHistory({ item: { id, name, calories, fats, carbs, protein, base_id: id, type: 'easy_add_recipe' } })

        if (!ingredientsOnly) {
          storeMealPlan({ date: day, data: resp.data })
        }

        if (favorite) {
          const favresp = await api.eating.addEasyAddToFavorites({ id })
          storeFavorites({ data: favresp.data })
        }

        if (!ingredientsOnly) {
          navigation.navigate('MealPlan')
        } else {
          addEasyAddIngredient({ ingredient: { id, name, calories, fats, carbs, protein, type: 'easy_add_recipe' } })
          // context needs to be reset
          setIngredientsOnly(false)
          navigation.navigate('IndividualRecipe')
        }
      }
    } else {
      // add
      const id = existingEasyAdd.base_easy_add_recipe_id || existingEasyAdd.base_id

      let resp
      if (!ingredientsOnly) {
        resp = await api.eating.addEasyAddToDiary({
          date: day,
          easy_add_recipe_id: id,
          meal_time_slot_id: slot,
        })
      } else {
        addEasyAddIngredient({ ingredient: { id, name, calories, fats, carbs, protein, type: 'easy_add_recipe' } })
      }

      storeItemHistory({ item: { id, name, calories, fats, carbs, protein, base_id: id, type: 'easy_add_recipe' } })

      if (!ingredientsOnly) {
        storeMealPlan({ date: day, data: resp.data })
      }

      // if (favorite) {
      //   const favresp = await api.eating.addEasyAddToFavorites({ id })
      //   dispatch(storeFavorites({ data: favresp.data }))
      // }

      if (!ingredientsOnly) {
        navigation.navigate('MealPlan')
      } else {
        setIngredientsOnly(false)
        navigation.navigate('IndividualRecipe')
      }
    }
  }
  const formatNumberInput = (str) => {
    return str
      .replace(',', '.') // convert all ',' to '.'
      .replace(/\.(?=.*\.)/g, '') // remove all but last '.'
      .replace(/[^0-9.]/g, '') // remove all non alpha and non '.'
  }

  function handleProteinInputBlur(evt) {
    const stringNumber = parseFloat(evt.nativeEvent.text).toFixed(1)
    setProtein(stringNumber === '' ? '' : +stringNumber)
  }
  function handleCarbsInputBlur(evt) {
    const stringNumber = parseFloat(evt.nativeEvent.text).toFixed(1)
    setCarbs(stringNumber === '' ? '' : +stringNumber)
  }
  function handleFatsInputBlur(evt) {
    const stringNumber = parseFloat(evt.nativeEvent.text).toFixed(1)
    setFats(stringNumber === '' ? '' : +stringNumber)
  }

  function handleNameInputChange(v) {
    setName(v)
    setDirty(true)
  }
  function handleProteinInputChange(v) {
    setProtein(formatNumberInput(v))
    setDirty(true)
  }
  function handleCarbsInputChange(v) {
    setCarbs(formatNumberInput(v))
    setDirty(true)
  }
  function handleFatsInputChange(v) {
    setFats(formatNumberInput(v))
    setDirty(true)
  }

  return (
    <>
      {((dirty && existingEasyAdd) || !existingEasyAdd || (existingEasyAdd && addAfterUpdate)) && (
        <BottomHover>
          <TouchableOpacity onPress={save} style={Styles.AddUpdateButton}>
            <Text style={Styles.AddUpdateButtonText}>{dirty ? 'UPDATE' : 'ADD EASY ADD'}</Text>
          </TouchableOpacity>
        </BottomHover>
      )}
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} enableOnAndroid={true}>
        <View style={Styles.InputContainer}>
          <Text style={Styles.InputLabel}>Name:*</Text>
          <TextInput
            placeholderTextColor={globals.styles.colors.colorGrayDark}
            placeholder={'Ex: Egg Muffins, Smoothie, etc.'}
            underlineColorAndroid="transparent"
            value={name}
            returnKeyType="done"
            onChangeText={handleNameInputChange}
            style={Styles.InputStyle}
          />
          <Text style={Styles.InputLabel}>Protein (g):*</Text>
          <TextInput
            placeholderTextColor={globals.styles.colors.colorGrayDark}
            placeholder={'Enter Value'}
            underlineColorAndroid="transparent"
            keyboardType={'numeric'}
            returnKeyType="done"
            onEndEditing={handleProteinInputBlur}
            value={protein ? String(protein) : protein} // we still need String here otherwise field shows empty when loading data from an existing easy add with numeric values
            onChangeText={handleProteinInputChange}
            style={Styles.InputStyle}
          />
          <Text style={Styles.InputLabel}>Carbs (g):*</Text>
          <TextInput
            placeholderTextColor={globals.styles.colors.colorGrayDark}
            placeholder={'Enter Value'}
            underlineColorAndroid="transparent"
            keyboardType={'numeric'}
            returnKeyType="done"
            onEndEditing={handleCarbsInputBlur}
            value={carbs ? String(carbs) : carbs}
            onChangeText={handleCarbsInputChange}
            style={Styles.InputStyle}
          />
          <Text style={Styles.InputLabel}>Fats (g):*</Text>
          <TextInput
            placeholderTextColor={globals.styles.colors.colorGrayDark}
            placeholder={'Enter Value'}
            underlineColorAndroid="transparent"
            keyboardType={'numeric'}
            returnKeyType="done"
            onEndEditing={handleFatsInputBlur}
            value={fats ? String(fats) : fats}
            onChangeText={handleFatsInputChange}
            style={Styles.InputStyle}
          />
        </View>
        <NutritionFacts
          recipe={nutritionFactsRecipe}
          macrosOnly={true}
          mpr={mpr}
          isRecipe={true}
          eatingPreferences={eatingPreferences}
          goal={goal}
          multiplier={1}
        />

        <Text style={Styles.CalorieText}>
          Calories will auto-populate based on the macronutrients entered above. (protein, carbs, and fats)
        </Text>
      </KeyboardAwareScrollView>
    </>
  )
}

export default EasyAdd
