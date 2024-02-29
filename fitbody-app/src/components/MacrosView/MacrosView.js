import React, { useMemo } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { scale, moderateScale } from 'react-native-size-matters/extend'

// Components
import ProgressBar from '../../components/ProgressBar'

// Assets
import styles from './styles'
import globals from '../../config/globals'
import { usePersistedState } from '../../services/hooks/usePersistedState'

const MacrosView = (props) => {
  const [modeTotal, setModeTotal] = usePersistedState('macrosView', 'modeTotal', false) // true = total, false = remaining

  const { mpr, goal, eatingPreferences } = props.userValues
  const totals = useMemo(
    () =>
      (props.foodValues || []).reduce(
        (total, current) => {
          total.calories += current.calories
          total.protein += current.protein
          total.carbs += current.carbs
          total.fats += current.fats

          return total
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 },
      ),
    [props.foodValues],
  )

  // console.log(props.foodValues)

  const [dailyFuel, protein, carbs, fats, remainingCalories] = useMemo(() => {
    let dailyFuel = Math.trunc(mpr)

    let floor = Math.floor(dailyFuel / 100) * 100
    let ceiling = Math.ceil(dailyFuel / 100) * 100
    if (floor === ceiling) {
      ceiling += 100
    }

    // Daily calorie breakdown
    let protein, carbs, fats
    if (eatingPreferences.find((x) => x.key === 'KETO')) {
      protein = Math.round((0.2 * dailyFuel) / 4)
      carbs = Math.round((0.1 * dailyFuel) / 4)
      fats = Math.round((0.7 * dailyFuel) / 9)
    } else if (goal === 'LOSE' || dailyFuel <= 2000) {
      protein = Math.round((0.3 * dailyFuel) / 4)
      carbs = Math.round((0.4 * dailyFuel) / 4)
      fats = Math.round((0.3 * dailyFuel) / 9)
    } else if (goal === 'MAINTAIN' || goal === 'GAIN') {
      protein = Math.round((0.2 * dailyFuel) / 4)
      carbs = Math.round((0.5 * dailyFuel) / 4)
      fats = Math.round((0.3 * dailyFuel) / 9)
    } else {
      protein = Math.round((0.1 * dailyFuel) / 4)
      carbs = Math.round((0.7 * dailyFuel) / 4)
      fats = Math.round((0.2 * dailyFuel) / 9)
    }

    let remainingCalories = dailyFuel - totals.calories

    if (totals.calories === 0) {
      remainingCalories = dailyFuel
    }

    return [dailyFuel, protein, carbs, fats, remainingCalories]
  }, [totals, eatingPreferences, goal, mpr])

  // console.log('rerender macros', totals)

  return (
    <View style={styles.container}>
      <View
        style={{
          // flex: 1,
          height: moderateScale(40),
          paddingHorizontal: scale(24),
          borderBottomWidth: 1,
          borderColor: globals.styles.colors.colorGrayLight,
          alignSelf: 'stretch',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: scale(10),
        }}>
        <Text
          style={{
            fontSize: moderateScale(14),
            fontFamily: globals.fonts.primary.boldStyle.fontFamily,
            color: globals.styles.colors.colorBlack,
          }}>
          {modeTotal ? 'TOTAL' : 'REMAINING'} {props.withRecipe && 'WITH THIS RECIPE'}
        </Text>
        <TouchableOpacity
          style={{
            alignSelf: 'stretch',
            height: 24,
            borderWidth: 1,
            borderRadius: 24,
            backgroundColor: globals.styles.colors.colorWhite,
            borderColor: globals.styles.colors.colorGrayDark,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            // console.log(modeTotal)
            setModeTotal(!modeTotal)
          }}>
          <Text
            style={{
              fontFamily: globals.fonts.primary.style.fontFamily,
              fontSize: 10,
              fontWeight: 'normal',
              paddingHorizontal: 15,
              color: globals.styles.colors.colorGrayDark,
            }}>
            SHOW {modeTotal ? 'REMAINING' : 'TOTAL'}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          paddingVertical: scale(17),
          paddingHorizontal: scale(24),
          justifyContent: 'space-between',
          alignSelf: 'stretch',
          flexDirection: 'row',
        }}>
        <View style={{ alignItems: 'center' }}>
          <ProgressBar
            width={scale(60)}
            color={globals.styles.colors.colorPink}
            duration={Math.min((totals.calories / dailyFuel) * 100, 100) || 0}
          />
          <Text style={[styles.amount]}>{Math.round(modeTotal ? totals.calories : remainingCalories)}</Text>
          <Text style={styles.name}>Calories</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <ProgressBar
            width={scale(60)}
            color={globals.styles.colors.colorLove}
            duration={Math.min((totals.protein / protein) * 100, 100) || 0}
          />
          <Text style={styles.amount}>
            {Math.round(modeTotal ? totals.protein : protein - totals.protein)}
            <Text style={{ fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 16, fontWeight: 'normal' }}>g</Text>
          </Text>
          <Text style={styles.name}>Protein</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <ProgressBar
            width={scale(60)}
            color={globals.styles.colors.colorPurple}
            duration={Math.min((totals.carbs / carbs) * 100, 100) || 0}
          />
          <View>
            <Text style={styles.amount}>
              {Math.round(modeTotal ? totals.carbs : carbs - totals.carbs)}
              <Text style={{ fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 16, fontWeight: 'normal' }}>g</Text>
            </Text>
          </View>
          <Text style={styles.name}>Carbs</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <ProgressBar
            width={scale(60)}
            color={globals.styles.colors.colorAqua}
            duration={Math.min((totals.fats / fats) * 100, 100) || 0}
          />
          <Text style={styles.amount}>
            {Math.round(modeTotal ? totals.fats : fats - totals.fats)}
            <Text style={{ fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 16, fontWeight: 'normal' }}>g</Text>
          </Text>
          <Text style={styles.name}>Fats</Text>
        </View>
      </View>
    </View>
  )
}

export default MacrosView
