import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { View, ScrollView, TouchableOpacity, Text, Image, TextInput } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

// styles
import styles from './styles'
import globals from '../../../../config/globals'

// Components
import ChevronDown from '../../../../../assets/images/svg/icon/16px/cheveron/down.svg'
import NutritionFacts from '../../../../components/NutritionFacts'
import SinglePickerModal from '../../../../components/SinglePickerModal'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

import api from '../../../../services/api'
import { setErrorMessage } from '../../../../services/error'
import { storeMealPlan, storeItemHistory, addIngredient } from '../../../../data/meal_plan'

const FoodMacros = (props) => {
  useEffect(() => {
    props.navigation.setOptions({
      headerForceInset: { top: 'always' },
      headerTitle: () => <Text style={globals.header.headerTitleStyle}>FOOD</Text>,
      headerLeft: () => <HeaderButton onPress={props.navigation.goBack} />,
      headerShadowVisible: false,
    })
  }, [props.navigation])

  const ingredientsOnly = useSelector((state) => state.data.meal.ingredientsOnly)

  const day = useSelector((state) => state.data.meal.day)
  const slot = useSelector((state) => state.data.meal.mealTimeSlot)
  const mpr = useSelector((state) => state.data.user.mpr)
  const eatingPreferences = useSelector((state) => state.data.user.eating_preferences)
  const goal = useSelector((state) => state.data.user.goal)
  const currentRecipe = useSelector((state) => state.data.meal.currentRecipe)

  const ingredient = props.route.params?.ingredient ?? {}

  if (ingredient.quantity) {
    ingredient.serving_qty = ingredient.quantity
  }

  const serving_unit = props.route.params?.currentValues?.serving_unit || ingredient.serving_unit
  const altMeasure = ingredient?.alt_measures?.find((m) => {
    return m.measure === serving_unit
  })

  // const [baseQuantity, setBaseQuantity] = useState(ingredient.serving_qty)
  const [amount, setAmount] = useState(props.route.params?.currentValues?.quantity || ingredient.serving_qty)
  // const [serving, setServing] = useState('standard')
  const [showPicker, setShowPicker] = useState(false)
  const [servingUnit, setServingUnit] = useState(props.route.params?.currentValues?.serving_unit)
  const [servingWeight, setServingWeight] = useState(
    altMeasure ? altMeasure?.serving_weight / altMeasure?.qty : (ingredient.serving_weight_grams || 1) / ingredient.serving_qty,
  )
  const [dirty, setDirty] = useState(false)

  const addFood = (ingredient) => {
    const multiplier = amount * (servingWeight / (ingredient.serving_weight_grams || 1))

    const ingredientToSave = {
      id: ingredient.nix_item_id || ingredient.food_name,
      date: day,
      meal_time_slot_id: props.route.params?.mealSlotId || slot,
      quantity: amount || ingredient.serving_qty,
      protein: (ingredient.protein || 0) * multiplier,
      serving_unit: servingUnit || ingredient.serving_unit,
      carbs: (ingredient.total_carbohydrate || 0) * multiplier,
      fats: (ingredient.total_fat || 0) * multiplier,
      calories: ingredient.calories * multiplier,
      // meal_ingredient_id: ingredient.meal_ingredient_id,
    }
    // console.log('CONTEXT', ingredientsOnly)
    if (!ingredientsOnly) {
      api.eating
        .storeIngredient({
          ingredient: ingredientToSave,
        })
        .then((d) => {
          storeItemHistory({
            item: {
              ...ingredientToSave,
              serving_weight_grams: ingredient.serving_weight_grams * multiplier,
              nix_item_id: ingredient.nix_item_id,
              base_id: ingredientToSave.id,
              brand_name: ingredient.brand_name,
              name: ingredient.food_name,
              thumb_img_url: ingredient.photo.thumb,
              type: 'ingredient',
            },
          })
          storeMealPlan({
            date: day,
            data: d.data,
          })
          props.navigation.navigate('MealPlan')
        })
    } else {
      if (
        currentRecipe.ingredients.find(
          (x) => x.nix_item_id.toLowerCase() === (ingredient.nix_item_id || ingredient.food_name).toLowerCase(),
        )
      ) {
        setErrorMessage({
          error: 'The ingredient you selected is already in this recipe.',
        })
      } else {
        addIngredient({
          ingredient: {
            ...ingredientToSave,
            name: ingredient.food_name,
            brand_name: ingredient.brand_name,
            base_ingredient_id: ingredientToSave.id,
            nix_item_id: ingredientToSave.id,
          },
        })
        storeItemHistory({
          item: {
            ...ingredientToSave,
            base_id: ingredientToSave.id,
            brand_name: ingredient.brand_name,
            name: ingredient.food_name,
            thumb_img_url: ingredient.photo.thumb,
            type: 'ingredient',
          },
        })

        props.navigation.navigate('IndividualRecipe')
      }
    }
  }

  const updateFood = (ingredient) => {
    //console.log('ingredient!', ingredient)

    const multiplier = amount * (servingWeight / (ingredient.serving_weight_grams || 1))

    const ingredientToSave = {
      id: ingredient.id,
      meal_time_slot_id: props.route.params?.currentValues?.meal_time_slot_id,
      quantity: amount || ingredient.serving_qty,
      protein: (ingredient.protein || 0) * multiplier,
      serving_unit: servingUnit || ingredient.serving_unit,
      carbs: (ingredient.total_carbohydrate || 0) * multiplier,
      fats: (ingredient.total_fat || 0) * multiplier,
      calories: ingredient.calories * multiplier,
    }

    api.eating.updateDiaryIngredient(day, ingredientToSave).then((d) => {
      storeItemHistory({
        item: {
          ...ingredientToSave,
          id: ingredient.nix_item_id || ingredient.food_name,
          nix_item_id: ingredient.nix_item_id,
          base_id: ingredientToSave.base_ingredient_id || ingredientToSave.id,
          brand_name: ingredient.brand_name,
          name: ingredient.food_name,
          thumb_img_url: ingredient.photo.thumb,
          type: 'ingredient',
        },
      })
      storeMealPlan({
        date: day,
        data: d.data,
      })
      props.navigation.navigate('MealPlan')
    })
  }

  const multiplier = amount * (servingWeight / (ingredient.serving_weight_grams || 1))

  return (
    <>
      {(!ingredient.id || (ingredient.id && dirty)) && (
        <LinearGradient
          colors={[globals.styles.colors.colorTransparentWhite15, globals.styles.colors.colorWhite]}
          style={styles.buttonContainer}>
          <View style={styles.buttonContainerView}>
            <TouchableOpacity style={styles.addFoodBtn} onPress={ingredient.id ? () => updateFood(ingredient) : () => addFood(ingredient)}>
              <Text style={styles.buttonText}>{ingredient.id ? 'UPDATE' : 'ADD FOOD'}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      )}
      <ScrollView style={styles.homeContainer}>
        <View style={styles.foodImg}>
          <Image source={{ uri: ingredient.photo.thumb }} style={styles.imageThumb} />
        </View>
        <Text style={styles.foodTitle}>{ingredient.food_name.toUpperCase()}</Text>
        <Text style={styles.foodType}>{ingredient.brand_name}</Text>
        <View style={styles.selectContainer}>
          <View style={styles.selectContainerColumn}>
            <Text style={styles.servingSize}>Serving Size:</Text>
            <TouchableOpacity
              onPress={ingredient.alt_measures ? () => setShowPicker(true) : null}
              // onPress={ingredient.alt_measures ? () => this.setState({ showPicker: true }) : null}
              style={styles.showPickerButton}>
              <Text>{servingUnit || ingredient.serving_unit}</Text>
              {ingredient.alt_measures && <ChevronDown color={globals.styles.colors.colorBlack} />}
            </TouchableOpacity>
          </View>
          <View style={styles.servingSelection}>
            <View style={styles.servingSelectionColumn}>
              <Text style={styles.servingNumber}>Number of Servings:</Text>
              <TextInput
                keyboardType="decimal-pad"
                defaultValue={(+parseFloat(amount || ingredient.serving_qty).toFixed(2)).toString()}
                style={styles.textInput}
                returnKeyType={'done'}
                onChangeText={() => {}}
                onSubmitEditing={({ nativeEvent: { text } }) => {
                  setAmount(parseFloat(text))
                  setDirty(true)
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.nutritionFactsHeader}>
          <Text style={styles.nutritionHeaderText}>Nutrition Facts</Text>
        </View>
        <NutritionFacts recipe={ingredient} mpr={mpr} eatingPreferences={eatingPreferences} goal={goal} multiplier={multiplier} />
        <View style={{ height: !ingredient.id || (ingredient.id && dirty) ? 110 : 30 }} />
      </ScrollView>

      {ingredient.alt_measures && (
        <SinglePickerModal
          items={ingredient.alt_measures.map((m) => ({ text: m.measure, value: m }))}
          selectedIndex={ingredient.alt_measures.findIndex((x) => x.measure === (servingUnit || ingredient.serving_unit))}
          onValueChange={(val) => {
            if (val) {
              setAmount(val.value.qty)
              setServingWeight(val.value.serving_weight / val.value.qty)
              setServingUnit(val.value.measure)
              setDirty(true)
            }
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
          visible={showPicker}
        />
      )}
    </>
  )
}

export default FoodMacros
