import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text, TouchableOpacity, StatusBar } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useSelector } from 'react-redux'

// Assets
import styles from './styles'
import globals from '../../../../config/globals'

// Components
import TitleOption from '../../../../components/FoodQuestions/TitleOption'
import OptionButton from '../../../../components/FoodQuestions/OptionButton'
import CircleCheckedIcon from '../../../../../assets/images/svg/icon/40px/circle/check.svg'

// Api
import api from '../../../../services/api'
import * as userSelectors from '../../../../data/user/selectors'
import { updateUserProfileOnline } from '../../../../data/user'
import BottomHover from '../../../../shared/BottomHover'
import { EatingPreferencesMap } from '../../../../config/svgs/dynamic/eatingPreferencesMap'
import { displayLoadingModal, hideLoadingModal } from '../../../../services/loading'

export const colors = {
  REGULAR: globals.styles.colors.colorPink,
  VEGAN: globals.styles.colors.colorGreen,
  VEGETARIAN: globals.styles.colors.colorGreenLight,
  PESCATARIAN: globals.styles.colors.colorSkyBlue,
  KETO: globals.styles.colors.colorYellow,
  'DAIRY-FREE': globals.styles.colors.colorPurple,
  'GLUTEN-FREE': globals.styles.colors.colorLove,
  'GLUTEN-FREE + DAIRY-FREE': globals.styles.colors.colorTwilight,
  MEDITERRANEAN: globals.styles.colors.colorPastel75Twilight,
}

const EatingPreference = (props) => {
  const [mealPlanTypes, setMealPlanTypes] = useState([])
  const [step, setStep] = useState(0)

  const storedEatingPreferences = useSelector((state) => state.data.user.eating_preferences)
  const [eatingPreferences, setEatingPreferences] = useState(storedEatingPreferences || [])

  useEffect(() => {
    displayLoadingModal()
    api.eating
      .getMealPlanTypes()
      .then((data) => {
        setMealPlanTypes(data)
        hideLoadingModal()
      })
      .catch(() => hideLoadingModal())
  }, [])

  /**
   * Set the user's preference in the API and route
   * to the next appropriate screen
   */
  async function setPreference() {
    const profile = props.route.params?.fromProfile ?? null
    if (eatingPreferences.length === 0) {
      return
    }
    await updateUserProfileOnline({
      id: userSelectors.get().id,
      eating_preference_ids: eatingPreferences.map((e) => e.id),
    })

    if (profile) {
      props.navigation.goBack()
    } else {
      setStep(1)
    }
  }

  const navigateCalculator = (screen) => () => {
    const { navigate } = props.navigation
    navigate(screen)
  }

  const toggle = (id, key, checked) => {
    if (!checked) {
      setEatingPreferences(eatingPreferences.filter((x) => x.id !== id))
    } else {
      setEatingPreferences([...eatingPreferences, { id, key }])
    }
  }

  return (
    <LinearGradient style={styles.slide} colors={[globals.styles.colors.colorLavender, globals.styles.colors.colorSkyBlue]}>
      {step === 0 ? (
        <>
          <StatusBar barStyle="light-content" />
          <BottomHover color={globals.styles.colors.colorSkyBlue}>
            <TouchableOpacity
              disabled={eatingPreferences.length === 0}
              onPress={setPreference}
              style={{
                flex: 1,
                marginVertical: 5,
                marginHorizontal: 24,
                marginTop: 25,
                marginBottom: eatingPreferences.length > 0 ? 0 : 30,
                height: 56,
                borderRadius: 28,
                backgroundColor: globals.styles.colors.colorWhite,
                justifyContent: 'center',
                shadowColor: globals.styles.colors.colorBlackDark,
                shadowOpacity: 0.15,
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 15,
                elevation: 3,
              }}>
              <Text style={styles.save}>SAVE</Text>
            </TouchableOpacity>
            {eatingPreferences.find((x) => x.key === 'KETO') && (
              <Text style={styles.macroText}>
                Since you selected Keto, your macronutrient ratio{'\n'}will be set to: 20% protein, 10% carbs, and 70% fats.
              </Text>
            )}
            {eatingPreferences.length > 0 && !eatingPreferences.find((x) => x.key === 'KETO') && (
              <Text style={styles.macroText}>Your macronutrient ratio will be set to:{'\n'}30% protein, 40% carbs, and 30% fats.</Text>
            )}
          </BottomHover>
          <View>
            <TitleOption style={[styles.titleOption, { marginBottom: 0 }]} title={'What are your eating preferences?'} />
            <Text style={styles.subtitleText}>Your selection(s) will determine your macronutrient ratio.</Text>
          </View>

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[{ paddingBottom: eatingPreferences.length > 0 ? 160 : 120 }]}>
            {mealPlanTypes.map((mpt, idx) => (
              <EatingPreferenceButton
                key={`mpt_${idx}`}
                mpt={mpt}
                selected={eatingPreferences.find((ep) => ep.id === mpt.id)}
                onToggle={toggle}
              />
            ))}
          </ScrollView>
        </>
      ) : null}
      {step === 1 ? (
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <TitleOption title={'How much food do you need to fuel your body?'} />
          <OptionButton active title={'Calculate now'} handlePress={navigateCalculator('Calculator')} />
        </View>
      ) : null}
    </LinearGradient>
  )
}

EatingPreference.navigationOptions = {
  headerShown: false,
}

const EatingPreferenceButton = (props) => {
  const toggle = () => props.onToggle(props.mpt.id, props.mpt.key, !props.selected)
  const SvgIcon = EatingPreferencesMap?.[props.mpt.name.toUpperCase()]
  return (
    <View key={props.mpt.id} style={styles.buttonBg}>
      {SvgIcon && <SvgIcon style={styles.icon} color={colors[props.mpt.key]} width={24} height={24} />}
      <View style={styles.buttonTextContainer}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 16, color: globals.styles.colors.colorGrayDark }}>
          {props.mpt.name.toUpperCase()}
        </Text>
      </View>
      <TouchableOpacity onPress={toggle}>
        {props.selected ? <CircleCheckedIcon color={globals.styles.colors.colorPink} /> : <View style={styles.buttonCheckbox} />}
      </TouchableOpacity>
    </View>
  )
}

export default EatingPreference
