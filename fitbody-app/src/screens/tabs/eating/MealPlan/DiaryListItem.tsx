import React, { memo, useState, useEffect } from 'react'
import { TouchableOpacity, View, Text, Image, TextInput, StyleSheet } from 'react-native'
import { scale, moderateScale } from 'react-native-size-matters/extend'

// Assets
import CircleOutlineIcon from '../../../../../assets/images/svg/icon/24px/circle/circle-outline.svg'
import CircleCheckedIcon from '../../../../../assets/images/svg/icon/24px/circle/check-filled.svg'
import StarSelectedIcon from '../../../../../assets/images/svg/icon/24px/star.svg'
import ChevronRight from '../../../../../assets/images/svg/icon/16px/cheveron/right.svg'
import ChevronDown from '../../../../../assets/images/svg/icon/16px/cheveron/down.svg'
import EditedIcon from '../../../../../assets/images/svg/icon/16px/edited.svg'

// Components
import SinglePickerModal from '../../../../components/SinglePickerModal'

// Styles
import globals from '../../../../config/globals'

// Services
import api from '../../../../services/api'
import { storeMealPlan } from '../../../../data/meal_plan'
import {
  Measure,
  SelectedItem,
  IRenderableIngredientItem,
  IMealPlanIngredient,
  IIngredientDetailsResponse,
  RecipeType,
} from '../../../../data/meal_plan/types'

export interface IDiaryListItemProps {
  item: any
  recipeEdit?: boolean
  editMode: boolean
  singleEditMode: boolean
  date?: string
  onSave: (ingredient?: any) => void
  handlePress: (val: any) => void
  slot: { id: number }
  showMacros: boolean
  ingredientPress: (item: IMealPlanIngredient, id: number) => void
  onToggleSelect: (items: SelectedItem[], selectionActive: boolean, toggleAll?: boolean) => void
  selected: any[]
  favorites: any[]
}
const DiaryListItem = ({
  item,
  recipeEdit,
  editMode,
  singleEditMode,
  date,
  onSave,
  handlePress,
  slot,
  showMacros,
  ingredientPress,
  onToggleSelect,
  selected,
  favorites,
}: IDiaryListItemProps) => {
  const [ingredient, setIngredient] = useState<IIngredientDetailsResponse>(item)
  const [showPicker, setShowPicker] = useState(false)
  const [detailsLoaded, setDetailsLoaded] = useState(false)
  const [measure, setMeasure] = useState<Measure | null>(null)
  const [isDirty, setDirty] = useState(false)
  const [currentValues, setCurrentValues] = useState<Partial<IIngredientDetailsResponse> | null>(null)

  useEffect(() => {
    if (singleEditMode && !detailsLoaded) {
      setDetailsLoaded(true)
      api.eating.ingredientDetails({ id: item.nix_item_id! || item.nix_food_name! }).then((data) => {
        setIngredient(data)
      })
    }
  }, [singleEditMode, detailsLoaded, item])

  const handleSave = () => {
    if (!recipeEdit && currentValues && date) {
      api.eating.updateDiaryIngredient(date, currentValues).then((data) => {
        storeMealPlan({ date, data: data.data })
        onSave()
      })
    } else {
      onSave({
        ...(currentValues || {}),
        base_ingredient_id: item.base_ingredient_id,
      })
    }
  }

  useEffect(() => {
    if (!isDirty) {
      setCurrentValues({ ...item, meal_time_slot_id: slot.id })
      return
    }
    let calories, carbs, protein, fats

    let multiplier = 1
    // Based on ingredient data, translate r values to grams
    if (ingredient && !ingredient.alt_measures && measure?.amount) {
      // If no alt measures, only the quantity can change, so we can directly calculate the multiplier
      multiplier = measure.amount / ingredient.serving_qty
    } else if (measure && measure?.amount && ingredient) {
      // If alt measures exists, we can't work with quantity anymore.
      // 1. translate the current quantity + unit into grams
      // 2. calculate multiplier based on serving_weight_grams base value on ingredient
      const altMeasure = ingredient.alt_measures?.find((m) => m.measure === (measure.serving_unit || item.serving_unit))
      if (altMeasure) {
        const serving_weight = (measure.amount / (altMeasure?.qty ?? 1)) * altMeasure.serving_weight
        multiplier = serving_weight / ingredient.serving_weight_grams
      } else {
        // If no alt measure is found, calculate multiplier based on quantity from text input
        multiplier = measure.amount
      }
    }

    calories = ingredient.calories * multiplier
    carbs = (ingredient.total_carbohydrate || ingredient.carbs)! * multiplier
    protein = ingredient.protein * multiplier
    fats = (ingredient.total_fat || ingredient.fats)! * multiplier

    // console.log('old ingredient - ', ingredient)

    const newIngredient: Partial<IRenderableIngredientItem> = {
      id: item.id,
      calories: calories || 0,
      carbs: carbs || 0,
      protein: protein || 0,
      fats: fats || 0,
      quantity: measure?.amount || 0,
      serving_unit: measure?.serving_unit || item.serving_unit,
      meal_time_slot_id: slot.id,
    }

    setCurrentValues(newIngredient)
  }, [measure, item, ingredient, slot.id, isDirty])

  switch (item.type) {
    case RecipeType.recipe:
      return (
        <View style={{ backgroundColor: globals.styles.colors.colorWhite }}>
          <TouchableOpacity onPress={() => handlePress(item.id)} style={styles.recipePanel}>
            <>
              <View style={styles.recipeDetails}>
                {editMode && (
                  <TouchableOpacity
                    testID="edit_recipe_btn"
                    onPress={() => {
                      onToggleSelect(
                        [{ type: item.type, id: item.id, meal_time_slot_id: slot.id }],
                        selected.find((s) => s.type === item.type && s.id === item.id && s.meal_time_slot_id === slot.id),
                      )
                    }}>
                    {selected.some((x) => x.type === item.type && x.id === item.id && x.meal_time_slot_id === slot.id) ? (
                      <CircleCheckedIcon
                        width={scale(24)}
                        height={scale(24)}
                        color={globals.styles.colors.colorPurple}
                        style={{ marginRight: scale(24) }}
                      />
                    ) : (
                      <CircleOutlineIcon
                        width={scale(24)}
                        height={scale(24)}
                        color={globals.styles.colors.colorGray}
                        style={{ marginRight: scale(24) }}
                      />
                    )}
                  </TouchableOpacity>
                )}
                <Image source={{ uri: item.thumb_img_url }} style={styles.recipeImg} testID="recipe_img" />
                <View style={styles.recipeInfo}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.recipeLabel}>FIT BODY RECIPE</Text>
                    {item.user_generated && <EditedIcon color={globals.styles.colors.colorTwilight} style={{ marginLeft: 8 }} />}
                  </View>
                  <Text style={styles.recipeTitle}>{item.name}</Text>
                </View>
              </View>
              <View style={styles.arrowIcon}>
                {favorites.find((f) => f.type === RecipeType.recipe && f.name === item.name) && (
                  <TouchableOpacity
                    testID="favorite_recipe_btn"
                    onPress={() => {
                      onToggleSelect(
                        [{ type: item.type, id: item.id, meal_time_slot_id: slot.id }],
                        selected.find((s) => s.type === item.type && s.id === item.id && s.meal_time_slot_id === slot.id),
                      )
                    }}>
                    <StarSelectedIcon style={{ marginRight: 8 }} height={16} width={16} color={globals.styles.colors.colorYellow} />
                  </TouchableOpacity>
                )}
                <ChevronRight height={18} width={18} color={globals.styles.colors.colorBlack} />
              </View>
            </>
          </TouchableOpacity>
        </View>
      )
    case RecipeType.easy_add_recipe:
      return (
        <View style={{ backgroundColor: globals.styles.colors.colorWhite }}>
          <TouchableOpacity onPress={() => handlePress(item)} style={[styles.recipePanel, { height: scale(48), borderBottomWidth: 0 }]}>
            <>
              <View style={styles.recipeDetails}>
                {editMode && (
                  <TouchableOpacity
                    testID="edit_easy_add_btn"
                    onPress={() => {
                      onToggleSelect(
                        [{ type: item.type, id: item.id, meal_time_slot_id: slot.id }],
                        selected.find((s) => s.type === item.type && s.id === item.id && s.meal_time_slot_id === slot.id),
                      )
                    }}>
                    {selected.some((x) => x.type === item.type && x.id === item.id && x.meal_time_slot_id === slot.id) ? (
                      <CircleCheckedIcon
                        width={scale(24)}
                        height={scale(24)}
                        color={globals.styles.colors.colorPurple}
                        style={{ marginRight: scale(24) }}
                      />
                    ) : (
                      <CircleOutlineIcon
                        width={scale(24)}
                        height={scale(24)}
                        color={globals.styles.colors.colorGray}
                        style={{ marginRight: scale(24) }}
                      />
                    )}
                  </TouchableOpacity>
                )}
                {/* {!props.recipeEdit && <Image source={easyadd} style={styles.recipeImg} />} */}
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeLabel}>EASY ADD</Text>
                  <Text style={styles.recipeTitle}>{item.name}</Text>
                </View>
              </View>
              {!recipeEdit && (
                <View style={styles.arrowIcon}>
                  {favorites.find((f) => f.type === 'easy_add_recipe' && f.id === item.base_easy_add_recipe_id) && (
                    <StarSelectedIcon color={globals.styles.colors.colorYellow} style={{ marginRight: 8 }} height={16} width={16} />
                  )}
                  <ChevronRight height={18} width={18} color={globals.styles.colors.colorBlack} />
                </View>
              )}
              {recipeEdit && showMacros && <Text style={styles.amount}>{Math.round(currentValues?.calories || item.calories)}</Text>}
            </>
          </TouchableOpacity>
        </View>
      )

    default:
      return (
        <>
          <View>
            <View
              style={[
                styles.itemWrapper,
                singleEditMode
                  ? {
                      backgroundColor: globals.styles.colors.colorGrayLight,
                      borderLeftWidth: 4,
                      paddingLeft: scale(24) - 4,
                      paddingBottom: 1,
                      borderLeftColor: globals.styles.colors.colorSkyBlue,
                      borderTopWidth: 1,
                      borderTopColor: globals.styles.colors.colorGray,
                    }
                  : null,
              ]}>
              {editMode && (
                <TouchableOpacity
                  testID="edit_default_edit_btn"
                  onPress={() => {
                    onToggleSelect(
                      [{ type: item.type, id: item.id, meal_time_slot_id: slot.id }],
                      selected.find((s) => s.type === item.type && s.id === item.id && s.meal_time_slot_id === slot.id),
                    )
                  }}>
                  {selected.some((x) => x.type === item.type && x.id === item.id && x.meal_time_slot_id === slot.id) ? (
                    <CircleCheckedIcon
                      width={scale(24)}
                      height={scale(24)}
                      color={globals.styles.colors.colorPurple}
                      style={{ marginRight: scale(24) }}
                    />
                  ) : (
                    <CircleOutlineIcon
                      width={scale(24)}
                      height={scale(24)}
                      color={globals.styles.colors.colorGray}
                      style={{ marginRight: scale(24) }}
                    />
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => ingredientPress(item, slot.id)} style={styles.itemContents}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.itemTitle}>
                  {item.name}
                </Text>
                <Text style={styles.itemDesc}>
                  {item.brand_name ? `${item.brand_name}, ` : ''}
                  {+parseFloat(String(currentValues?.quantity ?? '0')).toFixed(2)} {currentValues?.serving_unit || item.serving_unit}
                </Text>
              </TouchableOpacity>
              {showMacros && <Text style={styles.amount}>{Math.round(currentValues?.calories ?? 0)}</Text>}
            </View>
          </View>
          {singleEditMode && (
            <View style={styles.singleEditContainer}>
              <View style={styles.singleEditServingSizeContainer}>
                <Text style={styles.servingEditInputLabel}>Serving Size:</Text>
                <TouchableOpacity
                  onPress={ingredient.alt_measures ? () => setShowPicker(true) : undefined}
                  style={styles.singleEditServingButton}>
                  <Text style={styles.singeEditServingUnitText}>{currentValues?.serving_unit || ingredient.serving_unit}</Text>
                  {ingredient.alt_measures && <ChevronDown width={scale(12)} height={scale(12)} color={globals.styles.colors.colorBlack} />}
                </TouchableOpacity>
              </View>
              <View style={styles.singleEditServingCountContainer}>
                <Text style={styles.servingEditInputLabel}>Number of Servings:</Text>
                <TextInput
                  keyboardType="decimal-pad"
                  defaultValue={(+parseFloat(currentValues?.quantity + '' || measure?.amount + '' || '0').toFixed(2)).toString()}
                  style={styles.singleEditServingCountInput}
                  returnKeyType={'done'}
                  onChangeText={(v) => {
                    setDirty(true)
                    setMeasure((m) => ({ ...(m || {}), amount: v ? parseFloat(v) : null }))
                  }}
                  onSubmitEditing={({ nativeEvent: { text } }) => {
                    setDirty(true)
                    setMeasure((m) => ({ ...(m || {}), amount: text ? parseFloat(text) : null }))
                  }}
                />
              </View>
              <View style={styles.singleEditSaveContainer}>
                <TouchableOpacity onPress={handleSave} style={styles.singleEditSaveButton}>
                  <Text style={styles.singleEditSaveButtonText}>SAVE</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {ingredient.alt_measures && (
            <SinglePickerModal
              items={ingredient.alt_measures.map((m) => ({ text: m.measure, value: m }))}
              selectedIndex={ingredient.alt_measures.findIndex((x) => x.measure === (item.serving_unit || ingredient.serving_unit))}
              onValueChange={(val) => {
                setDirty(true)
                setMeasure({
                  amount: val.value.qty,
                  serving_weight: val.value.serving_weight / val.value.qty,
                  serving_unit: val.value.measure,
                })
                setShowPicker(false)
              }}
              onClose={() => setShowPicker(false)}
              visible={showPicker}
            />
          )}
        </>
      )
  }
}

export default memo(DiaryListItem)

const styles = StyleSheet.create({
  recipePanel: {
    width: '100%',
    height: scale(96),
    backgroundColor: globals.styles.colors.colorWhite,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(24),
    borderBottomColor: globals.styles.colors.colorGray,
    borderBottomWidth: 1,
  },
  recipeDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globals.styles.colors.colorWhite,
  },
  recipeImg: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: 3.2,
    marginRight: scale(17),
  },
  recipeInfo: {
    flex: 1,
  },
  recipeLabel: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: moderateScale(12),
    color: globals.styles.colors.colorBlackDark,
  },
  recipeTitle: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: moderateScale(14),
    color: globals.styles.colors.colorBlackDark,
  },
  arrowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: scale(40),
    height: scale(20),
    marginLeft: scale(17),
  },
  itemWrapper: {
    // width: '100%',
    height: scale(48),
    backgroundColor: globals.styles.colors.colorWhite,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(24),
  },
  itemContents: {
    flex: 1,
  },
  itemTitle: {
    fontSize: moderateScale(14),
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorBlackDark,
  },
  itemDesc: {
    fontSize: moderateScale(13),
    fontFamily: globals.fonts.primary.style.fontFamily,
    color: globals.styles.colors.colorGrayDark,
  },
  amount: {
    width: scale(64),
    fontSize: moderateScale(15),
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorBlackDark,
    textAlign: 'right',
  },
  singleEditContainer: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: globals.styles.colors.colorGray,
    marginTop: scale(16),
    paddingHorizontal: scale(24),
    paddingBottom: scale(16),
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  singleEditServingSizeContainer: { flexDirection: 'column', flex: 1, marginRight: scale(4) },
  servingEditInputLabel: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: moderateScale(12),
    color: globals.styles.colors.colorBlack,
  },
  singleEditServingButton: {
    flexDirection: 'row',
    paddingHorizontal: scale(11),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scale(5),
    borderWidth: 1,
    height: scale(44),
    borderRadius: 3,
    borderStyle: 'solid',
    borderColor: globals.styles.colors.colorGray,
  },
  singeEditServingUnitText: { fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: moderateScale(14) },
  singleEditServingCountInput: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: moderateScale(14),
    paddingHorizontal: scale(11),
    marginTop: scale(5),
    borderWidth: 1,
    color: globals.styles.colors.colorBlackDark,
    height: scale(44),
    borderRadius: 3,
    borderStyle: 'solid',
    borderColor: globals.styles.colors.colorGray,
  },
  singleEditServingCountContainer: { flexDirection: 'column', flex: 1, marginLeft: scale(4) },
  singleEditSaveContainer: { width: scale(77), paddingLeft: scale(16) },
  singleEditSaveButton: {
    width: scale(61),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(8),
    backgroundColor: globals.styles.colors.colorSkyBlue,
  },
  singleEditSaveButtonText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: moderateScale(12),
    color: globals.styles.colors.colorWhite,
  },
})
