import React, { memo } from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'

// Components
import WorkoutOverviewExercise from '../WorkoutOverviewExercise'

// Types
import { ICircuitExercise, IProgram, ITrainer } from '../../../../data/workout/types'

// Styles
import globals from '../../../../config/globals'

interface ICircuitCardProps {
  title: string
  repsRounds: string
  exercises: ICircuitExercise[]
  active?: boolean
  unit: string
  program: IProgram
  trainer: ITrainer
  style?: ViewStyle
}
const CircuitCard: React.FC<ICircuitCardProps> = ({ title, repsRounds, exercises, active, unit, program, trainer, style }) => {
  return (
    <View style={[{ paddingBottom: 10, paddingHorizontal: 4, width: '100%' }, style]}>
      <View style={styles.borderedContainer}>
        <View style={styles.overflowed}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{(title || '').toUpperCase()}</Text>
            <Text style={styles.rounds}>
              {repsRounds} SET{parseInt(repsRounds, 10) > 1 ? 'S' : ''}
            </Text>
          </View>
          {exercises.map((exercise, index) => (
            <WorkoutOverviewExercise
              last={exercises.length === index}
              active={active}
              unit={unit}
              program={program}
              trainer={trainer}
              key={`0x${index}`}
              exercise={exercise}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  borderedContainer: {
    flexGrow: 1,
    borderWidth: 0,
    borderRadius: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 0.17,
    shadowRadius: 14,
    backgroundColor: 'white',
  },
  overflowed: { borderRadius: 20, overflow: 'hidden' },
  textContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'black',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: 'white', fontSize: 14, fontFamily: globals.fonts.primary.boldStyle.fontFamily },
  rounds: { color: 'white', fontSize: 14, fontFamily: globals.fonts.primary.semiboldStyle.fontFamily },
})

export default memo(CircuitCard)
