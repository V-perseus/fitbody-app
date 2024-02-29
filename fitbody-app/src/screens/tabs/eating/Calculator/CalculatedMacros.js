import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { Svg, Circle, Defs, LinearGradient as LG, Stop, G, Text as T } from 'react-native-svg'
import { vs } from 'react-native-size-matters/extend'

// Components
import PinkButton from '../../../../components/PinkButton'
import FitBody from '../../../../../assets/images/logo/fitbody.svg'

// Assets
import styles from './styles'
import globals from '../../../../config/globals'
import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'
import { ButtonOpacity } from '../../../../components/Buttons/ButtonOpacity'

class CalculateMacros extends Component {
  static navigationOptions = () => ({
    headerShown: false,
  })

  render() {
    const { navigate, goBack } = this.props.navigation
    const params = this.props.route.params
    const profile = params && params.fromProfile ? params.fromProfile : null

    // Daily Fuel & Meal Plan Range
    let dailyFuel = Math.trunc(this.props.data.user.mpr)
    let floor = Math.floor(dailyFuel / 100) * 100
    let ceiling = Math.ceil(dailyFuel / 100) * 100
    if (floor == ceiling) {
      ceiling += 100
    }
    let mealPlanRange = dailyFuel >= 2700 ? '2600-2700' : dailyFuel <= 1300 ? '1300-1400' : `${floor} - ${ceiling}`

    // Daily calorie breakdown
    let protein, carbs, fats, proteinPercent, carbsPercent, fatsPercent, origPercentages
    if (this.props.data.user.eating_preferences.find((x) => x.key === 'KETO')) {
      protein = Math.round((0.2 * dailyFuel) / 4)
      carbs = Math.round((0.1 * dailyFuel) / 4)
      fats = Math.round((0.7 * dailyFuel) / 9)
      proteinPercent = '20%'
      carbsPercent = '10%'
      fatsPercent = '70%'
      // array order: carbs, fats, protein
      origPercentages = [10, 70, 20]
    } else if (this.props.data.user.goal === 'LOSE' || dailyFuel <= 2000) {
      protein = Math.round((0.3 * dailyFuel) / 4)
      carbs = Math.round((0.4 * dailyFuel) / 4)
      fats = Math.round((0.3 * dailyFuel) / 9)
      proteinPercent = '30%'
      carbsPercent = '40%'
      fatsPercent = '30%'
      // array order: carbs, fats, protein
      origPercentages = [40, 30, 30]
    } else if (this.props.data.user.goal === 'MAINTAIN' || this.props.data.user.goal === 'GAIN') {
      protein = Math.round((0.2 * dailyFuel) / 4)
      carbs = Math.round((0.5 * dailyFuel) / 4)
      fats = Math.round((0.3 * dailyFuel) / 9)
      proteinPercent = '20%'
      carbsPercent = '50%'
      fatsPercent = '30%'
      // array order: carbs, fats, protein
      origPercentages = [50, 30, 20]
    } else {
      protein = Math.round((0.1 * dailyFuel) / 4)
      carbs = Math.round((0.7 * dailyFuel) / 4)
      fats = Math.round((0.2 * dailyFuel) / 9)
      proteinPercent = '10%'
      carbsPercent = '70%'
      fatsPercent = '20%'
      // array order: carbs, fats, protein
      origPercentages = [70, 20, 10]
    }

    let percentages = []
    let smallest = origPercentages.findIndex((f) => f < 10)

    if (smallest !== -1) {
      // We have one smaller than 10 percent, and need to 'cheat'
      let diff = 10 - origPercentages[smallest]

      percentages = origPercentages.map((e, index) => {
        return index == smallest ? e + diff : e - diff / 2
      })
    } else {
      percentages = origPercentages
    }

    return (
      <View style={globals.styles.container}>
        <FocusAwareStatusBar barStyle="light-content" />
        <LinearGradient style={styles.gradientStyles} colors={[globals.styles.colors.colorPink, globals.styles.colors.colorLove]}>
          <Text style={styles.dailyFuel}>MY DAILY FUEL</Text>
          <FitBody color={globals.styles.colors.colorWhite} />
        </LinearGradient>

        <View style={styles.cardSection}>
          <View style={styles.whiteCardView}>
            <View style={styles.whiteCardViewInner}>
              {/* <Svg width={vs(globals.window.width * 0.8)} height={vs(globals.window.width * 0.8)} viewBox="0 0 42 42" class="donut"> */}
              <Svg width={vs(360)} height={vs(360)} viewBox="0 0 42 42" class="donut">
                <Defs>
                  <LG id="fats" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor={globals.styles.colors.colorLavender} />
                    <Stop offset="100%" stopColor={globals.styles.colors.colorAqua} />
                  </LG>
                  <LG id="carbs" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor={globals.styles.colors.colorLavender} />
                    <Stop offset="100%" stopColor={globals.styles.colors.colorPurple} />
                  </LG>
                  <LG id="proteins" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor={globals.styles.colors.colorLove} />
                    <Stop offset="100%" stopColor={globals.styles.colors.colorPink} />
                  </LG>
                </Defs>
                <Circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill={globals.styles.colors.colorWhite}>
                  <Text style={{ color: globals.styles.colors.colorBlack }}>TTT</Text>
                </Circle>
                {/* <Circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#d2d3d4" strokeWidth="3"></Circle> */}

                <Circle
                  class="donut-segment"
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="url(#carbs)"
                  strokeLinecap="round"
                  strokeWidth="3"
                  strokeDasharray={`${percentages[0] - 5} ${100 - percentages[0] + 5}`}
                  strokeDashoffset="20"
                />
                <Circle
                  class="donut-segment"
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  strokeLinecap="round"
                  stroke="url(#fats)"
                  strokeWidth="3"
                  strokeDasharray={`${percentages[1] - 5} ${100 - percentages[1] + 5}`}
                  strokeDashoffset={100 - percentages[0] + 20}
                />
                <Circle
                  class="donut-segment"
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="url(#proteins)"
                  strokeLinecap="round"
                  strokeWidth="3"
                  strokeDasharray={`${percentages[2] - 5} ${100 - percentages[2] + 5}`}
                  strokeDashoffset={100 - percentages[0] - percentages[1] + 20}
                />

                <G transform={`rotate(${-81 + 1.8 * percentages[0]},21,21)`}>
                  <Circle
                    cx="37"
                    cy="21"
                    r="4"
                    fill={globals.styles.colors.colorPurple}
                    stroke={globals.styles.colors.colorWhite}
                    strokeWidth="1"
                  />
                  <T
                    x="37"
                    y="21.2"
                    fill={globals.styles.colors.colorWhite}
                    fontFamily={globals.fonts.primary.boldStyle.fontFamily}
                    fontSize="2"
                    alignmentBaseline="middle"
                    textAnchor="middle"
                    transform={`rotate(${-(-81 + 1.8 * percentages[0])},37,21)`}>{`${origPercentages[0]}%`}</T>
                </G>

                <G transform={`rotate(${-81 + (3.6 * percentages[0] + 1.8 * percentages[1])},21,21)`}>
                  <Circle
                    cx="37"
                    cy="21"
                    r="4"
                    fill={globals.styles.colors.colorAqua}
                    stroke={globals.styles.colors.colorWhite}
                    strokeWidth="1"
                  />
                  <T
                    x="37"
                    y="21.2"
                    fill={globals.styles.colors.colorWhite}
                    fontFamily={globals.fonts.primary.boldStyle.fontFamily}
                    fontSize="2"
                    alignmentBaseline="middle"
                    textAnchor="middle"
                    transform={`rotate(${-(-81 + (3.6 * percentages[0] + 1.8 * percentages[1]))},37,21)`}>{`${origPercentages[1]}%`}</T>
                </G>

                <G transform={`rotate(${-81 + (3.6 * percentages[0] + 3.6 * percentages[1] + 1.8 * percentages[2])},21,21)`}>
                  <Circle
                    cx="37"
                    cy="21"
                    r="4"
                    fill={globals.styles.colors.colorLove}
                    stroke={globals.styles.colors.colorWhite}
                    strokeWidth="1"
                  />
                  <T
                    x="37"
                    y="21.2"
                    fill={globals.styles.colors.colorWhite}
                    fontFamily={globals.fonts.primary.boldStyle.fontFamily}
                    fontSize="2"
                    alignmentBaseline="middle"
                    textAnchor="middle"
                    transform={`rotate(${-(
                      -81 +
                      (3.6 * percentages[0] + 3.6 * percentages[1] + 1.8 * percentages[2])
                    )},37,21)`}>{`${origPercentages[2]}%`}</T>
                </G>
              </Svg>
              <View style={styles.dailyFuelView}>
                <View style={styles.calculatedDailyFuelView}>
                  <Text style={styles.calculatedDailyFuelText}>{dailyFuel}</Text>
                </View>
                <View style={styles.caloriesTextView}>
                  <Text style={styles.caloriesText}>calories</Text>
                </View>
              </View>
            </View>

            {/* 100 - all preceding total length + first segment offset */}

            {/* <View style={styles.caloriesContainer}>
              <Text style={styles.dailyFuel}>MY DAILY FUEL</Text>
              <Text style={styles.calories}>{dailyFuel} Calories</Text>
            </View>
            <View style={styles.planRange}>
              <Text style={styles.mealPlan}>MEAL PLAN RANGE</Text>
              <Text style={styles.number}>{mealPlanRange}</Text>
              <Text style={styles.mealPlan}>CALORIES</Text>
            </View> */}
          </View>
          <View style={styles.recalcView}>
            <ButtonOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => this.props.navigation.navigate('Calculator')}>
              <Text style={{ fontSize: 11 }}>RECALCULATE</Text>
            </ButtonOpacity>
          </View>
          <View style={styles.metricsContainer}>
            <View style={styles.row}>
              <View style={styles.rowElement}>
                <View style={styles.proteinPercentView}>
                  <Text style={[styles.percentage, { color: globals.styles.colors.colorLove }]}>{proteinPercent}</Text>
                </View>
                <Text style={styles.type}>PROTEIN</Text>
                <Text style={styles.grams}>{protein}g</Text>
              </View>
              <View style={styles.rowElement}>
                <View style={styles.carbsPercentView}>
                  <Text style={[styles.percentage, { color: globals.styles.colors.colorPurple }]}>{carbsPercent}</Text>
                </View>
                <Text style={styles.type}>CARBS</Text>
                <Text style={styles.grams}>{carbs}g</Text>
              </View>
              <View style={styles.rowElement}>
                <View style={styles.fatsPercentView}>
                  <Text style={[styles.percentage, { color: globals.styles.colors.colorAqua }]}>{fatsPercent}</Text>
                </View>
                <Text style={styles.type}>FAT</Text>
                <Text style={styles.grams}>{fats}g</Text>
              </View>
            </View>
            <PinkButton
              colors={[globals.styles.colors.colorLove, globals.styles.colors.colorLove]}
              title={profile ? 'DISMISS' : 'GO TO MEAL PLAN'}
              active
              style={styles.pinkButtonStyles}
              buttonStyle={styles.pinkButtonBtnStyles}
              handlePress={profile ? () => goBack() : () => navigate('Eating')}
            />
          </View>
        </View>
      </View>
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
)(CalculateMacros)
