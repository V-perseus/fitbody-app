import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'

// Assets
import StarOutlineIcon from '../../../../../assets/images/svg/icon/24px/star-outline.svg'
import StarIcon from '../../../../../assets/images/svg/icon/24px/star.svg'

import globals from '../../../../config/globals'

// Services
import api from '../../../../services/api'
import { storeMealPlan, storeFavorites, storeItemHistory } from '../../../../data/meal_plan'

// Components
import FoodItem from '../../../../components/FoodItem'
import RecipeCard from '../../../../components/RecipeCard'
import MealPlanModal from '../../../../components/MealPlanModal'
import NutritionFacts from '../../../../components/NutritionFacts'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

const MealsetDetails = (props) => {
  const mealSet = props.route.params?.mealSet

  const mpr = useSelector((state) => state.data.user.mpr)
  const eatingPreferences = useSelector((state) => state.data.user.eating_preferences)
  const goal = useSelector((state) => state.data.user.goal)

  const day = useSelector((state) => state.data.meal.day)
  const favorites = useSelector((state) => state.data.meal.favorites)

  const [showModalMealPlan, setShowModalMealPlan] = useState(false)

  const [favorite, setFavorite] = useState(favorites.find((f) => f.type === 'meal_set' && (f.id === mealSet.id || f.name === mealSet.name)))

  useEffect(() => {
    props.navigation.setOptions({
      headerForceInset: { top: 'always' },
      headerTitle: () => <Text style={globals.header.headerTitleStyle}>MEAL SET</Text>,
      headerLeft: () => <HeaderButton onPress={() => props.navigation.goBack()} />,
      headerRight: () => (
        <TouchableOpacity
          style={{
            height: 24,
            backgroundColor: globals.styles.colors.colorWhite,
            marginRight: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={toggleFavorite}>
          {favorite ? <StarIcon color={globals.styles.colors.colorYellow} /> : <StarOutlineIcon color={globals.styles.colors.colorBlack} />}
        </TouchableOpacity>
      ),
    })
  }, [props.navigation, favorite])

  const toggleFavorite = async () => {
    console.log('old value: ', favorite)
    setFavorite(!favorite)

    let resp
    if (!favorite) {
      resp = await api.eating.addMealSetToFavorites({ id: mealSet.id })
      storeFavorites({ data: resp.data })
    } else {
      let resp2
      for (const fav of favorites.filter((f) => f.type === 'meal_set' && f.name === mealSet.name)) {
        resp2 = await api.eating.removeMealSetFromFavorites({ id: fav.id })
      }
      storeFavorites({ data: resp2.data })
    }
  }

  const openRecipe = (mealplan, recipe) => {
    console.log('---booooo')

    api.eating.recipeDetails({ mealplan, recipe: recipe.id }).then((data) => props.navigation.navigate('Recipe', { recipe: data }))
  }

  async function save() {
    try {
      const resp = await api.eating.storeMealSet(
        {
          date: day,
          meal_set_id: mealSet.id,
        },
        false,
      )
      storeItemHistory({ item: { ...mealSet, base_id: mealSet.id, type: 'meal_set' } })
      storeMealPlan({ date: day, data: resp.data })
      setShowModalMealPlan(false)
      props.navigation.navigate('MealPlan')
    } catch (error) {
      // caught in global error handler
    }
  }

  return (
    <>
      <View style={{ paddingHorizontal: 24, borderTopWidth: 1, borderBottomWidth: 1, borderColor: globals.styles.colors.colorGray }}>
        <FoodItem
          favorites={[]}
          food={{ ...mealSet, type: 'meal_set', is_favorite: false }}
          handleAdd={() => setShowModalMealPlan(true)}
          handlePress={() => {}}
        />
      </View>
      <NutritionFacts
        recipe={{
          calories: mealSet.total_calories,
          fats: mealSet.total_fats,
          protein: mealSet.total_protein,
          carbs: mealSet.total_carbs,
        }}
        macrosOnly={true}
        mpr={0}
        isRecipe={true}
        eatingPreferences={eatingPreferences}
        goal={goal}
        multiplier={1}
      />
      <LinearGradient colors={['#0000000e', '#00000000']} style={{ height: 40, marginBottom: -40 }} />
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: 8,
          paddingBottom: 30,
          marginHorizontal: 16,
        }}>
        {(mealSet.recipes || mealSet.items).map((r, idx) => (
          <RecipeCard
            key={idx}
            set={r}
            inMealset={true}
            handleRecipeClick={(id) => openRecipe(mealSet.id, id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </ScrollView>
      <MealPlanModal
        showModal={showModalMealPlan}
        modalText={"This will replace today's\nexisting entries."}
        noButtonText={'NEVER MIND'}
        yesButtonText={'ADD SET'}
        noButtonPressHandler={() => setShowModalMealPlan(false)}
        yesButtonPressHandler={save}
        onClose={() => setShowModalMealPlan(false)}
      />
    </>
  )
}

export default MealsetDetails
