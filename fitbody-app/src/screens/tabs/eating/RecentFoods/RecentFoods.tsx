import React, { useState, useMemo, useContext, useCallback, useEffect } from 'react'
import { View, TouchableOpacity, Text, SectionList } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import * as _ from 'lodash'

// styles
import styles from './styles'
import globals from '../../../../config/globals'

// Components
import FoodItem from '../../../../components/FoodItem'
import EditedRecipeModal from '../../../../components/MealPlanModal/EditedRecipeModal'
import MealPlanModal from '../../../../components/MealPlanModal'
import SearchIcon from '../../../../../assets/images/svg/icon/24px/search.svg'
import BarcodeIcon from '../../../../../assets/images/svg/icon/24px/barcode.svg'
import { SearchBar } from '../../../../components/SearchBar/SearchBar'

// Data
import {
  storeMealPlan,
  storeItemHistory,
  storeFavorites,
  addIngredient,
  addEasyAddIngredient,
  editRecipe,
} from '../../../../data/meal_plan'

// Services
import api from '../../../../services/api'
import { usePersistedState } from '../../../../services/hooks/usePersistedState'
import { setErrorMessage } from '../../../../services/error'
import { useAppSelector } from '../../../../store/hooks'
import { useInit } from '../../../../services/hooks/useInit'

// Types
import { IBaseRecipe, IEasyAddRecipeIngredient, RecipeType } from '../../../../data/meal_plan/types'
import { RecentFoodsScreenNavigationProps } from '../../../../config/routes/routeTypes'

type SectionType = {
  data: any
  expanded: boolean
  key: string
  title: string
}

interface IRecentFoodsProps extends RecentFoodsScreenNavigationProps {}
const RecentFoods: React.FC<IRecentFoodsProps> = ({ navigation }) => {
  const ingredientsOnly = useAppSelector((state) => state.data.meal.ingredientsOnly)

  const screenName = useMemo(() => (ingredientsOnly ? 'ingredientSearch' : 'fullSearch'), [ingredientsOnly])
  // const persistedState = useAppSelector((state) => state.data.meal.persistedScreenState[screenName])

  // const [searchKeyword, setSearchKeyword] = usePersistedState(screenName, 'searchKeyword', '')
  const [searchKeyword, setSearchKeyword] = useState('')
  // const [searchMode, setSearchMode] = usePersistedState(screenName, 'searchMode', 'HISTORY')
  const [searchMode, setSearchMode] = useState('HISTORY')
  const [recentFoods, setRecentFoods] = usePersistedState(screenName, 'recentFoods', [])
  const [showModal, setShowModal] = usePersistedState(screenName, 'showModal', false)
  const [showModalAdd, setShowModalAdd] = usePersistedState(screenName, 'showModalAdd', false)
  const [selectedRecipe, setSelectedRecipe] = usePersistedState(screenName, 'selectedRecipe', null)
  const [allFoods, setAllFoods] = usePersistedState(screenName, 'allFoods', {})

  const [selectedMealPlan, setSelectedMealPlan] = useState(null)
  const [showModalMealPlan, setShowModalMealPlan] = useState(false)

  const mealSlot = useAppSelector((state) => state.data.meal.mealTimeSlot)
  const favorites = useAppSelector((state) => state.data.meal.favorites)
  const history = useAppSelector((state) => state.data.meal.history)
  const day = useAppSelector((state) => state.data.meal.day)
  const currentRecipe = useAppSelector((state) => state.data.meal.currentRecipe)

  useFocusEffect(
    useCallback(() => {
      if (!favorites) {
        api.eating.listFavorites().then((favs) => storeFavorites({ data: favs.data }))
      }

      // if (!persistedState) {
      //   showHistory()
      // }
    }, [favorites]),
  )

  const showHistory = useCallback(() => {
    const ingredients = history
      .filter((x) => x !== null && (ingredientsOnly ? ['easy_add_recipe', 'ingredient'].includes(x.type) : true))
      .map((k) => ({ ...k, key: `${k.type}_${k.id}` }))

    const newAllFoods = {
      all: ingredients,
    }

    setSearchMode('HISTORY')
    setSearchKeyword('')
    setAllFoods(newAllFoods)
    setRecentFoods([
      {
        key: 'all',
        title: 'all',
        data: ingredients,
        expanded: true,
      },
    ])
  }, [history, ingredientsOnly, setAllFoods, setRecentFoods, setSearchKeyword, setSearchMode])

  const [triggerShowHistory] = useInit(showHistory)

  useEffect(() => {
    triggerShowHistory()
  }, [history])

  function filterRecentFoodsHistory(text: string) {
    setSearchKeyword(text)

    if (text.length === 0) {
      triggerShowHistory()
    } else if (allFoods.all && allFoods.all?.length > 0) {
      const newIngredients = allFoods.all.filter((x) => (x.name ? x.name.toLowerCase().includes(text.toLowerCase()) : true))

      setRecentFoods([
        {
          key: 'all',
          title: 'all',
          data: newIngredients,
          expanded: true,
        },
      ])
    }
  }

  const debouncedRecentFoodsHistory = useMemo(() => _.debounce(filterRecentFoodsHistory, 500), [])

  useEffect(() => {
    return () => debouncedRecentFoodsHistory.cancel()
  }, [debouncedRecentFoodsHistory])

  async function searchNx() {
    if (!searchKeyword) {
      return
    }
    const ingredients = await api.eating.ingredientSearch({ query: searchKeyword })

    const easyAdds = await api.eating.searchEasyAdds({ query: searchKeyword })

    const data = {
      common: ingredients.common.map((i) => ({ ...i, type: 'ingredient' })),
      branded: ingredients.branded.map((i) => ({ ...i, type: 'ingredient' })),
    }

    setSearchMode('SEARCH RESULTS')
    setAllFoods(data)
    setRecentFoods([
      { key: 'common', title: 'Common Foods', data: data.common.slice(0, 5), expanded: data.common.length <= 5 },
      { key: 'branded', title: 'Branded Foods', data: data.branded.slice(0, 5), expanded: data.branded.length <= 5 },
      {
        key: 'easyadds',
        title: 'Easy Adds',
        data: easyAdds.data.map((x) => ({ ...x, base_id: x.id, type: 'easy_add_recipe' })),
        expanded: true,
      },
    ])
  }

  const handleAddFood = async (id: string, item, isBranded: boolean) => {
    if (item.type === 'recipe') {
      if (item.user_generated) {
        setSelectedRecipe(item)
        setShowModal(true)
      } else {
        addRecipe(false, item)
      }
    } else if (item.type === 'easy_add_recipe') {
      if (!ingredientsOnly) {
        api.eating
          .addEasyAddToDiary({
            date: day,
            easy_add_recipe_id: item.base_easy_add_recipe_id || item.id,
            meal_time_slot_id: mealSlot,
          })
          .then((resp) => {
            storeItemHistory({ item })
            storeMealPlan({ date: day, data: resp.data })
            navigation.navigate('MealPlan')
          })
      } else {
        addEasyAddIngredient({ ingredient: item })
        storeItemHistory({ item })
        navigation.navigate('IndividualRecipe')
      }
    } else if (item.type === 'meal_set') {
      setSelectedMealPlan(item)
      setShowModalMealPlan(true)
    } else {
      let itemToAdd = item

      if (!item.id) {
        itemToAdd = await api.eating.ingredientDetails({ id })
      }

      const ingredient = {
        id: itemToAdd.id || itemToAdd.nix_item_id || itemToAdd.food_name,
        date: day,
        meal_time_slot_id: mealSlot,
        quantity: itemToAdd.quantity || itemToAdd.serving_qty,
        protein: itemToAdd.protein || 0,
        serving_unit: itemToAdd.serving_unit,
        carbs: itemToAdd.carbs || itemToAdd.total_carbohydrate || 0,
        fats: itemToAdd.fats || itemToAdd.total_fat || 0,
        calories: itemToAdd.calories || 0,
      }

      if (!ingredientsOnly) {
        api.eating
          .storeIngredient({
            ingredient,
          })
          .then((d) => {
            storeItemHistory({ item })
            storeMealPlan({ date: day, data: d.data })
            navigation.navigate('MealPlan')
          })
      } else {
        if (
          currentRecipe?.ingredients?.find(
            (x) => x.nix_item_id.toLowerCase() === (itemToAdd.id || itemToAdd.nix_item_id || itemToAdd.food_name).toLowerCase(),
          )
        ) {
          setErrorMessage({
            error: 'The ingredient you selected is already in this recipe.',
          })
        } else {
          addIngredient({
            ingredient: {
              ...itemToAdd,
              base_ingredient_id: itemToAdd.base_id,
              nix_item_id: itemToAdd.base_id,
              img_url: itemToAdd.thumb_img_url,
            },
          })
          storeItemHistory({
            item: {
              ...itemToAdd,
              base_ingredient_id: itemToAdd.base_id,
              nix_item_id: itemToAdd.base_id,
              img_url: itemToAdd.thumb_img_url,
            },
          })

          navigation.navigate('IndividualRecipe')
        }
      }
    }
  }

  async function addMealPlan() {
    try {
      const resp = await api.eating.storeMealSet(
        {
          date: day,
          meal_set_id: selectedMealPlan.id,
        },
        false,
      )
      storeItemHistory({ item: selectedMealPlan })
      storeMealPlan({ date: day, data: resp.data })
      setShowModalMealPlan(false)
      navigation.navigate('MealPlan')
    } catch (error) {}
  }

  async function addRecipe(openBase = false, recipe = null) {
    try {
      const item = recipe || selectedRecipe
      const resp = await api.eating.addRecipeToDiary(
        {
          date: day,
          recipe_id: openBase ? item.original_recipe_id : item.base_id,
          meal_time_slot_id: mealSlot,
        },
        false,
      )
      storeItemHistory({
        item: {
          id: openBase ? item.original_recipe_id : item.id,
          base_id: openBase ? item.original_recipe_id : item.id,
          name: item.name,
          thumb_img_url: item.thumb_img_url,
          type: RecipeType.recipe,
          user_generated: item.user_generated,
          original_recipe_id: openBase ? null : item.original_recipe_id,
        },
      })
      storeMealPlan({ date: day, data: resp.data })
      setShowModalAdd(false)
      navigation.navigate('MealPlan')
    } catch (error) {
      setShowModalAdd(false)
      console.log('ERROR', error)
    }
  }

  async function openRecipe(openBase = false, recipe: IBaseRecipe | null = null) {
    try {
      const recipeId = openBase ? (recipe || selectedRecipe).original_recipe_id : (recipe || selectedRecipe).base_id
      if (recipeId === undefined) {
        return
      }
      const data = await api.eating.individualRecipeDetails({ recipe: recipeId! }, false)

      editRecipe({ recipe: data.data })
      setShowModal(false)
      navigation.navigate('IndividualRecipe')
    } catch (error) {
      setShowModal(false)
      console.log('ERROR', error)
    }
  }

  const handleSelectFood = (id: string, item: any, isBranded: boolean) => {
    if (item.type === 'recipe') {
      if (item.user_generated) {
        setSelectedRecipe(item)
        setShowModal(true)
      } else {
        openRecipe(false, item)
      }
    } else if (item.type === 'easy_add_recipe') {
      navigation.navigate('EasyAdd', { easyAdd: item as IEasyAddRecipeIngredient, addAfterUpdate: true })
    } else if (item.type === 'meal_set') {
      navigation.navigate('MealsetDetails', { mealSet: item })
    } else {
      const { quantity, serving_unit } = item

      api.eating.ingredientDetails({ id: item.brand_name ? item.nix_item_id || item.id : item.name || item.food_name }).then((data) => {
        let ingredient = data
        if (isBranded) {
          ingredient = { ...data, nix_item_id: id }
        }
        const ingredientToOpen = { ...ingredient } //, ...item }
        // @ts-expect-error
        delete ingredientToOpen.id

        navigation.navigate('FoodMacros', {
          ingredient: ingredientToOpen,
          currentValues: { quantity, serving_unit },
          mealSlotId: undefined,
        })
      })
    }
  }

  const expandSearch = (title: string) => {
    setRecentFoods([
      {
        title: 'Common Foods',
        data: title === 'Common Foods' || recentFoods[0].expanded ? allFoods.common : allFoods.common.slice(0, 5),
        expanded: recentFoods[0].expanded || title === 'Common Foods',
      },
      {
        title: 'Branded Foods',
        data: title === 'Branded Foods' || recentFoods[1].expanded ? allFoods.branded : allFoods.branded.slice(0, 5),
        expanded: recentFoods[1].expanded || title === 'Branded Foods',
      },
      recentFoods[2],
    ])
  }

  const validatedRecentFoods: SectionType[] = recentFoods.every((rf: SectionType) => rf.data?.length === 0) ? [] : recentFoods

  function renderSectionHeader({ section: { title, data } }: { section: SectionType }) {
    if (data.length > 0 && title !== 'all') {
      return (
        <View
          style={{
            flex: 1,
            height: 35,
            marginHorizontal: -27,
            backgroundColor: globals.styles.colors.colorGrayLight,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{ fontSize: 12, fontFamily: globals.fonts.primary.boldStyle.fontFamily, color: globals.styles.colors.colorGrayDark }}>
            {title}
          </Text>
        </View>
      )
    } else {
      return null
    }
  }

  function renderSectionFooter({ section: { title, expanded } }: { section: SectionType }) {
    return expanded ? null : (
      <TouchableOpacity onPress={() => expandSearch(title)} style={{ flex: 1, height: 45, justifyContent: 'center' }}>
        <Text style={{ fontSize: 14, fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, color: globals.styles.colors.colorPink }}>
          Show More: {title}
        </Text>
      </TouchableOpacity>
    )
  }

  function renderItem({ item, section }: { item: any; section: SectionType }) {
    return (
      <FoodItem
        favorites={favorites}
        key={item.nix_item_id?.toString()}
        food={item}
        handleAdd={
          section.title === 'all' || section.title === 'Easy Adds'
            ? (id) => handleAddFood(id, item, section.title === 'Branded Foods')
            : (id) => handleSelectFood(id, item, section.title === 'Branded Foods')
        }
        handlePress={(id) => handleSelectFood(id, item, section.title === 'Branded Foods')}
      />
    )
  }

  function listFooterComponent() {
    return searchKeyword.length > 0 && searchMode === 'HISTORY' ? (
      <TouchableOpacity onPress={searchNx} style={styles.searchAllContainer}>
        <SearchIcon height={20} width={20} color={globals.styles.colors.colorPink} />
        <Text style={styles.searchAllText}>Search All Foods for: {searchKeyword}</Text>
      </TouchableOpacity>
    ) : null
  }

  function listEmptyComponent() {
    return searchKeyword.length > 0 ? null : (
      <View style={styles.warningContainer}>
        <Text style={styles.warningText}>{'Use the search bar or barcode\nscanner to start entering your\nfavorite ingredients!'}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SearchBar
          containerStyle={styles.searchContainer}
          onSearch={debouncedRecentFoodsHistory}
          placeholder="Search for a food"
          onSubmitEditing={searchNx}
          onCancel={showHistory}
        />
        <TouchableOpacity style={styles.barcodeIcon} onPress={() => navigation.navigate('BarcodeScan')}>
          <BarcodeIcon width={26} height={26} color={globals.styles.colors.colorBlack} />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{searchMode}</Text>
      </View>
      <View style={styles.divider} />
      <SectionList
        contentContainerStyle={styles.foodsContainer}
        sections={validatedRecentFoods}
        keyExtractor={(item, idx) => `${item.food_name}_${idx}`}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        renderItem={renderItem}
        ListFooterComponent={listFooterComponent}
        ListEmptyComponent={listEmptyComponent}
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

export default RecentFoods
