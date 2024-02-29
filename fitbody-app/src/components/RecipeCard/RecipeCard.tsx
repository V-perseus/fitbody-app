import React, { memo } from 'react'
import { Text, TouchableOpacity, Image, View } from 'react-native'

// Components
import StarOutlineIcon from '../../../assets/images/svg/icon/24px/star-outline.svg'
import AddCircleIcon from '../../../assets/images/svg/icon/40px/circle/add.svg'
import EditedIcon from '../../../assets/images/svg/icon/16px/edited.svg'
import StarIcon from '../../../assets/images/svg/icon/24px/star.svg'

// Assets
import styles from './styles'
import globals from '../../config/globals'
import { EatingPreferencesMap } from '../../config/svgs/dynamic/eatingPreferencesMap'
import { colors } from '../../screens/tabs/eating/EatingPreference/EatingPreference'
import { IFavoriteMeal, IMealPlanRecipe, MealTimeSlot } from '../../data/meal_plan/types'

type MockDataType = {
  id: number
  mealtimeslot: {
    slot_name: MealTimeSlot
    back_end: string
  }
}
const mockData: MockDataType[] = [
  {
    id: 1,
    mealtimeslot: {
      slot_name: MealTimeSlot.Breakfast,
      back_end: 'Breakfast',
    },
  },
  {
    id: 2,
    mealtimeslot: {
      slot_name: MealTimeSlot.Lunch,
      back_end: 'Lunch',
    },
  },
  {
    id: 3,
    mealtimeslot: {
      slot_name: MealTimeSlot.Dinner,
      back_end: 'Dinner',
    },
  },
  {
    id: 4,
    mealtimeslot: {
      slot_name: MealTimeSlot.Snack,
      back_end: 'Morning Snack',
    },
  },
  {
    id: 5,
    mealtimeslot: {
      slot_name: MealTimeSlot.Snack,
      back_end: 'Afternoon Snack',
    },
  },
  {
    id: 6,
    mealtimeslot: {
      slot_name: MealTimeSlot.Snack,
      back_end: 'Post-Workout Snack',
    },
  },
]

interface IRecipeCardProps {
  set: IMealPlanRecipe
  handleRecipeClick: (recipe: IMealPlanRecipe) => void
  favorites?: IFavoriteMeal[]
  onAdd?: (set: IMealPlanRecipe) => void
  onToggleFavorite?: (set: number, name: string, isFavorite: boolean) => void
  horizontal?: boolean
  inMealset: boolean
}
const RecipeCard: React.FC<IRecipeCardProps> = ({ set, handleRecipeClick, favorites, onAdd, onToggleFavorite, inMealset, horizontal }) => {
  let slots = set.meal_time_slots?.filter((x) => !x.toLowerCase().includes('snack'))
  if (set.meal_time_slots?.some((x) => x.toLowerCase().includes('snack'))) {
    slots.push(MealTimeSlot.Snack)
  }

  if (set.diary_meal_time_slot_id) {
    const currentMock = mockData.find((x) => x.id === set.diary_meal_time_slot_id)
    if (currentMock) {
      slots = [currentMock.mealtimeslot.slot_name]
    }
  }

  const isFavorite = favorites?.find((f) => f.type === 'recipe' && f.name === set.name)

  return (
    <TouchableOpacity style={[styles.recipeWrapper, horizontal ? { width: 175 } : {}]} onPress={() => handleRecipeClick(set)}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: set.thumb_img_url }} style={styles.imageWrapper} />
      </View>
      <View style={styles.iconsContainer}>
        {set.tags
          .filter((x) => (set.tags.length > 1 && x !== 'REGULAR') || set.tags.length === 1)
          .map((tag, idx) => {
            const SvgIcon = EatingPreferencesMap?.[tag]
            return SvgIcon ? <SvgIcon key={`eating_icon_${idx}`} color={colors[tag]} style={styles.icon} width={24} height={24} /> : null
          })}
      </View>
      <Text style={styles.category}>{(slots || []).join(', ').toUpperCase() || '[UNKNOWN]'}</Text>
      <Text style={styles.itemTitle}>{set.name}</Text>
      <View style={{ flexGrow: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            borderTopWidth: 1,
            borderColor: globals.styles.colors.colorGrayLight,
            paddingVertical: 8,
          }}>
          <Text
            style={{
              fontSize: 10,
              fontFamily: globals.fonts.primary.style.fontFamily,
              color: globals.styles.colors.colorGrayDark,
              marginTop: 5,
            }}>
            Cal
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: globals.fonts.secondary.style.fontFamily,
              color: globals.styles.colors.colorGrayDark,
              marginLeft: 1,
            }}>
            {Math.round(set.calories)}
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: globals.fonts.primary.style.fontFamily,
              color: globals.styles.colors.colorGrayDark,
              marginLeft: 8,
              marginTop: 5,
            }}>
            P
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: globals.fonts.secondary.style.fontFamily,
              color: globals.styles.colors.colorGrayDark,
              marginLeft: 1,
            }}>
            {Math.round(set.protein)}
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: globals.fonts.primary.style.fontFamily,
              color: globals.styles.colors.colorGrayDark,
              marginLeft: 1,
              marginTop: 5,
            }}>
            g
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: globals.fonts.primary.style.fontFamily,
              color: globals.styles.colors.colorGrayDark,
              marginLeft: 8,
              marginTop: 5,
            }}>
            C
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: globals.fonts.secondary.style.fontFamily,
              color: globals.styles.colors.colorGrayDark,
              marginLeft: 1,
            }}>
            {Math.round(set.carbs)}
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: globals.fonts.primary.style.fontFamily,
              color: globals.styles.colors.colorGrayDark,
              marginLeft: 1,
              marginTop: 5,
            }}>
            g
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: globals.fonts.primary.style.fontFamily,
              color: globals.styles.colors.colorGrayDark,
              marginLeft: 8,
              marginTop: 5,
            }}>
            F
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: globals.fonts.secondary.style.fontFamily,
              color: globals.styles.colors.colorGrayDark,
              marginLeft: 1,
            }}>
            {Math.round(set.fats)}
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: globals.fonts.primary.style.fontFamily,
              color: globals.styles.colors.colorGrayDark,
              marginLeft: 1,
              marginTop: 5,
            }}>
            g
          </Text>
        </View>
      </View>
      {!inMealset && (
        <TouchableOpacity onPress={() => onAdd?.(set)} style={{ position: 'absolute', right: 8, top: 8 }}>
          <AddCircleIcon color={globals.styles.colors.colorPink} />
        </TouchableOpacity>
      )}
      {set.user_generated && (
        <View
          style={{
            position: 'absolute',
            left: 8,
            top: 109,
            borderRadius: 2,
            width: 22,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: globals.styles.colors.colorTransparentWhite75,
          }}>
          <EditedIcon color={globals.styles.colors.colorTwilight} />
        </View>
      )}

      {!inMealset && (
        <TouchableOpacity
          onPress={() => onToggleFavorite?.(set.id, set.name, !!isFavorite)}
          style={{
            position: 'absolute',
            left: 8,
            top: 8,
            borderRadius: 20,
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: globals.styles.colors.colorTransparentWhite75,
          }}>
          {isFavorite ? (
            <StarIcon color={globals.styles.colors.colorYellow} />
          ) : (
            <StarOutlineIcon color={globals.styles.colors.colorBlack} />
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )
}

export default memo(RecipeCard)
