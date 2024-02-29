import React from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import PropTypes from 'prop-types'

// Components
import EditedIcon from '../../../assets/images/svg/icon/16px/edited.svg'
import StarIcon from '../../../assets/images/svg/icon/16px/star.svg'
import AddCircleIcon from '../../../assets/images/svg/icon/40px/circle/add.svg'

// Assets
import styles from './styles'
import easyadd from '../../../assets/images/eating/easyadd.png'
import mealset from '../../../assets/images/eating/mealset.png'
import globals from '../../config/globals'

/**
 * Component to display a food item (ingredient, meal-set, recipe, easy-add recipe) on a diary9.
 */
const FoodItem = ({ handleAdd, handlePress, food, favorites }) => (
  <TouchableOpacity
    onPress={() => handlePress(food.nix_item_id || food.food_name || food.nix_food_name)}
    key={food.nix_item_id}
    style={styles.container}>
    <View style={styles.foodContainer}>
      <View
        style={[
          styles.foodImage,
          food.type === 'recipe' || food.type === 'easy_add_recipe' || food.type === 'meal_set' || !food.type ? { borderRadius: 3.2 } : {},
        ]}>
        {food.type === 'easy_add_recipe' ? (
          <Image source={easyadd} style={{ width: 48, height: 48 }} resizeMode={'cover'} />
        ) : food.type === 'meal_set' ? (
          <Image source={mealset} style={{ width: 48, height: 48 }} resizeMode={'cover'} />
        ) : (
          <Image
            source={{
              uri: food.photo ? food.photo.thumb : food.thumb_img_url ? food.thumb_img_url : food.img_url,
            }}
            style={{ width: 48, height: 48 }}
            resizeMode={'cover'}
          />
        )}
      </View>
      <View style={styles.titleContainer}>
        {food.type === 'recipe' && (
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.typeTitle}>FIT BODY RECIPE</Text>
            {food.user_generated && <EditedIcon style={{ marginLeft: 8 }} color={globals.styles.colors.colorTwilight} />}
          </View>
        )}
        {food.type === 'easy_add_recipe' && <Text style={styles.typeTitle}>EASY ADD</Text>}
        {food.type === 'meal_set' && <Text style={styles.typeTitle}>FIT BODY MEAL SET</Text>}
        <Text
          style={[
            styles.name,
            food.type === 'meal_set' ? { fontSize: 20, fontFamily: globals.fonts.secondary.style.fontFamily, fontWeight: 'normal' } : {},
          ]}>
          {food.food_name || food.name}
        </Text>
        {(food.brand_name || food.quantity || food.serving_qty) && (
          <Text style={styles.amount}>
            {food.brand_name ? `${food.brand_name}, ` : ''}
            {+parseFloat(food.quantity || food.serving_qty).toFixed(2)} {food.serving_unit}
          </Text>
        )}
      </View>
    </View>
    <TouchableOpacity style={styles.addFoodBtn} onPress={() => handleAdd(food.nix_item_id || food.food_name || food.nix_food_name)}>
      {favorites.find(
        (f) =>
          (f.type === food.type && food.type === 'recipe' && f.name === food.name) ||
          (food.type === 'easy_add_recipe' && (f.id === food.base_id || f.id === food.id)) ||
          (food.type === 'meal_set' && f.name === food.name),
      ) && <StarIcon style={{ marginRight: 8 }} color={globals.styles.colors.colorYellow} />}
      <AddCircleIcon color={globals.styles.colors.colorPink} />
    </TouchableOpacity>
  </TouchableOpacity>
)

FoodItem.propTypes = {
  favorites: PropTypes.array,
  /**
   * Food item to display (ingredient, recipe, meal-set, or easy-add recipe).
   */
  food: PropTypes.object.isRequired,
  /**
   * Event handler for the add button.
   */
  handleAdd: PropTypes.func,
  /**
   * Event handler for tapping the item itself.
   */
  handlePress: PropTypes.func,
}

export default FoodItem
