import { View, Text, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { memo, useState } from 'react'
import LinearGradient2 from 'react-native-linear-gradient'
import Star from '../../../../../assets/images/svg/icon/16px/star.svg'
import globals from '../../../../config/globals'
import { createStyles } from './styles'
import { SetInput, Unit } from './types'
import { TextInput } from 'react-native'
import { ButtonFloating } from '../../../../components/Buttons/ButtonFloating'
import { useAppSelector } from '../../../../store/hooks'
import { currentCircuitSelector, currentCircuitsSelector, currentWorkoutColorsSelector } from '../../../../data/workout/selectors'
import { Platform } from 'react-native'
import { useSelector } from 'react-redux'
import { userSelector } from '../../../../data/user/selectors'
import { ExerciseWeightUnit } from '../../../../data/user/types'

const WeightTrackInputComponent: React.FC = () => {
  const { primaryColor, secondaryColor } = useAppSelector(currentWorkoutColorsSelector)
  const currentCircuit = useSelector(currentCircuitSelector)
  const circuits = useSelector(currentCircuitsSelector)
  const styles = createStyles(primaryColor, secondaryColor)
  const { exercise_weight_unit } = useSelector(userSelector)

  const initialInputs: SetInput[] = Array.from({ length: circuits[currentCircuit].rounds_or_reps }, () => ({
    reps: '',
    unit: ExerciseWeightUnit.lbs,
    weight: '',
  }))

  const [inputs, setInputs] = useState<SetInput[]>(initialInputs)

  const handleInputChange = (index: number, field: keyof SetInput, value: string) => {
    const updatedInputs = [...inputs]
    if (field === 'unit') {
      updatedInputs[index][field] = value as ExerciseWeightUnit
    } else {
      updatedInputs[index][field] = value !== '' ? value : '' // Update this line
    }
    setInputs(updatedInputs)
  }

  const handleSaveButtonPress = () => {
    //call API
    console.log(inputs)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}>
      <View style={[styles.container, { position: 'relative' }]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
          <View style={styles.description}>
            <Star color={globals.styles.colors.colorBlack} width={16} height={16} />
            {/* TODO: remove the mock data and add a common text style. I'm not sure what that is yet.... 🤪 ) */}
            <Text style={styles.descText}>On May 5th, you tracked 15 lbs for this exercise.</Text>
          </View>
          <View>
            {inputs.map((set, index) => (
              <View key={index}>
                <View style={styles.setTitleView}>
                  <Text style={styles.setTitleText}>SET {index + 1}</Text>
                </View>
                <View style={styles.setContainer}>
                  <View style={styles.leftInputWrapper}>
                    <View style={styles.customInput}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="8"
                        placeholderTextColor={globals.styles.colors.colorGrayDark}
                        value={set.reps} // Update this line
                        keyboardType="number-pad"
                        onChangeText={(text) => handleInputChange(index, 'reps', text)}
                      />
                      <View style={styles.inputRightWrapper}>
                        <Text style={styles.inputRightTopText}>REPS</Text>
                        <Text style={styles.inputRightBottomText}>EACH SIDE</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.rightInputWrapper}>
                    <View style={styles.customInput}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="5"
                        placeholderTextColor={globals.styles.colors.colorGrayDark}
                        value={set.weight}
                        keyboardType="decimal-pad"
                        onChangeText={(text) => handleInputChange(index, 'weight', text)}
                      />
                      <View style={styles.inputRightWrapper}>
                        <Text style={styles.inputRightTopText}>{exercise_weight_unit === ExerciseWeightUnit.lbs ? 'LBS' : 'KG'}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <LinearGradient2
          colors={[globals.styles.colors.colorTransparentWhite15, globals.styles.colors.colorWhite, globals.styles.colors.colorWhite]}
          style={styles.saveButton}>
          <ButtonFloating style={{ backgroundColor: primaryColor }} pgColor={primaryColor} text="SAVE" onPress={handleSaveButtonPress} />
        </LinearGradient2>
      </View>
    </KeyboardAvoidingView>
  )
}

export const WeightTrackInput = memo(WeightTrackInputComponent)
