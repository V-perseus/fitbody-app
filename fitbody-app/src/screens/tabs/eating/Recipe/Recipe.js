import React, { Component } from 'react'
import { Text, TouchableOpacity, View, ScrollView, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import HeaderImageScrollView from 'react-native-image-header-scroll-view'
import { connect } from 'react-redux'

// Components
import NutritionFacts from '../../../../components/NutritionFacts'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

// Assets
import styles from './styles'
import globals from '../../../../config/globals'
import { EatingPreferencesMap } from '../../../../config/svgs/dynamic/eatingPreferencesMap'
import CookingIcon from '../../../../../assets/images/svg/icon/24px/cooking.svg'
import PreppedIcon from '../../../../../assets/images/svg/icon/24px/prepped.svg'
import DownChevron from '../../../../../assets/images/svg/icon/16px/cheveron/down.svg'
import UpChevron from '../../../../../assets/images/svg/icon/16px/cheveron/up.svg'
import { colors } from '../EatingPreference/EatingPreference'

class Recipe extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerShown: false,
  })

  constructor(props) {
    super(props)

    this.state = {
      hideNutritions: false,
      hideIngredients: false,
    }
  }

  render() {
    const recipe = this.props.route.params?.recipe ?? {}
    const { hideNutritions, hideIngredients } = this.state

    return (
      <HeaderImageScrollView
        maxHeight={417}
        minHeight={0}
        headerImage={{ uri: recipe.full_img_url.replace('%2Fthumb', '') }}
        renderForeground={() => (
          <LinearGradient style={{ height: 107, width: '100%', position: 'relative' }} colors={['rgba(0, 0, 0, 0.68)', 'rgba(0, 0, 0, 0)']}>
            <HeaderButton
              style={{ position: 'absolute', top: 52, left: 6 }}
              onPress={() => this.props.navigation.goBack()}
              iconColor={globals.styles.colors.colorWhite}
            />
          </LinearGradient>
        )}>
        <View
          style={{
            marginTop: Platform.select({ android: 0, ios: -30 }),
            flex: 1,
            flexDirection: 'column',
            paddingBottom: 42,
            paddingTop: 8,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: globals.styles.colors.colorWhite,
          }}>
          <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
            <View
              style={{
                width: 32,
                height: 5,
                borderRadius: 2.5,
                backgroundColor: globals.styles.colors.colorGray,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            />
          </View>
          {/* <TriggeringView onHide={() => console.log('text hidden')}> */}
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Text style={styles.slotName}>{recipe.meal_time_slot}</Text>
          <ScrollView contentContainerStyle={{ marginLeft: 12 }} horizontal={true} showsHorizontalScrollIndicator={false}>
            {recipe.eating_preferences.map((t, idx) => {
              const SvgIcon = EatingPreferencesMap[t.key]
              return (
                <TouchableOpacity key={idx} style={[styles.roundButton, { backgroundColor: colors[t.key] }]} onPress={() => {}}>
                  <SvgIcon color={globals.styles.colors.colorWhite} height={22} width={22} />
                  <Text style={styles.foodTypeLabel}>{t.name}</Text>
                </TouchableOpacity>
              )
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
            {recipe.prep_time > 0 && (
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
                {recipe.yields} SERVING{recipe.yields > 1 ? 'S' : ''}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.nutritionsToggle} onPress={() => this.setState({ hideNutritions: !hideNutritions })}>
            <Text style={styles.toggleLabel}>{hideNutritions ? 'Show Nutrition Facts' : 'Hide Nutrition Facts'}</Text>
            {hideNutritions ? (
              <DownChevron color={globals.styles.colors.colorBlack} />
            ) : (
              <UpChevron color={globals.styles.colors.colorBlack} />
            )}
          </TouchableOpacity>
          {!hideNutritions && (
            <View style={{ borderBottomWidth: 3, borderBottomColor: globals.styles.colors.colorGrayLight }}>
              <NutritionFacts
                eatingPreferences={this.props.data.user.eating_preferences}
                recipe={recipe}
                macrosOnly={true}
                isRecipe={true}
                multiplier={1}
              />
            </View>
          )}
          <Text style={[styles.ingredientsLabel, { paddingHorizontal: 24 }]}>INGREDIENTS:</Text>
          <TouchableOpacity style={styles.nutritionsToggle} onPress={() => this.setState({ hideIngredients: !hideIngredients })}>
            <Text style={styles.toggleLabel}>{hideIngredients ? 'Show Ingredients' : 'Hide Ingredients'}</Text>
            {hideIngredients ? (
              <DownChevron color={globals.styles.colors.colorBlack} />
            ) : (
              <UpChevron color={globals.styles.colors.colorBlack} />
            )}
          </TouchableOpacity>
          {!hideIngredients && (
            <View style={styles.ingredientsContainer}>
              {recipe.ingredients.map((ingredient, idx) => (
                <View key={idx} style={styles.ingredientWrapper}>
                  <View style={styles.listItemMark} />
                  <Text style={styles.ingredientInfo}>
                    {`${ingredient.name}${ingredient.quantity ? ': ' + ingredient.quantity : ''}`.trim()}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <View style={[styles.ingredientsContainer, { borderBottomWidth: 8, borderColor: globals.styles.colors.colorPink }]}>
            <Text style={[styles.ingredientsLabel, { marginBottom: 10 }]}>YOU WILL NEED:</Text>
            {recipe.tools.map((item, idx) => (
              <View key={idx} style={styles.ingredientWrapper}>
                <View style={styles.listItemMark} />
                <Text style={styles.ingredientInfo}>{item.item_name}</Text>
              </View>
            ))}
          </View>
          <View style={styles.ingredientsContainer}>
            <Text style={styles.ingredientsLabel}>INSTRUCTIONS:</Text>
            <Text style={{ fontSize: 13, lineHeight: 19, fontFamily: globals.fonts.primary.style.fontFamily }}>{recipe.instructions}</Text>
          </View>
          {/* </TriggeringView> */}
        </View>
      </HeaderImageScrollView>
    )
  }
}

export default connect(
  // mapStateToProps
  (state) => ({
    data: {
      user: state.data.user,
    },
  }),
)(Recipe)
