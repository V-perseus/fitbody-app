import React, { useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { View, FlatList, Text, Image } from 'react-native'
import moment from 'moment'
import { useFocusEffect } from '@react-navigation/native'

// styles
import styles from './styles'
import globals from '../../../../config/globals'

// Components
import MealPlanCard from '../../../../components/MealPlanCard'
import MealPlanModal from '../../../../components/MealPlanModal'
import { ButtonIcon } from '../../../../components/Buttons/ButtonIcon'

// assets
import FilterIcon from '../../../../../assets/images/svg/icon/16px/filter.svg'
import LoadingGif from '../../../../../assets/gif/loading.gif'

// services
import { listMealSets, storeMealPlan, storeItemHistory, storeFilter } from '../../../../data/meal_plan'
import api from '../../../../services/api'
import { addMealsetToFavorites, removeMealsetFromFavorites } from '../../../../data/meal_plan'

const RecommendedMealPlans = ({ navigation }) => {
  const mealSets = useSelector((state) => state.data.meal.mealSets || [])
  const mealDate = useSelector((state) => state.data.meal.day)
  const favorites = useSelector((state) => state.data.meal.favorites || [])
  const filter = useSelector((state) => state.data.meal.filters?.mealPlans)
  const eatingPreferences = useSelector((state) => state.data.user.eating_preferences)
  const isLoading = useSelector((state) => state.data.meal.isLoading)
  const dayArray = useMemo(() => moment(mealDate).toArray(), [mealDate])
  const mealPlan = useSelector(
    (state) => state.data.meal.mealPlans?.[dayArray[0].toString()]?.[dayArray[1].toString()]?.[dayArray[2].toString()],
  )

  const [selectedMealSet, setSelectedMealSet] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const filteredMealsets = mealSets?.filter((m) => m.total_calories > 0)

  // useEffect(() => {
  //   if (!filter || !filter.eatingPreferences) {
  //     const newFilter = {
  //       mealPlans: {
  //         favoritesOnly: false,
  //         eatingPreferences: {
  //           Regular: eatingPreferences.find((x) => x.key === 'REGULAR') ? true : false,
  //           Vegan: eatingPreferences.find((x) => x.key === 'VEGAN') ? true : false,
  //           Vegetarian: eatingPreferences.find((x) => x.key === 'VEGETARIAN') ? true : false,
  //           Pescatarian: eatingPreferences.find((x) => x.key === 'PESCATARIAN') ? true : false,
  //           Keto: eatingPreferences.find((x) => x.key === 'KETO') ? true : false,
  //           'Dairy-Free': eatingPreferences.find((x) => x.key === 'DAIRY-FREE') ? true : false,
  //           'Gluten-Free': eatingPreferences.find((x) => x.key === 'GLUTEN-FREE') ? true : false,
  //           Mediterranean: eatingPreferences.find((x) => x.key === 'MEDITERRANEAN') ? true : false,
  //         },
  //       },
  //     }

  //     storeFilter(newFilter)
  //   }
  // }, [filter, eatingPreferences])

  useFocusEffect(
    useCallback(() => {
      if (filter !== undefined) {
        listMealSets(filter)
      } else if (!filter || !filter.eatingPreferences) {
        const newFilter = {
          mealPlans: {
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

        storeFilter(newFilter)
      }
    }, [filter, eatingPreferences]),
  )

  const addSetHandler = (mealSetId) => {
    if (mealPlan) {
      setSelectedMealSet(mealSetId)
      setShowModal(true)
    } else {
      addIt(mealSetId)
    }
  }

  const closeModal = () => {
    setSelectedMealSet(null)
    setShowModal(false)
  }

  const openRecipe = (mealplan, recipe) => {
    api.eating.recipeDetails({ mealplan, recipe: recipe.id }).then((data) => navigation.navigate('Recipe', { recipe: data }))
  }

  const addIt = (mealSet) => {
    api.eating
      .storeMealSet(
        {
          date: mealDate,
          meal_set_id: mealSet.id,
        },
        false,
      )
      .then((data) => {
        storeItemHistory({
          item: {
            id: mealSet.id,
            base_id: mealSet.id,
            name: mealSet.name,
            total_calories: mealSet.total_calories,
            total_fats: mealSet.total_fats,
            total_protein: mealSet.total_protein,
            total_carbs: mealSet.total_carbs,
            recipes: mealSet.recipes,
            type: 'meal_set',
          },
        })

        setShowModal(false)
        storeMealPlan({ date: mealDate, data: data.data })
        navigation.navigate('MealPlan')
      })
  }

  const toggleFavorite = async (id, name, current) => {
    if (!current) {
      addMealsetToFavorites(id)
    } else {
      removeMealsetFromFavorites(id)
    }
  }

  // console.log('mealSets', mealSets)

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>MEAL PLAN</Text>
        <ButtonIcon
          onPress={() => navigation.navigate('Filter', { filterType: 'mealPlans' })}
          text="FILTER"
          style={styles.veganBtn}
          textStyle={styles.veganText}
          leftIcon={() => <FilterIcon color={globals.styles.colors.colorBlack} />}
          pressedOpacity={0.5}
        />
      </View>
      <Text style={styles.description}>
        These meal sets are ideal for those who want to follow a structured meal plan with pre-calculated portions according to their daily
        macronutrient and caloric needs. These meals can not be edited or changed.
      </Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Image source={LoadingGif} style={{ height: 54 }} resizeMode="contain" />
        </View>
      ) : filteredMealsets.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.mealSetsContainer}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={2}
          data={filteredMealsets}
          renderItem={({ item }) => (
            <MealPlanCard
              toggleFavorite={toggleFavorite}
              favorites={favorites}
              plan={item}
              handleRecipeClick={(recipe) => openRecipe(item.id, recipe)}
              handleAddSet={() => addSetHandler(item)}
            />
          )}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No results found.{'\n'}Please try a different filter.</Text>
        </View>
      )}

      <MealPlanModal
        showModal={showModal}
        modalText={"This will replace today's\nexisting entries."}
        noButtonText={'NEVER MIND'}
        yesButtonText={'ADD SET'}
        noButtonPressHandler={closeModal}
        yesButtonPressHandler={() => addIt(selectedMealSet)}
        onClose={closeModal}
      />
    </View>
  )
}

export default RecommendedMealPlans
