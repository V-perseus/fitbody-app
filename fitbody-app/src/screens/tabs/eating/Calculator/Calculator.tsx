import React, { useEffect, useState } from 'react'
import { Text, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector } from 'react-redux'

// Services
import api from '../../../../services/api'
import { setErrorMessage } from '../../../../services/error'

// styles
import styles from './styles'
import globals from '../../../../config/globals'

// Components
import PinkButton from '../../../../components/PinkButton'
import CalculatorRow, { RowValueType } from '../../../../components/Calculator/CalculatorRow'
import CalculatorMultiOption from '../../../../components/Calculator/CalculatorMultiOption'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'
import ScrollingListModal from '../../../../components/ScrollingListModal'

// Data
import { updateUser } from '../../../../data/user'
import { userSelector } from '../../../../data/user/selectors'

// Types
import { Goal, HeightUnit, WeightUnit } from '../../../../data/user/types'
import { CalculatorScreenNavigationProps } from '../../../../config/routes/routeTypes'

// Activeness buttons Options
// const activeOptions = [
//   { value: 1, title: 'not active', subtitle: '0-1 days a week' },
//   { value: 2, title: 'lightly active', subtitle: '1-3 days a week' },
//   { value: 3, title: 'active', subtitle: '3-5 days a week' },
//   { value: 5, title: 'very active', subtitle: '6-7 days a week' },
//   { value: 7, title: 'tone', subtitle: '6 days a week' },
//   { value: 6, title: 'shred', subtitle: '6 days a week' },
//   { value: 8, title: 'sculpt', subtitle: '5 days a week' },
// ]

const activeOptions = [
  { value: 10, title: 'Not currently exercising' },
  { value: 11, title: '0 min - 1 hour' },
  { value: 12, title: '1 hour - 2 hours' },
  { value: 13, title: '2 hours - 3 hours' },
  { value: 14, title: '3 hours - 4 hours' },
  { value: 15, title: '4 hours - 5 hours' },
  { value: 16, title: '5 hours - 6 hours' },
  { value: 17, title: '6 hours - 7 hours' },
  { value: 18, title: '7 hours - 8 hours' },
  { value: 19, title: '8 hours - 9 hours' },
  { value: 20, title: '9 hours - 10 hours' },
  { value: 21, title: '10 hours+' },
]

// Goal buttons options
const goalOptions = [
  { value: 1, title: 'lose' },
  { value: 2, title: 'maintain' },
  { value: 3, title: 'gain' },
]

const pregnancyOptions = [
  { value: 1, title: 'No/Skip', subtitle: '' },
  { value: 2, title: 'Currently\nBreastfeeding', subtitle: '' },
  { value: 3, title: 'Pregnant', subtitle: '1st trimester' },
  { value: 4, title: 'Pregnant', subtitle: '2nd trimester' },
  { value: 5, title: 'Pregnant', subtitle: '3rd trimester' },
]

interface ICalculatorProps extends CalculatorScreenNavigationProps {}
const Calculator: React.FC<ICalculatorProps> = ({ navigation }) => {
  const [heightValue, setHeightValue] = useState<number>()
  const [heightUnit, setHeightUnit] = useState<HeightUnit>()
  const [weightValue, setWeightValue] = useState<number>()
  const [weightUnit, setWeightUnit] = useState<WeightUnit>()
  const [age, setAge] = useState<number>()
  const [activeness, setActiveness] = useState<number>()
  const [goal, setGoal] = useState<number>()
  const [pregnancy, setPregnancy] = useState<number>()
  const [showActivityModal, setShowActivityModal] = useState(false)

  const user = useSelector(userSelector)

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerTitle: () => <Text style={styles.headerTitle}>MACRO CALCULATOR</Text>,
      headerLeft: () => <HeaderButton onPress={navigation.goBack} />,
      headerStyle: {
        backgroundColor: globals.styles.colors.colorWhite,
        shadowColor: 'transparent',
      },
    })
  }, [navigation])

  /**
   * Fill in the fields
   */
  useEffect(() => {
    const pullOutGoalValue = (data?: Goal): number => {
      const goals: Record<Goal, number> = {
        LOSE: 1,
        MAINTAIN: 2,
        GAIN: 3,
      }
      if (data) {
        return goals[data]
      }
      return 1
    }

    setHeightValue(user.height)
    setHeightUnit(user.height_unit)
    setWeightValue(user.weight)
    setWeightUnit(user.weight_unit)
    setAge(user.age)
    setActiveness(user.activeness)
    setGoal(pullOutGoalValue(user.goal))
    setPregnancy(user.pregnancy || pregnancyOptions[0].value)
  }, [user])

  /**
   * Calculate the Macros
   */
  function calculate(): void {
    const { navigate } = navigation

    // Check activeness has been chosen
    if (!activeness) {
      setErrorMessage({
        error: 'Please choose an activity level',
      })
      return
    }

    // Height
    // Checks for feet - 10 feet = 120 inches
    if (heightValue) {
      if (heightUnit === HeightUnit.inches && (heightValue < 12 || heightValue > 120)) {
        setErrorMessage({
          error: 'Your height must be between 1 feet and 10 feet',
        })
        return
      } else if (heightUnit === HeightUnit.cm && (heightValue < 30 || heightValue > 304)) {
        setErrorMessage({
          error: 'Your height must be between 30 centimeter and 304 centimeter',
        })
        return
      }
    } else {
      setErrorMessage({ error: 'Please enter your height' })
      return
    }

    // Weight
    if (weightValue) {
      if (weightUnit === WeightUnit.lb && (weightValue < 21 || weightValue > 440)) {
        setErrorMessage({ error: 'Weight must be between 2lb and 440lb' })
        return
      } else if (weightUnit === WeightUnit.kg && (weightValue < 30 || weightValue > 304)) {
        setErrorMessage({ error: 'Weight must be between 1Kg and 200Kg' })
        return
      }
    } else {
      setErrorMessage({ error: 'Please enter your weight' })
      return
    }

    // Age
    if (age && (age < 18 || age > 100)) {
      setErrorMessage({ error: 'Age must be between 18 and 100' })
      return
    } else if (!age) {
      setErrorMessage({ error: 'Please enter your age' })
      return
    }

    if (user.id) {
      api
        .calculator()
        .calculate({
          id: user.id,
          height_value: heightValue,
          height_unit: heightUnit!,
          weight_value: weightValue,
          weight_unit: weightUnit!,
          activeness: activeness!,
          goal: goal!,
          age: age!,
          pregnancy: pregnancy!,
        })
        .then((data) => {
          updateUser(data.user)
          navigate('CalculatedMacros')
        })
        .catch((err) => {
          setErrorMessage(err)
        })
    }
  }

  /**
   * Gather the height & height_unit
   */
  function gatherHeight(data: RowValueType) {
    setHeightValue(data.value)
    setHeightUnit(data.unit as HeightUnit)
  }

  /**
   * Gather the weight & weight_unit
   */
  function gatherWeight(data: RowValueType) {
    setWeightValue(data.value)
    setWeightUnit(data.unit as WeightUnit)
  }

  /**
   * Gather age
   */
  function gatherAge(data: RowValueType) {
    setAge(data.value)
  }

  /**
   * Gather activeness
   */
  function gatherActiveness(data: number) {
    setActiveness(data)
  }

  /**
   * Gather goal
   */
  function gatherGoal(data: number) {
    setGoal(data)
  }

  function gatherPregnancy(data: number) {
    setPregnancy(data)
  }

  function handleUnitUpdate(unit: HeightUnit | WeightUnit) {
    if (unit === HeightUnit.inches && heightUnit !== HeightUnit.inches && heightValue !== undefined) {
      gatherHeight({
        value: Number(heightValue / 2.54),
        unit,
      })
    } else if (unit === HeightUnit.cm && heightUnit !== HeightUnit.cm && heightValue !== undefined) {
      gatherHeight({
        value: Number((heightValue * 2.54).toFixed(2)),
        unit,
      })
    } else if (unit === WeightUnit.lb && weightUnit !== WeightUnit.lb && weightValue !== undefined) {
      gatherWeight({
        value: Number((weightValue * 2.2046).toFixed(2)),
        unit,
      })
    } else if (unit === WeightUnit.kg && weightUnit !== WeightUnit.kg && weightValue !== undefined) {
      gatherWeight({
        value: Number((weightValue / 2.2046).toFixed(2)),
        unit,
      })
    }
  }

  function handleActivityModalOpen() {
    setShowActivityModal(true)
  }

  function handleActivityModalClose() {
    setShowActivityModal(false)
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: globals.styles.colors.colorWhite }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        style={[styles.container, { backgroundColor: globals.styles.colors.colorWhite }]}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled">
        {/* Height */}
        <CalculatorRow
          type="height"
          value={{
            value: heightValue,
            unit: heightUnit,
          }}
          title={'How tall are you?'}
          inputData={['feet', 'inches', 'cm']}
          buttonsData={[
            { value: HeightUnit.inches, title: 'feet' },
            { value: HeightUnit.cm, title: 'centimeter' },
          ]}
          update={gatherHeight}
          updateUnit={handleUnitUpdate}
        />

        {/* Weight */}
        <CalculatorRow
          type="weight"
          title={'How much do you currently weigh?'}
          value={{
            value: weightValue,
            unit: weightUnit,
          }}
          inputData={['lb']}
          buttonsData={[
            { value: WeightUnit.lb, title: 'pounds' },
            { value: WeightUnit.kg, title: 'kilograms' },
          ]}
          update={gatherWeight}
          updateUnit={handleUnitUpdate}
        />

        {/* Age */}
        <CalculatorRow
          type="age"
          value={{
            value: age,
            unit: undefined,
          }}
          title={'How old are you?'}
          inputData={['age']}
          buttonsData={[]}
          update={gatherAge}
        />

        {/* Activeness */}
        {/* TODO refactor this into its own row component. It's too different */}
        {activeOptions.findIndex((opt) => opt.value === activeness) > -1 ? (
          <CalculatorRow
            type="activity"
            title={'How active are you?'}
            activityValue={activeOptions.find((opt) => opt.value === activeness)?.title}
            activityUpdate={handleActivityModalOpen}
          />
        ) : (
          <>
            <Text style={styles.titleLabel}>How active are you?</Text>
            <PinkButton title={'ADD ACTIVITY'} handlePress={handleActivityModalOpen} buttonStyle={{ borderRadius: 100, height: 50 }} />
          </>
        )}

        {/* Pregnancy */}
        <CalculatorMultiOption
          type="pregnancy"
          activeOption={pregnancy}
          title="Do any of the following apply to you?"
          options={pregnancyOptions}
          elementsPerRow={2}
          update={gatherPregnancy}
        />

        {/* Goals */}
        <CalculatorMultiOption
          type="goal"
          activeOption={goal}
          title="What is your goal?"
          options={goalOptions}
          elementsPerRow={3}
          update={gatherGoal}
        />

        {/* Submit */}
        <PinkButton title={'CALCULATE'} handlePress={calculate} />
      </KeyboardAwareScrollView>
      <ScrollingListModal
        title="Duration of total weekly exercise:"
        visible={showActivityModal}
        options={activeOptions.map((opt) => opt.title)}
        onClose={handleActivityModalClose}
        selectedIndex={activeOptions.findIndex((opt) => opt.value === activeness)}
        onChange={(opt) => {
          setShowActivityModal(false)
          gatherActiveness(activeOptions[opt]?.value)
        }}
      />
    </SafeAreaView>
  )
}

export default Calculator
