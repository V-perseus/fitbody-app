import React from 'react'
import { Text, View } from 'react-native'
import { Svg, Circle, Defs, LinearGradient as LG, Stop } from 'react-native-svg'
import globals from '../../config/globals'

// Assets
import styles from './styles'

const NutritionFacts = (props) => {
  // console.log(props.multiplier)

  const roundedProtein = Math.round((props.recipe.protein || 0) * props.multiplier * 10) / 10
  const roundedCarbs =
    Math.round(((props.isRecipe ? props.recipe.carbs : props.recipe.total_carbohydrate) || 0) * props.multiplier * 10) / 10
  const roundedFat = Math.round(((props.isRecipe ? props.recipe.fats : props.recipe.total_fat) || 0) * props.multiplier * 10) / 10

  // console.log('roundedProtein', roundedProtein)
  // console.log('roundedCarbs', roundedCarbs)
  // console.log('roundedFat', roundedFat)

  const total = roundedProtein * 4 + roundedCarbs * 4 + roundedFat * 9
  const carbsPerc = Math.round(((roundedCarbs * 4) / total) * 100)
  const fatPerc = Math.round(((roundedFat * 9) / total) * 100)
  const proteinPerc = 100 - carbsPerc - fatPerc

  const origPercentages = [carbsPerc, fatPerc, proteinPerc]

  // console.log(origPercentages)

  let percentages = []
  let smallest = origPercentages.findIndex((f) => f < 4 && f > 0)

  if (smallest !== -1) {
    // We have one smaller than 10 percent, and need to 'cheat'
    let diff = 4 - origPercentages[smallest]

    percentages = origPercentages.map((e, index) => {
      return index === smallest ? e + diff : e - diff / 2
    })
  } else {
    percentages = origPercentages
  }

  // console.log(percentages)

  let dailyFuel = Math.trunc(props.mpr)

  // Daily calorie breakdown
  let dailyProtein, dailyCarbs, dailyFats
  if (props.eatingPreferences.find((x) => x.key === 'KETO')) {
    dailyProtein = Math.round((0.2 * dailyFuel) / 4)
    dailyCarbs = Math.round((0.1 * dailyFuel) / 4)
    dailyFats = Math.round((0.7 * dailyFuel) / 9)
  } else if (props.goal === 'LOSE' || dailyFuel <= 2000) {
    dailyProtein = Math.round((0.3 * dailyFuel) / 4)
    dailyCarbs = Math.round((0.4 * dailyFuel) / 4)
    dailyFats = Math.round((0.3 * dailyFuel) / 9)
  } else if (props.goal === 'MAINTAIN' || props.goal === 'GAIN') {
    dailyProtein = Math.round((0.2 * dailyFuel) / 4)
    dailyCarbs = Math.round((0.5 * dailyFuel) / 4)
    dailyFats = Math.round((0.3 * dailyFuel) / 9)
  } else {
    dailyProtein = Math.round((0.1 * dailyFuel) / 4)
    dailyCarbs = Math.round((0.7 * dailyFuel) / 4)
    dailyFats = Math.round((0.2 * dailyFuel) / 9)
  }

  const maxSaturatedFat = (props.recipe.saturated_fat * props.multiplier || 0) / ((20 * dailyFuel) / 2000)
  const maxCholesterol = (props.recipe.cholesterol * props.multiplier || 0) / ((300 * dailyFuel) / 2000)
  const maxSodium = (props.recipe.sodium * props.multiplier || 0) / ((2400 * dailyFuel) / 2000)
  const maxPotassium = (props.recipe.potassium * props.multiplier || 0) / ((4700 * dailyFuel) / 2000)
  const maxFiber = (props.recipe.dietary_fiber * props.multiplier || 0) / ((25 * dailyFuel) / 2000)

  return (
    <React.Fragment>
      <View style={styles.nutritionsContainer}>
        <View>
          <Svg width={88} height={88} viewBox="2 2 38 38" class="donut">
            <Defs>
              <LG id="fats" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={globals.styles.colors.colorAqua} />
                <Stop offset="100%" stopColor={globals.styles.colors.colorAqua} />
              </LG>
              <LG id="carbs" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={globals.styles.colors.colorPurple} />
                <Stop offset="100%" stopColor={globals.styles.colors.colorPurple} />
              </LG>
              <LG id="proteins" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={globals.styles.colors.colorLove} />
                <Stop offset="100%" stopColor={globals.styles.colors.colorLove} />
              </LG>
              <LG id="background" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={globals.styles.colors.colorGrayLight} />
                <Stop offset="100%" stopColor={globals.styles.colors.colorGrayLight} />
              </LG>
            </Defs>
            <Circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill={globals.styles.colors.colorWhite} />
            {/* <Circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#d2d3d4" strokeWidth="3"></Circle> */}

            <Circle
              class="donut-segment"
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              visibility={false}
              stroke="url(#background)"
              strokeLinecap="round"
              strokeWidth="3"
              strokeDasharray={'1 0'}
              strokeDashoffset={100 - percentages[0] - percentages[1] + 20}
            />
            <Circle
              class="donut-segment"
              cx="21"
              cy="21"
              r="15.91549430918954"
              visibility={false}
              fill="transparent"
              stroke="url(#carbs)"
              strokeLinecap="round"
              strokeWidth={carbsPerc > 0 ? '3' : '0'}
              strokeDasharray={percentages[0] === 100 ? '1 0' : `${percentages[0] - 4} ${100 - percentages[0] + 4}`}
              strokeDashoffset="20"
            />
            <Circle
              class="donut-segment"
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              visibility={false}
              strokeLinecap="round"
              stroke="url(#fats)"
              strokeWidth={fatPerc > 0 ? '3' : '0'}
              strokeDasharray={percentages[1] === 100 ? '1 0' : `${percentages[1] - 4} ${100 - percentages[1] + 4}`}
              strokeDashoffset={100 - percentages[0] + 20}
            />
            <Circle
              class="donut-segment"
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              visibility={false}
              stroke="url(#proteins)"
              strokeLinecap="round"
              strokeWidth={proteinPerc > 0 ? '3' : '0'}
              strokeDasharray={percentages[2] === 100 ? '1 0' : `${percentages[2] - 4} ${100 - percentages[2] + 4}`}
              strokeDashoffset={100 - percentages[0] - percentages[1] + 20}
            />
          </Svg>
          <View
            style={{
              position: 'absolute',
              top: 22,
              left: 0,
              width: '100%',
              zIndex: 20,
              color: globals.styles.colors.colorBlackDark,
              borderWidth: 0,
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 30, fontFamily: globals.fonts.secondary.style.fontFamily }}>
              {Math.round(props.recipe.calories * props.multiplier)}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              top: 48,
              left: 0,
              width: '100%',
              zIndex: 20,
              color: globals.styles.colors.colorBlackDark,
              borderWidth: 0,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: globals.fonts.primary.style.fontFamily,
                color: globals.styles.colors.colorGrayDark,
                marginTop: 2,
              }}>
              Cal
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.proteinPercent}>{`${proteinPerc || 0}%`}</Text>
          <View style={styles.proteinBar} />
          <Text style={styles.proteinQuantity}>
            {`${Math.round((props.recipe.protein || 0) * props.multiplier * 10) / 10}`}
            <Text style={styles.gText}>g</Text>
          </Text>
          <Text style={styles.proteinLabel}>Protein</Text>
        </View>
        <View>
          <Text style={styles.carbsPercent}>{`${carbsPerc || 0}%`}</Text>
          <View style={styles.carbsBar} />
          <Text style={styles.proteinQuantity}>
            {`${Math.round(((props.isRecipe ? props.recipe.carbs : props.recipe.total_carbohydrate) || 0) * props.multiplier * 10) / 10}`}
            <Text style={styles.gText}>g</Text>
          </Text>
          <Text style={styles.proteinLabel}>Carbs</Text>
        </View>
        <View>
          <Text style={styles.fatsPercent}>{`${fatPerc || 0}%`}</Text>
          <View style={styles.fatsBar} />
          <Text style={styles.proteinQuantity}>
            {`${Math.round(((props.isRecipe ? props.recipe.fats : props.recipe.total_fat) || 0) * props.multiplier * 10) / 10}`}
            <Text style={styles.gText}>g</Text>
          </Text>
          <Text style={styles.proteinLabel}>Fats</Text>
        </View>
      </View>
      {!props.macrosOnly && (
        <View style={{ borderTopWidth: 3, borderTopColor: globals.styles.colors.colorGrayLight }}>
          <View style={styles.dailyValuesContainer}>
            <View />
            <Text style={styles.dailyLabel}>% Daily Value</Text>
          </View>
          <View style={styles.dailyValuesContainer}>
            <View style={styles.valueWrapper}>
              <Text style={styles.itemName}>Total Fat </Text>
              <Text style={styles.subItemName}>
                {props.recipe.total_fat ? `${Math.round(props.recipe.total_fat * props.multiplier)}g` : 'NA'}
              </Text>
            </View>
            <View style={styles.valueWrapper}>
              <Text style={[styles.itemName, { textAlign: 'right' }]}>
                {props.recipe.total_fat ? `${Math.round(((props.recipe.total_fat * props.multiplier) / dailyFats) * 100)}` : 'NA'}
              </Text>
              <Text style={[styles.subItemName, { textAlign: 'right' }]}>{props.recipe.total_fat ? '%' : ''}</Text>
            </View>
          </View>
          <View style={[styles.dailyValuesContainer, { paddingLeft: 46 }]}>
            <View style={styles.valueWrapper}>
              <Text style={styles.subItemName}>
                Saturated Fat {props.recipe.saturated_fat ? `${Math.round(props.recipe.saturated_fat * props.multiplier)}g` : 'NA'}
              </Text>
            </View>
            <View style={styles.valueWrapper}>
              <Text style={[styles.itemName, { textAlign: 'right' }]}>
                {props.recipe.saturated_fat ? `${Math.round(maxSaturatedFat * 100)}` : 'NA'}
              </Text>
              <Text style={[styles.subItemName, { textAlign: 'right' }]}>{props.recipe.saturated_fat ? '%' : ''}</Text>
            </View>
          </View>
          <View style={[styles.dailyValuesContainer, { paddingLeft: 46 }]}>
            <View style={styles.valueWrapper}>
              <Text style={styles.subItemName}>Trans Fat {`${Math.round(props.recipe.trans_fat * props.multiplier)}g`}</Text>
            </View>
            <View style={styles.valueWrapper}>
              {/* <Text style={[styles.itemName, { textAlign: 'right' }]}>
                {props.recipe.transFat ? `${props.recipe.transFat.percent}` : 'NA'}
              </Text>
              <Text style={[styles.subItemName, { textAlign: 'right' }]}>{props.recipe.transFat ? '%' : ''}</Text> */}
            </View>
          </View>
          <View style={styles.dailyValuesContainer}>
            <View style={styles.valueWrapper}>
              <Text style={styles.itemName}>Cholesterol </Text>
              <Text style={styles.subItemName}>{`${Math.round(props.recipe.cholesterol * props.multiplier)}mg`}</Text>
            </View>
            <View style={styles.valueWrapper}>
              <Text style={[styles.itemName, { textAlign: 'right' }]}>
                {props.recipe.cholesterol !== null ? `${Math.round(maxCholesterol * 100)}` : 'NA'}
              </Text>
              <Text style={[styles.subItemName, { textAlign: 'right' }]}>{props.recipe.cholesterol !== null ? '%' : ''}</Text>
            </View>
          </View>
          <View style={styles.dailyValuesContainer}>
            <View style={styles.valueWrapper}>
              <Text style={styles.itemName}>Sodium </Text>
              <Text style={styles.subItemName}>
                {props.recipe.sodium ? `${Math.round(props.recipe.sodium * props.multiplier)}mg` : 'NA'}
              </Text>
            </View>
            <View style={styles.valueWrapper}>
              <Text style={[styles.itemName, { textAlign: 'right' }]}>
                {props.recipe.sodium !== null ? `${Math.round(maxSodium * 100)}` : 'NA'}
              </Text>
              <Text style={[styles.subItemName, { textAlign: 'right' }]}>{props.recipe.sodium !== null ? '%' : ''}</Text>
            </View>
          </View>
          <View style={styles.dailyValuesContainer}>
            <View style={styles.valueWrapper}>
              <Text style={styles.itemName}>Potassium </Text>
              <Text style={styles.subItemName}>
                {props.recipe.potassium ? `${Math.round(props.recipe.potassium * props.multiplier)}mg` : 'NA'}
              </Text>
            </View>
            <View style={styles.valueWrapper}>
              <Text style={[styles.itemName, { textAlign: 'right' }]}>
                {props.recipe.potassium !== null ? `${Math.round(maxPotassium * 100)}` : 'NA'}
              </Text>
              <Text style={[styles.subItemName, { textAlign: 'right' }]}>{props.recipe.potassium !== null ? '%' : ''}</Text>
            </View>
          </View>
          <View style={styles.dailyValuesContainer}>
            <View style={styles.valueWrapper}>
              <Text style={styles.itemName}>Total Carbohydrates </Text>
              <Text style={styles.subItemName}>
                {props.recipe.total_carbohydrate ? `${Math.round(props.recipe.total_carbohydrate * props.multiplier)}g` : 'NA'}
              </Text>
            </View>
            <View style={styles.valueWrapper}>
              <Text style={[styles.itemName, { textAlign: 'right' }]}>
                {props.recipe.total_carbohydrate
                  ? `${Math.round(((props.recipe.total_carbohydrate * props.multiplier) / dailyCarbs) * 100)}`
                  : 'NA'}
              </Text>
              <Text style={[styles.subItemName, { textAlign: 'right' }]}>{props.recipe.total_carbohydrate ? '%' : ''}</Text>
            </View>
          </View>
          <View style={[styles.dailyValuesContainer, { paddingLeft: 46 }]}>
            <View style={styles.valueWrapper}>
              <Text style={styles.subItemName}>
                Dietary Fibers {props.recipe.dietary_fiber ? `${Math.round(props.recipe.dietary_fiber * props.multiplier)}g` : 'NA'}
              </Text>
            </View>
            <View style={styles.valueWrapper}>
              <Text style={[styles.itemName, { textAlign: 'right' }]}>
                {props.recipe.dietary_fiber ? `${Math.round(maxFiber * 100)}` : 'NA'}
              </Text>
              <Text style={[styles.subItemName, { textAlign: 'right' }]}>{props.recipe.dietary_fiber ? '%' : ''}</Text>
            </View>
          </View>
          <View style={[styles.dailyValuesContainer, { paddingLeft: 46 }]}>
            <View style={styles.valueWrapper}>
              <Text style={styles.subItemName}>
                Sugars {props.recipe.sugars ? `${Math.round(props.recipe.sugars * props.multiplier)}g` : 'NA'}
              </Text>
            </View>
            <View style={styles.valueWrapper}>
              {/* <Text style={[styles.itemName, { textAlign: 'right' }]}>
                {props.recipe.sugars && false ? `${props.recipe.sugars.percent}` : 'NA'}
              </Text>
              <Text style={[styles.subItemName, { textAlign: 'right' }]}>
                {props.recipe.sugars && false ? '%' : ''}
              </Text> */}
            </View>
          </View>
          <View style={[styles.dailyValuesContainer, { borderBottomWidth: 0 }]}>
            <View style={styles.valueWrapper}>
              <Text style={styles.itemName}>Protein </Text>
              <Text style={styles.subItemName}>
                {props.recipe.protein ? `${Math.round(props.recipe.protein * props.multiplier)}g` : 'NA'}
              </Text>
            </View>
            <View style={styles.valueWrapper}>
              <Text style={[styles.itemName, { textAlign: 'right' }]}>
                {props.recipe.protein ? `${Math.round(((props.recipe.protein * props.multiplier) / dailyProtein) * 100)}` : 'NA'}
              </Text>
              <Text style={[styles.subItemName, { textAlign: 'right' }]}>{props.recipe.protein ? '%' : ''}</Text>
            </View>
          </View>
        </View>
      )}
    </React.Fragment>
  )
}

export default NutritionFacts
