import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { View, TouchableOpacity, Text, FlatList, Image } from 'react-native'
import * as _ from 'lodash'

// styles
import styles from './styles'
import globals from '../../../../config/globals'

// Components
import RecipeCard from '../../../../components/RecipeCard'
import EditedRecipeModal from '../../../../components/MealPlanModal/EditedRecipeModal'
import { SearchBar } from '../../../../components/SearchBar/SearchBar'
import { ButtonIcon } from '../../../../components/Buttons/ButtonIcon'

// assets
import LoadingGif from '../../../../../assets/gif/loading.gif'
import BarcodeIcon from '../../../../../assets/images/svg/icon/24px/barcode.svg'
import FilterIcon from '../../../../../assets/images/svg/icon/16px/filter.svg'
import AddCircleIcon from '../../../../../assets/images/svg/icon/16px/circle/add-outline.svg'

// services
import api from '../../../../services/api'
import { storeMealPlan, storeFilter, storeFavorites, storeItemHistory, editRecipe } from '../../../../data/meal_plan'

const RecipeSearch = ({ navigation }) => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const slot = useSelector((state) => state.data.meal.mealTimeSlot)
  const day = useSelector((state) => state.data.meal.day)
  const serverFavorites = useSelector((state) => state.data.meal.favorites || [])
  const [favorites, setFavorites] = useState(useMemo(() => serverFavorites, [serverFavorites]))
  const [recipes, setRecipes] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [paginationInfo, setPaginationInfo] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [showModalAdd, setShowModalAdd] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const filter = useSelector((state) => state.data.meal.filters?.recipes, _.isEqual)
  const eatingPreferences = useSelector((state) => state.data.user.eating_preferences)

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('loading mealsets')
  //     console.log('filter', filter)
  //     if (filter !== undefined && recipes.length === 0) {
  //       requestAnimationFrame(() => loadRecipes(filter, 1))
  //     }
  //   }, [dispatch, filter]),
  // )

  useEffect(() => {
    if (!filter || !filter.eatingPreferences) {
      const newFilter = {
        recipes: {
          favoritesOnly: false,
          mealTimes: {
            Breakfast: slot === 1,
            Lunch: slot === 2,
            Dinner: slot === 3,
            Snack: [4, 5, 6].includes(slot),
          },
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
  }, [filter, eatingPreferences, slot])

  useEffect(() => {
    setRecipes([])
    loadRecipes(filter, 1)
  }, [filter, searchKeyword])

  const loadRecipes = async (filters, page = 1) => {
    setLoading(true)
    if (filters !== undefined) {
      const prefs = filters?.eatingPreferences ?? {}
      const queryString = `page=${page}&favorites=${filters.favoritesOnly}&eating_preferences=${Object.keys(prefs)
        .filter((x) => prefs[x] === true)
        .join(',')}&meal_time_slots=${Object.keys(filters.mealTimes)
        .filter((x) => filters.mealTimes[x] === true)
        .join(',')}`

      let data
      if (searchKeyword) {
        data = await api.eating.searchRecipes(queryString, searchKeyword)
      } else {
        data = await api.eating.listRecipes(queryString)
      }

      setRecipes(page == 1 ? data.data : [...recipes, ...data.data])
      setPaginationInfo(data.meta.pagination)
      setTotal(data.meta.pagination.total)
      setLoading(false)
    }
  }

  const openRecipe = (openBase = false, recipe = null) => {
    // console.log('openBase', openBase)
    setShowModal(false)
    // console.log('recipe', recipe || selectedRecipe)
    api.eating
      .individualRecipeDetails({ recipe: openBase ? (recipe || selectedRecipe).original_recipe_id : (recipe || selectedRecipe).id })
      .then((data) => {
        editRecipe({ recipe: data.data })
        navigation.navigate('IndividualRecipe')
      })
  }

  // const searchRecipes = () => {
  //   const queryString = `favorites=${filter.favoritesOnly}&eating_preferences=${Object.keys(filter.eatingPreferences)
  //     .filter((x) => filter.eatingPreferences[x] === true)
  //     .join(',')}&meal_time_slots=${Object.keys(filter.mealTimes)
  //     .filter((x) => filter.mealTimes[x] === true)
  //     .join(',')}`

  //   api
  //     .eating
  //     .searchRecipes(queryString, searchKeyword)
  //     .then((data) => {
  //       setRecipes(data.data)
  //       console.log('total', data.meta.pagination.total)
  //       setTotal(data.meta.pagination.total)
  //     })
  // }

  const openRecipeGate = (recipe) => {
    // console.log('openRecipeGate - recipe', recipe)
    setSelectedRecipe(recipe)

    if (recipe.user_generated) {
      setShowModal(true)
    } else {
      openRecipe(false, recipe)
    }
  }

  const addRecipeGate = (recipe) => {
    setSelectedRecipe(recipe)

    if (recipe.user_generated) {
      setShowModalAdd(true)
    } else {
      addRecipe(false, recipe)
    }
  }

  const addRecipe = async (openBase = false, recipe = null) => {
    setShowModalAdd(false)
    const resp = await api.eating.addRecipeToDiary({
      date: day,
      recipe_id: openBase ? (recipe || selectedRecipe).original_recipe_id : (recipe || selectedRecipe).id,
      meal_time_slot_id: slot,
    })

    storeItemHistory({
      item: {
        id: openBase ? (recipe || selectedRecipe).original_recipe_id : (recipe || selectedRecipe).id,
        base_id: openBase ? (recipe || selectedRecipe).original_recipe_id : (recipe || selectedRecipe).id,
        name: (recipe || selectedRecipe).name,
        thumb_img_url: (recipe || selectedRecipe).thumb_img_url,
        type: 'recipe',
        user_generated: (recipe || selectedRecipe).user_generated,
        original_recipe_id: openBase ? null : (recipe || selectedRecipe).original_recipe_id,
      },
    })
    storeMealPlan({ date: day, data: resp.data })
    navigation.navigate('MealPlan')
  }

  const toggleFavorite = async (id, name, current) => {
    let resp

    if (!current) {
      setFavorites([...favorites, { id, name, type: 'recipe' }])
      resp = await api.eating.addRecipeToFavorites({ id })
    } else {
      setFavorites(favorites.filter((f) => f.type === 'recipe' && f.name !== name))
      for (const fav of favorites.filter((f) => f.type === 'recipe' && f.name === name)) {
        resp = await api.eating.removeRecipeFromFavorites({ id: fav.id })
      }
    }

    storeFavorites({ data: resp.data })
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SearchBar
          containerStyle={styles.searchContainer}
          onSearch={() => {}}
          placeholder="Search for a recipe"
          onCancel={() => {
            setSearchKeyword('')
          }}
          onSubmitEditing={({ nativeEvent: { text } }) => setSearchKeyword(text)}
        />
        <TouchableOpacity style={styles.barcodeIcon} onPress={() => navigation.navigate('BarcodeScan')}>
          <BarcodeIcon width={25} height={25} color={globals.styles.colors.colorBlack} />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.title}>{'RECIPES'}</Text>
          <Text
            style={{
              fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
              fontSize: 12,
              color: globals.styles.colors.colorGrayDark,
            }}>{`${total} results`}</Text>
        </View>
        <ButtonIcon
          onPress={() => navigation.navigate('Filter', { filterType: 'recipes' })}
          text="FILTER"
          style={styles.veganBtn}
          textStyle={styles.veganText}
          leftIcon={() => <FilterIcon color={globals.styles.colors.colorBlack} />}
          pressedOpacity={0.5}
        />
      </View>
      <View style={styles.divider} />
      {recipes.length < 1 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found.{'\n'}Please try a different filter.</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContentContainer}
          numColumns={2}
          data={recipes}
          renderItem={(r) => (
            <RecipeCard
              set={r.item}
              favorites={favorites}
              onAdd={addRecipeGate}
              handleRecipeClick={openRecipeGate}
              onToggleFavorite={toggleFavorite}
            />
          )}
          ListFooterComponent={() => {
            if (loading) {
              return (
                <View style={styles.loadingContainer}>
                  <Image source={LoadingGif} style={{ height: 54 }} resizeMode="contain" />
                </View>
              )
            } else if (paginationInfo?.current_page < paginationInfo?.total_pages) {
              return (
                <View style={styles.loadMoreContainer}>
                  <TouchableOpacity onPress={() => loadRecipes(filter, paginationInfo.current_page + 1)} style={styles.loadMoreButton}>
                    <Text style={styles.loadMoreText}>LOAD MORE</Text>
                    <AddCircleIcon color={globals.styles.colors.colorWhite} />
                  </TouchableOpacity>
                </View>
              )
            } else {
              return (
                <View style={styles.endContainer}>
                  <Text style={styles.endText}>End of Results</Text>
                </View>
              )
            }
          }}
        />
      )}
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
    </View>
  )
}

export default RecipeSearch
