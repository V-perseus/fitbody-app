import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { vs } from 'react-native-size-matters/extend'

import { ButtonRound } from '../../../../components/Buttons/ButtonRound'
import { ButtonSquare } from '../../../../components/Buttons/ButtonSquare'
import ExerciseInfoBox from '../ExerciseInfoBox'

import globals from '../../../../config/globals'

import { resolveLocalUrl } from '../../../../services/helpers'

const NO_OP = () => {}

export const AlternativeMoveCard = ({ item, unit, trainer, program, onReplace = NO_OP, toggleShowState }) => {
  const [showReplace, setShowReplace] = useState(false)

  function handleReplacePress() {
    setShowReplace(true)
  }
  function handleReplaceSubmit() {
    setShowReplace(false)
    onReplace(item)
  }

  useEffect(() => {
    // @DEV ensures that if you leave the screen in the 'revert' state, it will revert back to the 'original' state
    setShowReplace(false)
  }, [toggleShowState])

  return (
    <View style={styles.container(showReplace)}>
      {showReplace ? (
        <View style={styles.replaceContainer}>
          <Text style={styles.replaceText}>This will replace the current exercise in this workout.</Text>
          <ButtonSquare
            onPress={handleReplaceSubmit}
            style={{ backgroundColor: globals.styles.colors.colorLove, height: 48, width: '100%' }}
            textStyle={styles.revertButtonsText}
            text={item.type ? 'REPLACE MOVE' : 'REVERT BACK'}
          />
          <ButtonSquare
            onPress={() => setShowReplace(false)}
            style={{ borderWidth: 2, borderColor: globals.styles.colors.colorWhite, height: 48, width: '100%' }}
            textStyle={styles.revertButtonsText}
            text="KEEP MOVE"
          />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            {/* Only alternates and modifications have a type property */}
            <Text style={styles.headerText}>{item.type || 'ORIGINAL'}</Text>
            <ButtonRound
              text={item.type ? 'REPLACE' : 'REVERT'}
              textStyle={styles.replaceButtonText}
              style={styles.replaceButton}
              onPress={handleReplacePress}
            />
          </View>
          <View style={styles.body}>
            <View style={styles.bodyTop}>
              <Text style={styles.exerciseTitle}>{item.exercise.title}</Text>
              <Image height={85} width={85} style={styles.exerciseImage} source={{ uri: resolveLocalUrl(item.exercise.image_url) }} />
            </View>
            <ExerciseInfoBox
              unit={unit}
              trainer={trainer}
              program={program}
              exercise={item}
              borderColor={globals.styles.colors.colorLove}
            />
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: (replace) => ({
    backgroundColor: replace ? globals.styles.colors.colorBlack : globals.styles.colors.colorWhite,
    position: 'relative',
    flex: 1,
    maxHeight: 254,
    borderRadius: 20,
    shadowColor: globals.styles.colors.colorTransparentBlack30,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 3,
  }),
  replaceContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 38,
    paddingHorizontal: 24,
  },
  replaceText: {
    color: globals.styles.colors.colorWhite,
    fontSize: 18,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    textAlign: 'center',
  },
  revertButtonsText: { fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 14 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 51,
    backgroundColor: globals.styles.colors.colorBlack,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  headerText: {
    color: globals.styles.colors.colorWhite,
    textAlign: 'left',
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 14,
  },
  replaceButton: { backgroundColor: globals.styles.colors.colorTransparentWhite15, height: 32, width: 83 },
  replaceButtonText: { fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 12 },
  body: { flex: 1, paddingVertical: 22, justifyContent: 'space-between' },
  bodyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24 },
  exerciseTitle: {
    fontSize: 25,
    color: globals.styles.colors.colorBlack,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    maxWidth: 205,
  },
  exerciseImage: { height: vs(85), width: vs(85) },
})
