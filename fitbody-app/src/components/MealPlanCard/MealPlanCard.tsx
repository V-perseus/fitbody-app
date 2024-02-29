import React, { memo } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'

// Components
import globals from '../../config/globals'
import RecipeCard from '../RecipeCard'
import StarIcon from '../../../assets/images/svg/icon/24px/star.svg'
import StarOutlineIcon from '../../../assets/images/svg/icon/24px/star-outline.svg'

// Assets
import styles from './styles'
import { IMealPlan } from '../../data/meal_plan/types'

interface IMealPlanCardProps {
  favorites: any[]
  plan: IMealPlan
  toggleFavorite: (plan: any, name: string, isFavorite: boolean) => void
  handleRecipeClick: (recipe: any) => void
  handleAddSet: (plan: any) => void
}
const MealPlanCard: React.FC<IMealPlanCardProps> = ({ plan, favorites, toggleFavorite, handleRecipeClick, handleAddSet }) => {
  const isFavorite = favorites?.find((f) => f.type === 'meal_set' && (f.id === plan.id || f.name === plan.name))

  return (
    <View style={styles.container}>
      <View style={{ paddingLeft: 24, flexDirection: 'row', alignItems: 'center' }}>
        <View>
          <Text style={styles.mealTitle}>{plan.name}</Text>
          <View style={styles.macrosContainer}>
            <Text style={styles.macros}>
              {plan.total_calories} <Text style={styles.metricText}>Cal</Text>
            </Text>
            <View style={styles.dot} />
            <Text style={styles.macros}>
              {plan.total_protein}
              <Text style={styles.metricText}>g Protein</Text>
            </Text>
            <View style={styles.dot} />
            <Text style={styles.macros}>
              {plan.total_carbs}
              <Text style={styles.metricText}>g Carbs</Text>
            </Text>
            <View style={styles.dot} />
            <Text style={styles.macros}>
              {plan.total_fats}
              <Text style={styles.metricText}>g Fats</Text>
            </Text>
          </View>
        </View>
        <View style={{ flexGrow: 1, alignSelf: 'stretch', justifyContent: 'center', marginRight: 24, alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => toggleFavorite(plan.id, plan.name, isFavorite)}>
            {isFavorite ? (
              <StarIcon color={globals.styles.colors.colorYellow} />
            ) : (
              <StarOutlineIcon color={globals.styles.colors.colorBlack} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          initialNumToRender={4}
          data={plan.recipes || []}
          getItemLayout={(_, index) => ({
            length: 175,
            offset: 175 * index,
            index,
          })}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.itemsContainer}
          renderItem={({ item, index }) => (
            <RecipeCard key={index} set={item} handleRecipeClick={handleRecipeClick} horizontal={true} inMealset={true} />
          )}
        />
      </View>
      <TouchableOpacity style={styles.addSetButton} onPress={handleAddSet}>
        <Text style={styles.addSetButtonText}>ADD SET</Text>
      </TouchableOpacity>
    </View>
  )
}

export default memo(MealPlanCard)
