import React, { useState, useMemo, useCallback, useEffect, useLayoutEffect } from 'react'
import moment, { Moment } from 'moment'
import { DefaultSectionT, SectionListData, Text, TouchableOpacity, View, SectionListRenderItemInfo } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { moderateScale, scale } from 'react-native-size-matters/extend'
import { RowMap, SwipeListView } from 'react-native-swipe-list-view'
import _ from 'lodash'

// Services
import api from '../../../../services/api'
import {
  changeDate,
  changeMealTimeSlot,
  storeMealPlan,
  getRecipes,
  editRecipe,
  storeFavorites,
  getRecipesRange,
} from '../../../../data/meal_plan'
import { useAppSelector } from '../../../../store/hooks'
import { usePersistedState } from '../../../../services/hooks/usePersistedState'

// Components
import MealPlanModal from '../../../../components/MealPlanModal'
import BottomUpPanel from '../../../../components/BottomUpPanel'
import MacrosView from '../../../../components/MacrosView'
import DatePickerModal from '../../../../components/DatePickerModal'
import DiaryCopyModal from '../../../../components/DiaryCopyModal'
import { ButtonFloatingGroup } from '../../../../components/Buttons/ButtonFloatingGroup'
import { CalDay, DiaryDateHeader } from './DiaryDateHeader'
import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'
import DiaryListItem from './DiaryListItem'
import DiaryListHead from './DiaryListHead'
import { DiaryDateDropdown } from './DiaryDateDropdown'
import { ButtonOpacity } from '../../../../components/Buttons/ButtonOpacity'

// Assets
import styles from './styles'
import globals from '../../../../config/globals'
import CloseIcon from '../../../../../assets/images/svg/icon/24px/close.svg'
import EditIcon from '../../../../../assets/images/svg/icon/24px/edit.svg'

// Types
import { MealPlanScreenUseNavigationProp } from '../../../../config/routes/routeTypes'
import {
  IEasyAddRecipeIngredient,
  IMealPlanIngredient,
  IRecipe,
  isEasyAddRecipeIngredient,
  RecipeType,
  SelectedItem,
} from '../../../../data/meal_plan/types'

type SectionData = {
  slot: {
    id: number
    mealtimeslot: {
      slot_name: string
      back_end: string
    }
  }
  key: string
  data: IRecipe[]
}

const mockData = [
  {
    id: 1,
    mealtimeslot: {
      slot_name: 'Breakfast',
      back_end: 'Breakfast',
    },
  },
  {
    id: 2,
    mealtimeslot: {
      slot_name: 'Lunch',
      back_end: 'Lunch',
    },
  },
  {
    id: 3,
    mealtimeslot: {
      slot_name: 'Dinner',
      back_end: 'Dinner',
    },
  },
  {
    id: 4,
    mealtimeslot: {
      slot_name: 'Snack 1',
      back_end: 'Morning Snack',
    },
  },
  {
    id: 5,
    mealtimeslot: {
      slot_name: 'Snack 2',
      back_end: 'Afternoon Snack',
    },
  },
  {
    id: 6,
    mealtimeslot: {
      slot_name: 'Snack 3',
      back_end: 'Post-Workout Snack',
    },
  },
]

interface IMealPlanProps {
  navigation: MealPlanScreenUseNavigationProp
}
const MealPlan: React.FC<IMealPlanProps> = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [showMacros, setShowMacros] = usePersistedState('macrosView', 'expanded', true)

  const mpr = useAppSelector((state) => state.data.user.mpr)
  const goal = useAppSelector((state) => state.data.user.goal)
  const eatingPreferences = useAppSelector((state) => state.data.user.eating_preferences)
  const storedDay = useAppSelector((state) => state.data.meal.day)
  const favorites = useAppSelector((state) => state.data.meal.favorites)
  const today = useMemo(() => (storedDay ? moment(storedDay) : moment()), [storedDay])

  const dayArray = useMemo(() => today.toArray(), [today])
  const mealPlan = useAppSelector(
    (state) => state.data.meal.mealPlans?.[dayArray[0].toString()]?.[dayArray[1].toString()]?.[dayArray[2].toString()]?.data,
  )

  const screenType = useMemo(() => (mealPlan?.meal_set ? 1 : 0), [mealPlan])
  const [selected, setSelected] = useState<SelectedItem[]>([])
  const [editMode, setEditMode] = useState(false)
  const [selectedDays, setSelectedDays] = useState<Moment[]>([])
  const [diary, setDiary] = useState<SectionData[]>([])
  const [singleEditMode, setSingleEditMode] = useState<string | null>(null)

  const toggleSelect = useCallback(() => setEditMode((prev) => !prev), [])

  const loadFavorites = useCallback(() => {
    if (favorites.length === 0) {
      api.eating.listFavorites().then((favs) => storeFavorites({ data: favs.data }))
    }
  }, [favorites.length])

  useEffect(() => loadFavorites(), [loadFavorites])

  useEffect(() => {
    const sectionData = mockData.map((m) => ({
      slot: m,
      key: `s-${m.id}`,
      data: _.sortBy(
        mealPlan?.items.filter((i) => i.diary_meal_time_slot_id === m.id),
        (i) => (i.type === RecipeType.recipe ? 1 : i.type === RecipeType.easy_add_recipe ? 2 : 3),
      ).map((di) => ({ ...di, key: `${di.type}_${di.id}`, disableRightSwipe: di.type === RecipeType.ingredient ? false : true })),
    }))

    setDiary(sectionData)
  }, [mealPlan])

  useFocusEffect(
    useCallback(() => {
      if (!eatingPreferences || eatingPreferences.length === 0) {
        navigation.navigate('EatingPreference')
      } else if (!mpr) {
        navigation.navigate('Calculator')
      }
    }, [eatingPreferences, mpr, navigation]),
  )

  // this will pull recipes for the currently selected day
  useEffect(() => getRecipes(today.format('YYYY-MM-DD')), [today])
  // this will pull all future recipes to cover the case of a user clearing local state
  useEffect(() => getRecipesRange({ startDate: moment().format('YYYY-MM-DD') }), [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      cardStyle: { backgroundColor: globals.styles.colors.colorWhite },
    })
  }, [navigation])

  const showHideMacros = useCallback((toggle: boolean) => setShowMacros(toggle), [setShowMacros])

  const selectDayHandler = useCallback(
    (day: Moment) => {
      let temp = selectedDays.slice()
      const idx = temp.findIndex((d) => d.isSame(day))
      if (idx >= 0) {
        temp.splice(idx, 1)
      } else {
        temp.push(day)
      }
      setSelectedDays(temp)
    },
    [selectedDays],
  )

  const closeModal = useCallback(() => setShowModal(false), [])

  const deleteMealSet = useCallback(async () => {
    closeModal()
    await api.eating.deleteMealSet(today.format('YYYY-MM-DD'))
    storeMealPlan({ date: today.format('YYYY-MM-DD'), data: null })
    getRecipes(today.format('YYYY-MM-DD'))
  }, [closeModal, today])

  const editFood = (baseIngredient: IMealPlanIngredient, mealSlotId: number) => {
    if (baseIngredient.nix_item_id || baseIngredient.nix_food_name) {
      api.eating.ingredientDetails({ id: baseIngredient.nix_item_id! || baseIngredient.nix_food_name! }).then((data) => {
        let ingredient = data
        if (ingredient.nix_item_id) {
          ingredient = { ...data, nix_item_id: baseIngredient.nix_item_id }
        }

        navigation.navigate('FoodMacros', {
          ingredient: { ...ingredient, id: baseIngredient.id },
          currentValues: {
            quantity: baseIngredient.quantity,
            serving_unit: baseIngredient.serving_unit,
            meal_time_slot_id: baseIngredient.diary_meal_time_slot_id,
          },
          mealSlotId,
        })
      })
    }
  }

  const openRecipe = (mealplan: number, recipe: string) => {
    api.eating.recipeDetails({ mealplan, recipe }).then((data) => navigation.navigate('Recipe', { recipe: data }))
  }

  const openIndividualRecipe = (id: number, instanceId: number, mealTimeSlotId: number) => {
    api.eating.individualRecipeDetails({ recipe: id }).then((data) => {
      changeMealTimeSlot(mealTimeSlotId)
      editRecipe({ recipe: data.data })
      navigation.navigate('IndividualRecipe', { existingRecipe: true, existingId: id, instanceId })
    })
  }

  /**
   * Set the active day in the week date header
   */
  function changeDay(newDate: Partial<CalDay>) {
    if (editMode) {
      setEditMode(false)
    }
    if (newDate.full) {
      changeDate(newDate.full.format('YYYY-MM-DD'))
    }
  }

  const addFood = (mealTimeSlotId: number | IEasyAddRecipeIngredient) => {
    if (isEasyAddRecipeIngredient(mealTimeSlotId) && mealTimeSlotId.type === RecipeType.easy_add_recipe) {
      navigation.navigate('EasyAdd', { easyAdd: mealTimeSlotId, addAfterUpdate: false })
    } else if (!isEasyAddRecipeIngredient(mealTimeSlotId)) {
      changeMealTimeSlot(mealTimeSlotId)
      navigation.navigate('Food')
    }
  }

  const copyItems = useCallback(() => {
    api.eating
      .copyDiaryItems({
        dates: selectedDays.map((d) => d.format('YYYY-MM-DD')),
        items: selected,
      })
      .then((data) => {
        setSelected([])
        setSelectedDays([])
        setShowCopyModal(false)
        setEditMode(false)
        for (let day of data.data) {
          storeMealPlan({ date: day.date, data: day })
        }
      })
  }, [selected, selectedDays])

  const deleteItems = (sel: SelectedItem[] | null = null) => {
    const selection = sel || selected

    const remainingItems: SelectedItem[] = mealPlan.items
      .filter((x) => !selection.find((y) => x.id === y.id && x.diary_meal_time_slot_id == y.meal_time_slot_id && x.type === y.type))
      .map((i) => ({
        id: i.id,
        type: i.type!,
        meal_time_slot_id: i.diary_meal_time_slot_id!,
      }))

    api.eating
      .deleteDiaryItems({
        date: today.format('YYYY-MM-DD'),
        items: remainingItems,
      })
      .then((data) => {
        storeMealPlan({ date: today.format('YYYY-MM-DD'), data: data.data })
        setSelected([])
        setEditMode(false)
        // listRef?.scrollTo({ x: 0, y: 0, animated: true })
      })
  }

  // const deleteIngredient = (id) => {
  //   api.eating
  //     .deleteIngredient({
  //       date: today.format('YYYY-MM-DD'),
  //       ingredient: id,
  //     })
  //     .then((data) => storeMealPlan({ date: today.format('YYYY-MM-DD'), data: data.data }))
  // }

  function onToggleSelect(items: SelectedItem[], selectionActive: boolean, toggleAll = false) {
    let newItems = []
    if (!selectionActive) {
      newItems = _.uniqWith([...selected, ...items], _.isEqual)
    } else {
      newItems = selected.filter(
        (x) => !items.find((i) => i.type === x.type && i.id === x.id && i.meal_time_slot_id === x.meal_time_slot_id),
      )
    }

    setSelected(newItems)
  }

  function renderSectionHeader({ section }: { section: SectionListData<IRecipe, DefaultSectionT> }) {
    return (
      <DiaryListHead
        onToggleSelect={onToggleSelect}
        selected={selected.filter((x) => x.meal_time_slot_id === section.slot.id)}
        slot={section.slot}
        items={section.data}
        editMode={editMode}
        showMacros={showMacros}
        handlePress={addFood}
        type={screenType}
      />
    )
  }

  function renderHiddenItem(data: SectionListRenderItemInfo<IRecipe>, rowMap: RowMap<IRecipe>) {
    const r = data.item
    if (r.type === RecipeType.ingredient) {
      return (
        <View style={styles.hiddenEditButtonContainer}>
          <EditButton
            onEdit={() => {
              if (r.key) {
                closeRow(rowMap, r.key)
                setTimeout(() => setSingleEditMode(r.key!), 50)
              }
            }}
          />
          <XButton onDelete={() => deleteItems([{ type: r.type, id: +r.id, meal_time_slot_id: data.section.slot.id }])} />
        </View>
      )
    } else {
      return (
        <View
          style={[
            {
              alignItems: 'center',
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            },
            r.type === 'easy_add_recipe' ? { height: scale(48) } : {},
          ]}>
          <XButton onDelete={() => deleteItems([{ type: r.type, id: +r.id, meal_time_slot_id: data.section.slot.id }])} />
        </View>
      )
    }
  }

  function handleOnToggleSelect(items: SelectedItem[], selectionActive: boolean, toggleAll = false) {
    let newItems = []
    if (!selectionActive) {
      newItems = [...selected, ...items]
    } else {
      newItems = toggleAll
        ? []
        : selected.filter((x) => !items.find((i) => i.type === x.type && i.id === x.id && i.meal_time_slot_id === x.meal_time_slot_id))
    }

    setSelected(newItems)
  }

  function renderItem(data: SectionListRenderItemInfo<IRecipe>) {
    return (
      <DiaryListItem
        item={data.item}
        favorites={favorites}
        singleEditMode={singleEditMode === data.item.key}
        onSave={() => setSingleEditMode(null)}
        onToggleSelect={handleOnToggleSelect}
        selected={selected}
        editMode={editMode}
        date={today.format('YYYY-MM-DD')}
        slot={data.section.slot}
        handlePress={
          data.item.type === RecipeType.recipe
            ? mealPlan?.meal_set
              ? (id) => openRecipe(mealPlan?.meal_set?.id!, id)
              : () => openIndividualRecipe(data.item.base_recipe_id!, +data.item.id, data.item.diary_meal_time_slot_id!)
            : addFood
        }
        ingredientPress={editFood}
        showMacros={showMacros}
      />
    )
  }

  function renderSectionFooter({ section }: { section: SectionListData<IRecipe, DefaultSectionT> }) {
    if (screenType === 0 && !editMode) {
      return (
        <TouchableOpacity onPress={() => addFood(section.slot.id)}>
          <Text style={styles.addFoodBtn}>Add Food</Text>
        </TouchableOpacity>
      )
    }

    return null
  }

  const onRowDidOpen = () => {}

  const closeRow = (rowMap: RowMap<IRecipe>, rowKey: string) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow()
    }
  }

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" />

      <DiaryDateHeader onDayChange={changeDay} navigation={navigation} today={today} />

      <DiaryDateDropdown
        mealPlan={mealPlan}
        navigation={navigation}
        toggleSelect={toggleSelect}
        editMode={editMode}
        setShowDatePicker={setShowDatePicker}
      />

      {screenType === 1 ? (
        <View style={styles.bannerContainer}>
          <View style={styles.recommendedBanner}>
            <View>
              <Text style={styles.bannerHeader}>FIT BODY MEAL PLAN</Text>
              <Text style={styles.bannerTitle}>{mealPlan?.meal_set?.name}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowModal(true)} style={styles.closeBannerBtn}>
              <CloseIcon width={16} height={16} color={globals.styles.colors.colorPink} />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <SwipeListView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.mealContainer,
          editMode ? { paddingBottom: scale(109) } : showMacros ? { paddingBottom: moderateScale(142) } : null,
        ]}
        useSectionList
        closeOnRowPress={true}
        sections={diary}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        renderSectionHeader={renderSectionHeader}
        leftOpenValue={scale(73)}
        rightOpenValue={scale(-73)}
        disableLeftSwipe={screenType === 1 || singleEditMode !== null}
        disableRightSwipe={screenType === 1 || singleEditMode !== null}
        onRowDidOpen={onRowDidOpen}
        renderSectionFooter={renderSectionFooter}
      />

      {!editMode && (
        <BottomUpPanel
          isOpen={true}
          content={() => (
            <MacrosView
              userValues={{ mpr, goal, eatingPreferences }}
              foodValues={
                screenType === 0
                  ? mealPlan?.items || []
                  : [
                      {
                        calories: mealPlan?.meal_set?.total_calories,
                        carbs: mealPlan?.meal_set?.total_carbs,
                        fats: mealPlan?.meal_set?.total_fats,
                        protein: mealPlan?.meal_set?.total_protein,
                      },
                    ] || []
              }
            />
          )}
          topEnd={globals.window.height - moderateScale(147)}
          onAnimationComplete={showHideMacros}
        />
      )}
      {editMode && (
        <ButtonFloatingGroup
          btnLeftText="COPY"
          btnLeftIconName="copy"
          btnLeftStyles={styles.editModeCopyButton}
          onPressLeft={(selected || []).length > 0 ? () => setShowCopyModal(true) : null}
          btnRightText="DELETE"
          btnRightIconName="trash"
          btnRightStyles={styles.editModeDeleteButton}
          onPressRight={(selected || []).length > 0 ? () => deleteItems() : null}
        />
      )}
      <MealPlanModal
        showModal={showModal}
        modalText={"Are you sure you want to\nremove today's meal set?"}
        noButtonText={'NEVER MIND'}
        yesButtonText={'REMOVE SET'}
        noButtonPressHandler={closeModal}
        yesButtonPressHandler={deleteMealSet}
        onClose={closeModal}
      />
      <DatePickerModal
        todayLink={true}
        minYear={new Date().getFullYear() - 1}
        maxDate={moment().add(14, 'days').toDate()}
        date={today.toDate()}
        onDateChange={(date) => {
          changeDay({ full: moment(date) })
          setShowDatePicker(false)
        }}
        onClose={() => setShowDatePicker(false)}
        visible={showDatePicker}
      />
      <DiaryCopyModal
        showModal={showCopyModal}
        closeModal={() => setShowCopyModal(false)}
        sourceDate={today}
        selectedDays={selectedDays}
        selectDayHandler={selectDayHandler}
        createButtonHandler={copyItems}
      />
    </View>
  )
}

const XButton = ({ onDelete }: { onDelete: () => void }) => (
  <View style={[styles.deleteContainer, { backgroundColor: globals.styles.colors.colorLove }]}>
    <ButtonOpacity onPress={onDelete}>
      <CloseIcon color={globals.styles.colors.colorWhite} />
    </ButtonOpacity>
  </View>
)

const EditButton = ({ onEdit }: { onEdit: () => void }) => (
  <View style={[styles.deleteContainer, { backgroundColor: globals.styles.colors.colorSkyBlue }]}>
    <TouchableOpacity onPress={onEdit}>
      <EditIcon color={globals.styles.colors.colorWhite} />
    </TouchableOpacity>
  </View>
)

export default MealPlan
