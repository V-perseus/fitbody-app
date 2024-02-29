import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { View, Text, FlatList } from 'react-native'
import * as _ from 'lodash'

// styles
import styles from './styles'

// Components
import FoodItem from '../../../../components/FoodItem'
import EditedRecipeModal from '../../../../components/MealPlanModal/EditedRecipeModal'
import MealPlanModal from '../../../../components/MealPlanModal'

// Data
import api from '../../../../services/api'
import { storeMealPlan, storeFavorites, editRecipe, storeItemHistory, addEasyAddIngredient } from '../../../../data/meal_plan'
import { useInit } from '../../../../services/hooks/useInit'

const Favorites = (props) => {
  const mealSlot = useSelector((state) => state.data.meal.mealTimeSlot)
  const day = useSelector((state) => state.data.meal.day)
  const favorites = useSelector((state) => state.data.meal.favorites) || []
  const ingredientsOnly = useSelector((state) => state.data.meal.ingredientsOnly)

  const [showModal, setShowModal] = useState(false)
  const [showModalAdd, setShowModalAdd] = useState(false)
  const [showModalMealPlan, setShowModalMealPlan] = useState(false)

  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [selectedMealPlan, setSelectedMealPlan] = useState(null)

  const loadFavorites = () => {
    if (favorites.length === 0) {
      api.eating.listFavorites().then((favs) => storeFavorites({ data: favs.data }))
    }
  }

  useInit(loadFavorites)

  const handleAddFood = (id, item, isBranded) => {
    if (item.type === 'recipe') {
      if (item.user_generated) {
        setSelectedRecipe(item)
        setShowModalAdd(true)
      } else {
        addRecipe(false, item)
      }
      // api
      //   .eating
      //   .addRecipeToDiary({
      //     date: day,
      //     recipe_id: item.id,
      //     meal_time_slot_id: mealSlot,
      //   })
      //   .then((resp) => {
      //     dispatch(storeMealPlan({ date: day, data: resp.data }))
      //     props.navigation.navigate('MealPlan')
      //   })
    } else if (item.type === 'easy_add_recipe') {
      if (!ingredientsOnly) {
        api.eating
          .addEasyAddToDiary({
            date: day,
            easy_add_recipe_id: item.id,
            meal_time_slot_id: mealSlot,
          })
          .then((resp) => {
            storeItemHistory({ item: { ...item, base_id: item.id } })
            storeMealPlan({ date: day, data: resp.data })
            props.navigation.navigate('MealPlan')
          })
      } else {
        api.eating.easyAddDetails(item.id).then((data) => {
          addEasyAddIngredient({ ingredient: { ...data.data, type: 'easy_add_recipe', base_id: data.data.id } })
          storeItemHistory({ item: { ...data.data, type: 'easy_add_recipe', base_id: data.data.id } })
          props.navigation.navigate('IndividualRecipe')
        })
      }
    } else if (item.type === 'meal_set') {
      setSelectedMealPlan(item)
      setShowModalMealPlan(true)
    } else {
      const { quantity, serving_unit } = item

      api.eating.ingredientDetails({ id }).then((data) => {
        let ingredient = data
        if (isBranded) {
          ingredient = { ...data, nix_item_id: id }
        }
        props.navigation.navigate('FoodMacros', { ingredient, currentValues: { quantity, serving_unit } })
      })
    }
  }

  const addMealPlan = () => {
    setShowModalMealPlan(false)

    api.eating
      .mealSetDetailsNew({ mealplan: selectedMealPlan.id })
      .then((data) => storeItemHistory({ item: { ...data.data, base_id: data.data.id, type: 'meal_set' } }))

    api.eating
      .storeMealSet({
        date: day,
        meal_set_id: selectedMealPlan.id,
      })
      .then((resp) => {
        storeMealPlan({ date: day, data: resp.data })
        props.navigation.navigate('MealPlan')
      })
  }

  const openRecipe = async (openBase = false, recipe = null) => {
    setShowModal(false)

    let id = (recipe || selectedRecipe).id

    if (openBase) {
      const data = await api.eating.individualRecipeDetails({ recipe: id })
      id = data.data.original_recipe_id
    }

    api.eating.individualRecipeDetails({ recipe: id }).then((data) => {
      editRecipe({ recipe: data.data })
      props.navigation.navigate('IndividualRecipe')
    })
  }

  const addRecipe = async (openBase = false, recipe = null) => {
    setShowModalAdd(false)

    let id = (recipe || selectedRecipe).id

    const data = await api.eating.individualRecipeDetails({ recipe: id })

    if (openBase) {
      id = data.data.original_recipe_id
    }

    const resp = await api.eating.addRecipeToDiary({
      date: day,
      recipe_id: id,
      meal_time_slot_id: mealSlot,
    })

    storeItemHistory({
      item: {
        id: id,
        base_id: id,
        name: (recipe || selectedRecipe).name,
        thumb_img_url: data.data.thumb_img_url,
        type: 'recipe',
        user_generated: (recipe || selectedRecipe).user_generated,
        original_recipe_id: openBase ? null : data.data.original_recipe_id,
      },
    })
    storeMealPlan({ date: day, data: resp.data })
    props.navigation.navigate('MealPlan')
  }

  const handleSelectFood = (id, item, isBranded) => {
    if (item.type === 'recipe') {
      if (item.user_generated) {
        setSelectedRecipe(item)
        setShowModal(true)
      } else {
        openRecipe(false, item)
      }
    }
    if (item.type === 'easy_add_recipe') {
      api.eating.easyAddDetails(item.id).then((data) =>
        props.navigation.navigate('EasyAdd', {
          easyAdd: { ...data.data, base_id: data.data.id },
          ingredientsOnly: ingredientsOnly,
          addAfterUpdate: true,
        }),
      )
    } else if (item.type === 'meal_set') {
      api.eating
        .mealSetDetailsNew({ mealplan: item.id })
        .then((data) => props.navigation.navigate('MealsetDetails', { mealSet: data.data }))
    } else if (item.type === 'ingredient') {
      const { quantity, serving_unit, meal_ingredient_id } = item

      api.eating.ingredientDetails({ id }).then((data) => {
        let ingredient = data
        if (isBranded) {
          ingredient = { ...data, nix_item_id: id }
        }
        props.navigation.navigate('FoodMacros', { ingredient, currentValues: { quantity, serving_unit } })
      })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>FAVORITES</Text>
      </View>
      <View style={styles.divider} />
      <FlatList
        keyExtractor={(item, index) => `food-item-${index}`}
        contentContainerStyle={styles.foodsContainer}
        data={_.orderBy(
          ingredientsOnly ? favorites.filter((x) => x.type === 'easy_add_recipe') : favorites,
          ['type', 'created_at'],
          ['desc', 'desc'],
        )}
        renderItem={({ item }) => (
          <FoodItem
            favorites={[]}
            key={item.nix_item_id}
            food={item}
            handleAdd={(id) => handleAddFood(id, item, item.nix_item_id !== null)}
            handlePress={(id) => handleSelectFood(id, item, item.nix_item_id !== null)}
          />
        )}
        ListEmptyComponent={() => {
          return favorites.length > 0 ? null : (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                {'Loving a certain recipe or meal set?\nHit the star in the corner and your\nfavorites will appear under this tab!'}
              </Text>
            </View>
          )
        }}
      />
      <EditedRecipeModal
        showModal={showModal}
        yesButtonPressHandler={() => openRecipe(true)}
        noButtonPressHandler={() => openRecipe(false)}
        onClose={() => setShowModal(false)}
      />
      <EditedRecipeModal
        showModal={showModalAdd}
        yesButtonPressHandler={() => addRecipe(true)}
        noButtonPressHandler={() => addRecipe(false)}
        onClose={() => setShowModalAdd(false)}
      />
      <MealPlanModal
        showModal={showModalMealPlan}
        modalText={"This will replace today's\nexisting entries."}
        noButtonText={'NEVER MIND'}
        yesButtonText={'ADD SET'}
        noButtonPressHandler={() => setShowModalMealPlan(false)}
        yesButtonPressHandler={addMealPlan}
        onClose={() => setShowModalMealPlan(false)}
      />
    </View>
  )
}

export default Favorites
