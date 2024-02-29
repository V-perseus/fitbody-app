import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Text, TouchableOpacity, View, ScrollView, TouchableWithoutFeedback } from 'react-native'
import Share from 'react-native-share'
import LinearGradient from 'react-native-linear-gradient'
import uuidv4 from 'uuid/v4'
import moment from 'moment'
import * as _ from 'lodash'
import * as Sentry from '@sentry/react-native'
import matchAll from 'string.prototype.matchall'

// Components
import GroceryModal from '../../../../components/GroceryModal'
import MealPlanModal from '../../../../components/MealPlanModal'
import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'
import { ButtonFloatingGroup } from '../../../../components/Buttons/ButtonFloatingGroup'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

// Services
import api from '../../../../services/api'
import { setErrorMessage } from '../../../../services/error'
import { storeGroceries, storeSelectedGroceries } from '../../../../data/meal_plan'
import { displayLoadingModal, hideLoadingModal } from '../../../../services/loading'

// Assets
import styles from './styles'
import globals from '../../../../config/globals'

const GroceryList = ({ navigation }) => {
  const groceries = useSelector((state) => state.data.meal.groceries) || []
  const selectedItems = useSelector((state) => state.data.meal.selectedGroceries) || []
  const dates = useSelector((state) => state.data.meal.dates) || ''
  const mealPlans = useSelector((state) => state.data.meal.mealPlans) || {}

  const [showModal, setShowModal] = useState(false)
  const [showModalCarryover, setShowModalCarryover] = useState(false)
  const [modalType, setModalType] = useState(0)
  const [selectedDays, setSelectedDays] = useState([])
  const [carryoverItems, setCarryoverItems] = useState([])

  useEffect(() => {
    if (!groceries.length) {
      setErrorMessage({
        error: 'Your meal planner is empty! Please choose a meal set to begin creating a grocery list.',
        errorIcon: 'GroceryLarge',
        iconColor: 'black',
      })
    }
  }, [groceries.length])

  function toggleModal() {
    setShowModal(!showModal)
    setModalType(0)
  }

  function selectDayHandler(day) {
    let temp = selectedDays.slice()
    const idx = temp.findIndex((d) => d.isSame(day))
    if (idx >= 0) {
      temp.splice(idx, 1)
    } else {
      temp.push(day)
    }
    setSelectedDays(temp)
  }

  function checkCarryoverPrevious() {
    const carryovers = groceries.filter((g) => !selectedItems.includes(g.key))
    if (carryovers.length > 0) {
      setCarryoverItems(carryovers)
      setShowModalCarryover(true)
    } else {
      setSelectedDays([])
      setCarryoverItems([])
      toggleModal()
    }
  }

  function discardCarryovers() {
    setCarryoverItems([])
    setShowModalCarryover(false)
    setTimeout(() => {
      setShowModal(true)
    }, 500)
  }

  function addCarryovers() {
    setSelectedDays([])
    setShowModalCarryover(false)
    setTimeout(() => {
      setShowModal(true)
    }, 500)
  }

  const deriveIngredientId = (ing) => {
    // ingredient ids are inconsistent and potentially not unique across various types
    return ing.base_easy_add_id
      ? ing.base_easy_add_id
      : ing.base_ingredient_id && ing.id // if it has both, take the id. This can occur when an ingredient shares the same base_ingredient_id, but has been modified by the user
      ? ing.id
      : ing.base_ingredient_id
      ? ing.base_ingredient_id
      : ing.id
      ? ing.id
      : ing.key
  }

  const combineDuplicates = (ingredients) => {
    // combine multiple ingredients
    return ingredients.reduce((acc, next) => {
      const nextId = deriveIngredientId(next)
      const has = acc.findIndex((a) => deriveIngredientId(a) === nextId)
      // adjust for ingredients that have no quantity
      const n = {
        ...next,
        quantity: next.quantity ? next.quantity : '1',
      }
      // adjust for ingredients that have no unit in their quantity but have a unit in the serving_unit field
      if (n.quantity && String(n.quantity).split(/\d+/)[1]?.length === 0) {
        n.quantity = n.quantity + ' ' + (n.serving_unit ? n.serving_unit : '')
      }
      // if ingredient has not been added, add it
      if (has === -1) {
        acc.push(n)
        return acc
      } else {
        // if ingredient has been added
        if (n.quantity) {
          // get all numeric matches from the original ingredient and the current iterator ingredient. ex: '1tbsp (8g)' returns [['1'], ['8']]
          let previousMatches = [...matchAll(String(acc[has].quantity), /[0-9.]+/g)]
          let nextMatches = [...matchAll(String(n.quantity), /[0-9.]+/g)]
          // let previousMatches = [...String(acc[has].quantity).matchAll(/[0-9.]+/g)]
          // let nextMatches = [...String(n.quantity).matchAll(/[0-9.]+/g)]

          // then string replace the current iterator ingredient quantity with the quantity of the original ingredient added to the current ingredient
          if (previousMatches.length === nextMatches.length) {
            nextMatches.forEach((match, idx) => {
              // console.log('REPLACING', n.name, ' with quantity ', n.quantity, ' part ', match[0], ' with ', acc[has].quantity, ' part ', previousMatches[idx][0], ' + ', match[0])
              n.quantity = String(n.quantity).replace(new RegExp(match[0]), String(+previousMatches[idx][0] + +match[0]))
            })
          }

          acc[has] = n
          return acc
        }
      }
    }, [])
  }

  const parseMealsets = (plans) => {
    const days = selectedDays.map((s) => s.format('YYYY-M-D'))

    return Object.keys(plans)
      .map((y) =>
        Object.keys(plans[y]).map((m) =>
          Object.keys(plans[y][m]).map((d) => {
            return !plans[y][m][d] ||
              !plans[y][m][d]?.data ||
              !plans[y][m][d]?.data.items ||
              !plans[y][m][d]?.data.items.length ||
              !days.includes(`${y}-${parseInt(m, 10) + 1}-${d}`)
              ? []
              : plans[y][m][d]?.data.items.map((recipe) => {
                  // if recipe is an easy add, it is already a singular ingredient, just wrap in a promise
                  if (recipe.type === 'easy_add_recipe' || recipe.type === 'ingredient') {
                    return new Promise((resolve) => resolve({ data: { ingredients: [{ ...recipe, key: uuidv4() }] } }))
                  }
                  // recipes from plans use 'id' prop and a v3 endpoint while stand alone recipes use a 'base_recipe_id' prop
                  // and a v4 endpoint to get ingredients
                  else if (recipe.base_recipe_id) {
                    return api.eating.individualRecipeDetails({ recipe: recipe.base_recipe_id }).catch((e) => console.log('error', e))
                  } else if (recipe.id) {
                    return api.eating.individualRecipeDetailsV3({ recipe: recipe.id }).catch((e) => console.log('error', e))
                  }
                })
          }),
        ),
      )
      .flat(Infinity)
  }

  async function onCreateList() {
    if (selectedDays.length < 1) {
      return
    }
    try {
      // Because we're now merging ingredients from different db tables, ex from mealplans, individual recipes, and easy adds
      // I don't trust that their individual ids wouldn't ever conflict when selecting deleting etc.
      // So I'm adding a key prop of type uuid to each ingredient on creation. Ingredients don't have a non-primary identifier.
      // This key is not used by the backend at all.
      toggleModal()
      displayLoadingModal()
      const minDate = moment.min(selectedDays).format('MMM D')
      const maxDate = moment.max(selectedDays).format('MMM D')

      // Fetch all ingredient data as an array of promises
      const mealsetPromises = parseMealsets(mealPlans)

      // If we've elected to carry over existing ingredients, we add them back here
      if (carryoverItems.length > 0) {
        carryoverItems.forEach((c) => mealsetPromises.push(new Promise((resolve) => resolve({ data: { ingredients: [c] } }))))
      }

      // resolve all promises
      const results = await Promise.all(mealsetPromises)

      // console.log('results', results)

      // results data structure differs between the v4 and v3 endpoint response. The ingredients list may be behind a data
      // prop, and it might not. We parse that here.
      const ingredients = _.orderBy(
        results
          .map((r) => {
            if (r.ingredients?.length) {
              return _.map([...r.ingredients, ...(r.easy_add_recipes ?? [])], (ing) => ({ ...ing, key: uuidv4() })).flat(Infinity)
            } else if (r.data.ingredients?.length) {
              return _.map([...r.data.ingredients, ...(r.data.easy_add_recipes ?? [])], (ing) => ({ ...ing, key: uuidv4() })).flat(Infinity)
            }
          })
          .flat(Infinity),
        (x) => x.name,
      )

      setCarryoverItems([])

      const combined = combineDuplicates(ingredients)

      storeGroceries({ ingredients: combined, dates: `${minDate} - ${maxDate}` })
    } catch (error) {
      console.log('error', error)
      // Sentry.captureException(new Error(error.message || JSON.stringify(error)))
      // because this is run from a modal, the error popup wont show unless the modal has closed first
      setTimeout(() => {
        setErrorMessage({ error: error.message || 'Error creating grocery list' })
      }, 800)
    } finally {
      hideLoadingModal()
    }
  }

  const selectItem = (idx, item) => {
    let temp = selectedItems.slice()
    const found = temp.indexOf(idx)

    if (found >= 0) {
      temp.splice(found, 1)
    } else {
      temp.push(idx)
    }
    storeSelectedGroceries(temp)
  }

  const RenderGroceryItem = (item) => {
    const quantity = item.quantity ? item.quantity : 1
    const isSelected = selectedItems.includes(item.key)
    const rowStyles = [styles.groceryItem, isSelected && { backgroundColor: globals.styles.colors.colorGrayLight }]
    const itemNameStyles = [styles.groceryItemName, isSelected && { color: globals.styles.colors.colorGrayDark }]

    function handleSelect() {
      selectItem(item.key)
    }

    return (
      <TouchableWithoutFeedback key={item.key} style={rowStyles} onPress={handleSelect}>
        <View style={rowStyles}>
          <View style={styles.groceryItemInfoWrapper}>
            <View style={styles.groceryItemInfo}>
              <Text style={itemNameStyles}>{item.name}</Text>
              <Text style={styles.groceryItemQuantity}>{quantity}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  function linearGradientStyles() {
    return [styles.header, groceries.length > 0 ? styles.expandedHeader : {}]
  }
  function linearGradientColors() {
    return [globals.styles.colors.colorPink, globals.styles.colors.colorLavender]
  }
  function newGroceryListContainerStyles() {
    return [styles.groceryContainer, styles.dayWrapper]
  }

  function handleBackButton() {
    navigation.goBack()
  }

  const groceryListExportText = groceries
    .filter((g) => !selectedItems.includes(g.key))
    .reduce((list, g) => {
      list += `${g.name} - ${g.quantity ? g.quantity : 1}\n`
      return list
    }, '')

  async function handleExportButton() {
    try {
      const shareResponse = await Share.open({
        title: `Grocery list - ${moment().format('MMM D')}`,
        message: `Fit Body App Grocery List\n${dates}\n\n${groceryListExportText}`,
        subject: 'Subject',
      })
      if (shareResponse.action === Share.sharedAction) {
        if (shareResponse.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (shareResponse.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" />
      <LinearGradient style={linearGradientStyles()} colors={linearGradientColors()}>
        <View style={styles.titleBar}>
          <HeaderButton onPress={handleBackButton} iconColor={globals.styles.colors.colorWhite} style={styles.backIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>GROCERIES</Text>
          </View>
          <View />
        </View>
        {groceries.length > 0 && <Text style={styles.headerDate}>{dates}</Text>}
      </LinearGradient>

      {groceries.length === 0 ? (
        <View style={newGroceryListContainerStyles()}>
          <Text style={styles.noShoppingItems}>No shopping items</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.createBtn} onPress={toggleModal}>
              <Text style={styles.buttonText}>CREATE NEW GROCERY LIST</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <ScrollView style={styles.groceryContainerList} contentContainerStyle={styles.groceryContainer}>
            <View style={styles.groceryListHeader}>
              <Text style={styles.groceryListHeaderText}>
                To create your grocery list, tap the items you already have. All remaining items will be exported as a final grocery list.
              </Text>
            </View>
            {groceries.map((item, idx) => {
              return RenderGroceryItem(item, idx)
            })}
          </ScrollView>
          <ButtonFloatingGroup
            onPressLeft={handleExportButton}
            onPressRight={checkCarryoverPrevious}
            btnLeftText="EXPORT"
            btnRightText="CREATE NEW"
          />
        </>
      )}

      <GroceryModal
        showModal={showModal}
        modalType={modalType}
        closeModal={toggleModal}
        selectedDays={selectedDays}
        selectDayHandler={selectDayHandler}
        createButtonHandler={onCreateList}
      />

      <MealPlanModal
        showModal={showModalCarryover}
        modalText={`Would you like to keep ${carryoverItems.length || 0}\nunused item${carryoverItems.length === 1 ? '' : 's'}?`}
        noButtonText={'NO'}
        yesButtonText={'YES'}
        noButtonPressHandler={discardCarryovers}
        yesButtonPressHandler={addCarryovers}
        onClose={() => setShowModalCarryover(false)}
      />
    </View>
  )
}

export default GroceryList
