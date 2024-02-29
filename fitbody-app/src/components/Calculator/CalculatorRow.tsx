import React from 'react'
import { TextInput, Text, StyleSheet, View } from 'react-native'
// Assets
import globals from '../../config/globals'
import { HeightUnit, WeightUnit } from '../../data/user/types'
import CalculatorButton from './CalculatorButton'

export type RowValueType = { value: number | undefined; unit: HeightUnit | WeightUnit | undefined }
export type RowButtonsDataType = { value: HeightUnit | WeightUnit; title: string }
interface ICalculatorRowProps {
  type: 'height' | 'weight' | 'age' | 'activity'
  title: string
  value: RowValueType
  update: (value: RowValueType) => void
  activityValue?: string
  activityUpdate?: () => void
  inputData: string[]
  buttonsData: RowButtonsDataType[]
  updateUnit?: (unit: HeightUnit | WeightUnit) => void
  singleButton?: boolean
}
function CalculatorRow({
  type,
  title,
  value,
  activityValue,
  update,
  activityUpdate,
  buttonsData,
  updateUnit,
}: ICalculatorRowProps): JSX.Element {
  // Inches -> Cm
  // const convertInchesToCm = (inches) => parseFloat((inches * 2.54).toFixed(2))

  // // Cm -> Inches
  // const convertCmToInches = (cm) => parseFloat((cm / 2.54).toFixed(2))

  // // Pound -> Kg
  // const convertPoundToKg = (pound) => parseFloat((pound / 2.2046).toFixed(2))

  // // Kg -> Pound
  // const convertKgToPound = (kg) => parseFloat((kg * 2.2046).toFixed(2))

  function handleOnChangeText(text: string) {
    update({
      value:
        value.unit === 'inches' && value?.value !== undefined ? parseInt(text || '0') * 12 + (value.value % 12) : parseInt(text || '0'),
      unit: value.unit,
    })
  }

  function handleOnChangeTextInches(text: string) {
    update({
      value: Math.floor(value.value! / 12) * 12 + (parseFloat(text) || 0 / 12),
      unit: value.unit,
    })
  }

  function handleActivityUpdate() {
    activityUpdate?.()
  }

  let style = type === 'height' && value.unit === 'inches' ? styles.doubleInput : styles.singleInput

  let valueString = value ? value.value?.toString() : '0'

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.internalRow}>
        {/* Field */}
        {type === 'activity' ? (
          <>
            <TextInput
              // placeholder={placeholder}
              testID="input"
              style={[styles.input, styles.singleInput]}
              value={activityValue}
              autoCorrect={false}
            />
            <CalculatorButton key={'single_btn'} title={'UPDATE'} handlePress={handleActivityUpdate} active={true} />
          </>
        ) : (
          <>
            <TextInput
              // placeholder={placeholder}
              testID="input"
              style={[styles.input, style]}
              value={value.unit === 'inches' && value?.value !== undefined ? Math.floor(value.value / 12).toString() : valueString}
              onChangeText={handleOnChangeText}
              autoCorrect={false}
              keyboardType="number-pad"
              returnKeyType="done"
            />
            {/* Inches field */}
            {value.unit === 'inches' && value.value !== undefined ? (
              <TextInput
                // placeholder={inputData[1]}
                testID="inches_input"
                style={[styles.input, styles.doubleInput]}
                value={value.value ? Math.floor(value.value % 12).toString() : undefined}
                onChangeText={handleOnChangeTextInches}
                autoCorrect={false}
                keyboardType="number-pad"
                returnKeyType="done"
              />
            ) : null}

            {/* Buttons */}
            {buttonsData.map((item, index) => (
              <CalculatorButton
                key={`cb${index}`}
                title={item.title}
                handlePress={() => updateUnit?.(item.value)}
                active={item.value === value.unit}
              />
            ))}
          </>
        )}
      </View>
    </View>
  )
}

export default CalculatorRow

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'column',
    width: globals.window.width,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    color: globals.styles.colors.colorBlack,
    fontSize: 16,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
  internalRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  input: {
    fontSize: 14,
    color: globals.styles.colors.colorBlack,
    borderBottomColor: globals.styles.colors.colorGray,
    borderBottomWidth: 1,
    paddingTop: 2,
    paddingBottom: 13,
  },
  singleInput: {
    width: globals.window.width * 0.44,
  },
  doubleInput: {
    width: globals.window.width * 0.22,
  },
})
