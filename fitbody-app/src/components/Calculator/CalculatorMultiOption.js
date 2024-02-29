import React, { memo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Keyboard } from 'react-native'

// Assets
import globals from '../../config/globals'

const CalculatorMultiOption = (props) => {
  /**
   * Set the active state
   */
  const handleActiveOption = (activeOption) => () => {
    Keyboard.dismiss()
    props.update(activeOption)
  }

  /**
   * Render out each option button
   */
  const renderOption = (data, index) => {
    const elements = props.elementsPerRow ?? 2
    const realWidth = (globals.window.width * 0.86) / elements
    const firstElementStyle = props.type === 'pregnancy' && index === 0 ? { width: '100%' } : undefined
    const active = data.value === props.activeOption

    return (
      <TouchableOpacity
        key={`option-${index}`}
        style={[styles.button, active ? styles.activeButton : styles.inactiveButton, { width: realWidth }, firstElementStyle]}
        onPress={!active ? handleActiveOption(data.value) : null}>
        <View style={styles.buttonContainer}>
          <Text style={[styles.titleLabel, active ? styles.activeLabel : styles.inactiveLabel]}>{data.title.toUpperCase()}</Text>
          {data.subtitle ? <Text style={active ? styles.activeSubtitleLabel : styles.subtitleLabel}>{data.subtitle}</Text> : null}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.title}</Text>
      {props.type === 'pregnancy' ? (
        <View style={styles.rowPregnancy}>{props.options.map(renderOption)}</View>
      ) : (
        <View style={styles.row}>{props.options.map(renderOption)}</View>
      )}
    </View>
  )
}

export default memo(CalculatorMultiOption)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    width: globals.window.width,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    color: globals.styles.colors.colorBlack,
    fontSize: 16,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
  row: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexGrow: 0,
  },
  rowPregnancy: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexGrow: 0,
  },
  button: {
    height: 50,
    width: globals.window.width * 0.43,
    borderRadius: 30,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  activeButton: {
    backgroundColor: globals.styles.colors.colorPink,
  },
  inactiveButton: {
    borderColor: globals.styles.colors.colorGray,
    borderWidth: 1,
  },
  activeLabel: {
    fontSize: 12,
    color: globals.styles.colors.colorWhite,
  },
  inactiveLabel: {
    fontSize: 12,
    color: globals.styles.colors.colorBlack,
  },
  titleLabel: {
    color: globals.styles.colors.colorBlack,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    textAlign: 'center',
  },
  subtitleLabel: {
    fontSize: 10,
    color: globals.styles.colors.colorGrayDark,
  },
  activeSubtitleLabel: {
    fontSize: 10,
    color: globals.styles.colors.colorWhite,
  },
})
