import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Text, TouchableOpacity, View, ScrollView, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import HeaderImageScrollView from 'react-native-image-header-scroll-view'
import { SwipeRow } from 'react-native-swipe-list-view'
import { moderateScale, scale } from 'react-native-size-matters/extend'
import _ from 'lodash'
import moment from 'moment'

// Components
import NutritionFacts from '../../../../components/NutritionFacts'
import DiaryListItem from '../MealPlan/DiaryListItem'
import BottomUpPanel from '../../../../components/BottomUpPanel'
import MacrosView from '../../../../components/MacrosView'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'
import { RecipeTag } from '../RecipeTag/RecipeTag'
import { NavigationProp, RouteProp } from '@react-navigation/native'

// Services
import api from '../../../../services/api'
import {
  storeMealPlan,
  storeItemHistory,
  removeIngredient,
  updateIngredient,
  editRecipe,
  removeEasyAddIngredient,
  setIngredientsOnly,
} from '../../../../data/meal_plan'
import { useAppSelector } from '../../../../store/hooks'
import { usePersistedState } from '../../../../services/hooks/usePersistedState'

// Assets
import styles from './styles'
import globals from '../../../../config/globals'
import CookingIcon from '../../../../../assets/images/svg/icon/24px/cooking.svg'
import PreppedIcon from '../../../../../assets/images/svg/icon/24px/prepped.svg'
import DownChevron from '../../../../../assets/images/svg/icon/16px/cheveron/down.svg'
import UpChevron from '../../../../../assets/images/svg/icon/16px/cheveron/up.svg'
import CloseIcon from '../../../../../assets/images/svg/icon/24px/close.svg'
import EditIcon from '../../../../../assets/images/svg/icon/24px/edit.svg'

import { EatingStackParamList } from '../../../../config/routes/routeTypes'

import { IBaseIngredient, IMacro, IRenderableIngredientItem, RecipeType, SelectedItem } from '../../../../data/meal_plan/types'

const slots = {
  Breakfast: 'Breakfast',
  Lunch: 'Lunch',
  Dinner: 'Dinner',
  Snack: 'Snack',
  'Snack 1': 'Snack 1',
  'Snack 2': 'Snack 2',
  'Snack 3': 'Snack 3',
}

interface IIndividualRecipeProps {
  navigation: NavigationProp<EatingStackParamList, 'IndividualRecipe'>
  route: RouteProp<EatingStackParamList, 'IndividualRecipe'>
}
const IndividualRecipe: React.FC<IIndividualRecipeProps> = ({ navigation, route }) => {
  const [hideNutritions, setHideNutritions] = useState(false)
  const [hideIngredients, setHideIngredients] = useState(false)
  const [selected, setSelected] = useState<SelectedItem[]>([])
  const [singleEditMode, setSingleEditMode] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const slot = useAppSelector((state) => state.data.meal.mealTimeSlot)
  const user = useAppSelector((state) => state.data.user)
  const storedDay = useAppSelector((state) => state.data.meal.day)
  const recipe = useAppSelector((state) => state.data.meal.currentRecipe)
  const ingredients = useAppSelector((state) => state.data.meal.currentRecipe?.ingredients ?? [])
  const mpr = useAppSelector((state) => state.data.user.mpr)
  const goal = useAppSelector((state) => state.data.user.goal)
  const eatingPreferences = useAppSelector((state) => state.data.user.eating_preferences)

  const today = useMemo(() => moment(storedDay), [storedDay])
  const dayArray = useMemo(() => today.toArray(), [today])

  const mealPlan = useAppSelector(
    (state) => state.data.meal.mealPlans?.[dayArray[0].toString()]?.[dayArray[1].toString()]?.[dayArray[2].toString()]?.data,
  )

  const [showMacrosPersisted] = usePersistedState('macrosView', 'expanded', true)
  const [showMacros, setShowMacros] = useState(showMacrosPersisted)

  const existingRecipe = route.params?.existingRecipe
  const originalId = route.params?.existingId
  const instanceId = route.params?.instanceId

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerShadowVisible: false,
    })
  }, [navigation])

  const ingredientRows = useRef<Record<string, SwipeRow<any> | null>>({})

  const macros: IMacro[] = useMemo(() => {
    if (saving) {
      return macros
    }
    if (!recipe) {
      return (mealPlan?.items ?? []).map((r) => ({
        calories: r.calories,
        fats: r.fats,
        carbs: r.carbs,
        protein: r.protein,
      }))
    }
    // let data = [...(mealPlan?.items ?? []), recipe]
    let data = [
      ...(mealPlan?.items ?? []).map((r) => ({
        calories: r.calories,
        fats: r.fats,
        carbs: r.carbs,
        protein: r.protein,
      })),
      recipe,
    ]

    if (existingRecipe && recipe) {
      data = [
        {
          calories: Number(recipe.original_calories),
          fats: Number(recipe.original_fats),
          carbs: Number(recipe.original_carbs),
          protein: Number(recipe.original_protein),
        },
        ...data,
      ]
    }

    return data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe, existingRecipe, ingredients, mealPlan?.items, saving])

  const deleteIngredient = (base_id: number) => {
    removeIngredient({ id: base_id })
  }

  const deleteEasyAdd = (id: string) => {
    removeEasyAddIngredient({ id: id })
  }

  const updateRecipe = async () => {
    if (!recipe) {
      return
    }
    setSaving(true)
    let id = recipe.id

    //Recipe has changed
    //Delete the old one from the diary
    const remainingItems: SelectedItem[] = mealPlan.items
      .filter((x) => x.id !== instanceId)
      .map((i) => ({
        id: i.id,
        type: i.type,
        meal_time_slot_id: i.diary_meal_time_slot_id!,
      }))

    const data = await api.eating.deleteDiaryItems({
      date: today.format('YYYY-MM-DD'),
      items: remainingItems,
    })

    storeMealPlan({ date: today.format('YYYY-MM-DD'), data: data.data })

    if (id !== originalId || (existingRecipe && !recipe.user_generated)) {
      addRecipe()
      return
    }

    if (recipe?.isDirty) {
      const result = await api.eating.updateUserRecipe({
        id: recipe.id!,
        recipe: {
          recipe_id: recipe.id!,
          name: recipe.name,
          ingredients: recipe?.ingredients!.map((i) => ({ ...i, qty: i.quantity, nix_id: i.nix_item_id })),
          easy_add_recipe_ids: (recipe.easy_add_recipes || []).map((i) => i.id),
        },
      })

      id = result.data.id
    }

    api.eating
      .addRecipeToDiary({
        date: storedDay,
        recipe_id: id,
        meal_time_slot_id: slot,
      })
      .then((resp) => {
        storeItemHistory({
          item: {
            id: id,
            base_id: +id,
            name: recipe?.name,
            thumb_img_url: recipe?.thumb_img_url,
            type: RecipeType.recipe,
            user_generated: recipe?.isDirty,
            original_recipe_id: recipe.original_recipe_id || +recipe.id,
          },
        })
        storeMealPlan({ date: storedDay, data: resp.data })
        setIngredientsOnly(false)
        navigation.navigate('MealPlan')
      })
      .catch(() => {})
  }

  const addRecipe = async () => {
    if (!recipe) {
      return
    }
    setSaving(true)

    let id = recipe.id

    if (recipe.isDirty) {
      const result = await api.eating.createUserRecipe({
        recipe_id: recipe.original_recipe_id || recipe.id,
        name: recipe.name,
        ingredients: recipe.ingredients?.map((i) => ({ ...i, qty: i.quantity, nix_id: i.nix_item_id })) ?? [],
        easy_add_recipe_ids: (recipe.easy_add_recipes || []).map((i) => i.id),
      })

      id = result.data.id
    }

    api.eating
      .addRecipeToDiary({
        date: storedDay,
        recipe_id: id,
        meal_time_slot_id: slot,
      })
      .then((resp) => {
        storeItemHistory({
          item: {
            id: id,
            base_id: +id,
            name: recipe.name,
            thumb_img_url: recipe.thumb_img_url,
            type: RecipeType.recipe,
            user_generated: recipe.isDirty,
            original_recipe_id: recipe.original_recipe_id || +recipe.id,
          },
        })
        storeMealPlan({ date: storedDay, data: resp.data })
        setIngredientsOnly(false)
        navigation.navigate('MealPlan')
      })
  }

  const renderHiddenIngredientItem = (data: IRenderableIngredientItem) => {
    if (data.base_ingredient_id) {
      return (
        <View style={styles.hiddenItemButtons}>
          <EditButton
            onEdit={() => {
              closeRow(data.key)
              setTimeout(() => setSingleEditMode(data.key), 50)
            }}
          />
          <XButton
            onDelete={() => {
              closeRow(data.key)
              deleteIngredient(data.base_ingredient_id)
            }}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.hiddenItemButton}>
          <XButton onDelete={() => deleteEasyAdd(String(data.id!))} />
        </View>
      )
    }
  }

  const saveIngredient = (ingredient: IBaseIngredient | null) => {
    if (ingredient) {
      updateIngredient({ ingredient })
    }
    setSingleEditMode(null)
  }

  const revert = () => {
    const id = recipe?.user_generated ? recipe?.original_recipe_id : recipe?.id
    if (id !== undefined) {
      api.eating.individualRecipeDetails({ recipe: +id }).then((data) => {
        editRecipe({ recipe: data.data })
      })
    }
  }

  const renderIngredientItem = (data: IRenderableIngredientItem) => {
    return (
      <DiaryListItem
        recipeEdit={true}
        item={data}
        favorites={[]}
        singleEditMode={singleEditMode === data.key}
        onSave={saveIngredient}
        onToggleSelect={(items, selectionActive, toggleAll = false) => {
          let newItems = []
          if (!selectionActive) {
            newItems = [...selected, ...items]
          } else {
            newItems = toggleAll
              ? []
              : selected.filter(
                  (x) => !items.find((i) => i.type === x.type && i.id === x.id && i.meal_time_slot_id === x.meal_time_slot_id),
                )
          }

          setSelected(newItems)
        }}
        selected={selected}
        editMode={false}
        // date={moment().format('YYYY-MM-DD')}
        slot={{ id: slot }}
        // handlePress={data.item.type === 'recipe' ? (id) => openRecipe(mealPlan.meal_set.id, id) : addFood}
        handlePress={() => {}}
        ingredientPress={() => {}}
        showMacros={showMacros}
      />
    )
  }

  const onRowDidOpen = () => {}

  const closeRow = (rowKey: string) => {
    if (ingredientRows.current?.[rowKey]) {
      ingredientRows.current[rowKey]?.closeRow()
    }
  }

  function buildInstructionsList() {
    return recipe?.steps?.map((s, i) => {
      const title = s.header ? <Text>{s.header}</Text> : null
      const body =
        s.items.length >= 1 ? (
          s.items.map((item, idx) => (
            <View key={`${idx}_ins_item`} style={styles.instructionListItemRow}>
              <Text style={styles.instructionListItemNumber}>{idx + 1}.</Text>
              <Text style={styles.instructionListItemText}>{item.text}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.instructionListItemTextSingle}>{s.text}</Text>
        )
      return (
        <View key={`ins_${s.id}_${i}`}>
          {title}
          {body}
        </View>
      )
    })
  }

  if (!recipe) {
    return <View />
  } else {
    return (
      <>
        {!existingRecipe && (
          <View style={styles.buttonContainer}>
            <View style={styles.buttonContainerView}>
              <TouchableOpacity style={styles.addFoodBtn} onPress={addRecipe}>
                <Text style={styles.buttonText}>{'ADD RECIPE'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {existingRecipe && (recipe.isDirty || recipe.id !== originalId) && (
          <View style={styles.buttonContainer}>
            <View style={styles.buttonContainerView}>
              <TouchableOpacity style={styles.saveFoodBtn} onPress={updateRecipe}>
                <Text style={styles.buttonText}>{'SAVE CHANGES'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <HeaderImageScrollView
          maxHeight={317}
          minHeight={0}
          headerImage={{ uri: recipe.img_url }}
          showsVerticalScrollIndicator={false}
          renderForeground={() => (
            <LinearGradient
              style={{ height: 107, width: '100%', position: 'relative' }}
              colors={['rgba(0, 0, 0, 0.68)', 'rgba(0, 0, 0, 0)']}>
              <HeaderButton
                style={{ position: 'absolute', top: 52, left: 6 }}
                onPress={() => {
                  setIngredientsOnly(false)
                  navigation.goBack()
                }}
                iconColor={globals.styles.colors.colorWhite}
              />
            </LinearGradient>
          )}>
          <View
            style={{
              marginTop: Platform.select({ android: 0, ios: -30 }),
              flex: 1,
              flexDirection: 'column',
              paddingBottom: showMacros && (!recipe.user_generated || recipe.isDirty) ? 120 + 112 : 112,
              paddingTop: 8,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              backgroundColor: globals.styles.colors.colorWhite,
            }}>
            <View style={styles.panelHandleWrapper}>
              <View style={styles.panelHandle} />
            </View>
            {/* <TriggeringView onHide={() => console.log('text hidden')}> */}
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <Text style={styles.slotName}>{_.uniq(recipe?.meal_time_slots?.map((s) => slots[s])).join(', ')}</Text>
            <ScrollView
              contentContainerStyle={{ marginLeft: 12, paddingRight: 24 }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {recipe?.tags?.map((t, idx) => {
                return <RecipeTag key={idx} tag={t} />
              })}
            </ScrollView>
            <View style={styles.timeInfoContainer}>
              <View style={styles.timeInfo}>
                <Text style={styles.timeLabel}>From Scratch:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CookingIcon color={globals.styles.colors.colorPink} style={{ marginBottom: 8, marginRight: 8 }} />
                  <Text style={styles.timeValue}>{recipe.total_time} MINS</Text>
                </View>
              </View>
              {recipe?.prep_time && recipe.prep_time > 0 && (
                <View style={styles.timeInfo}>
                  <Text style={styles.timeLabel}>Meal Prepped:</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <PreppedIcon color={globals.styles.colors.colorPink} style={{ marginBottom: 8, marginRight: 8 }} />
                    <Text style={styles.timeValue}>{recipe.prep_time} MINS</Text>
                  </View>
                </View>
              )}
              <View style={styles.timeInfo}>
                <Text style={styles.timeLabel}>Yields:</Text>
                <Text style={[styles.timeValue, { marginTop: 2 }]}>
                  {recipe.servings} SERVING{recipe.servings && recipe.servings > 1 ? 'S' : ''}
                </Text>
              </View>
            </View>
            {(recipe.isDirty || recipe.user_generated) && (
              <View style={styles.revertWrapper}>
                <TouchableOpacity onPress={revert} style={styles.revertButton}>
                  <Text style={styles.revertButtonText}>REVERT TO ORIGINAL RECIPE</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={styles.nutritionsToggle} onPress={() => setHideNutritions(!hideNutritions)}>
              <Text style={styles.toggleLabel}>{hideNutritions ? 'Show Nutrition Facts' : 'Hide Nutrition Facts'}</Text>
              {hideNutritions ? (
                <DownChevron color={globals.styles.colors.colorBlack} />
              ) : (
                <UpChevron color={globals.styles.colors.colorBlack} />
              )}
            </TouchableOpacity>
            {!hideNutritions && (
              <View style={styles.nutritionFactsWrapper}>
                <NutritionFacts
                  eatingPreferences={user.eating_preferences}
                  recipe={recipe}
                  macrosOnly={true}
                  isRecipe={true}
                  multiplier={1}
                />
              </View>
            )}
            <Text style={[styles.ingredientsLabel, { paddingHorizontal: 24 }]}>INGREDIENTS:</Text>
            <TouchableOpacity style={styles.nutritionsToggle} onPress={() => setHideIngredients(!hideIngredients)}>
              <Text style={styles.toggleLabel}>{hideIngredients ? 'Show Ingredients' : 'Hide Ingredients'}</Text>
              {hideIngredients ? (
                <DownChevron color={globals.styles.colors.colorBlack} />
              ) : (
                <UpChevron color={globals.styles.colors.colorBlack} />
              )}
            </TouchableOpacity>
            {!hideIngredients && (
              <View style={styles.ingredientsContainer}>
                {(
                  [
                    ...(recipe.ingredients || []).map((i) => ({ ...i, key: String(i.base_ingredient_id) })),
                    ...(recipe.easy_add_recipes || []).map((i) => ({ ...i, key: i.id, type: 'easy_add_recipe', disableRightSwipe: true })),
                  ] as IRenderableIngredientItem[]
                ).map((i, idx) => (
                  // @ts-expect-error
                  <SwipeRow
                    key={`${idx}_${i.key}`}
                    ref={(el: any) => (ingredientRows.current[i.key] = el)}
                    leftOpenValue={scale(73)}
                    rightOpenValue={scale(-73)}
                    disableLeftSwipe={singleEditMode !== null}
                    disableRightSwipe={singleEditMode !== null || i.type === 'easy_add_recipe'}
                    closeOnRowPress={true}
                    onRowDidOpen={onRowDidOpen}>
                    {/* Hidden row item needs to be rendered first */}
                    {renderHiddenIngredientItem(i)}
                    {renderIngredientItem(i)}
                  </SwipeRow>
                ))}
                <TouchableOpacity
                  onPress={() => {
                    setIngredientsOnly(true)
                    navigation.navigate('Ingredient', { key: 'ingredientsearch' })
                  }}>
                  <Text style={styles.addIngredientBtn}>Add Food</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={[styles.toolsContainer /*, { borderBottomWidth: 8, borderColor: globals.styles.colors.colorPink }*/]}>
              <Text style={[styles.ingredientsLabel, { marginBottom: 10 }]}>YOU WILL NEED:</Text>
              {recipe?.tools?.map((item, idx) => (
                <View key={idx} style={styles.ingredientWrapper}>
                  <View style={styles.listItemMark} />
                  <Text style={styles.ingredientInfo}>{item.name}</Text>
                </View>
              ))}
            </View>
            <View style={styles.toolsContainer}>
              <Text style={styles.ingredientsLabel}>INSTRUCTIONS:</Text>
              {buildInstructionsList()}
              <Text style={styles.recipeInstructions}>{recipe.instructions}</Text>
            </View>
            {/* </TriggeringView> */}
          </View>
        </HeaderImageScrollView>
        {((!recipe.user_generated && !existingRecipe) || recipe.isDirty || recipe.id !== originalId) && (
          <BottomUpPanel
            containerStyle={{ bottom: 105 }}
            isOpen={false}
            content={() => <MacrosView withRecipe={true} userValues={{ mpr, goal, eatingPreferences }} foodValues={macros} />}
            topEnd={globals.window.height - moderateScale(147)}
            onAnimationComplete={setShowMacros}
          />
        )}
      </>
    )
  }
}

const XButton = ({ onDelete }: { onDelete: () => void }) => (
  <View style={[styles.deleteContainer, { backgroundColor: globals.styles.colors.colorLove }]}>
    <TouchableOpacity onPress={onDelete}>
      <CloseIcon color={globals.styles.colors.colorWhite} />
    </TouchableOpacity>
  </View>
)

const EditButton = ({ onEdit }: { onEdit: () => void }) => (
  <View style={[styles.deleteContainer, { backgroundColor: globals.styles.colors.colorSkyBlue }]}>
    <TouchableOpacity onPress={onEdit}>
      <EditIcon color={globals.styles.colors.colorWhite} />
    </TouchableOpacity>
  </View>
)

export default IndividualRecipe
