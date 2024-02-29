import { ExerciseWeightUnit } from '../../../../data/user/types'

export enum Unit {
  KG = 'kg',
  LBS = 'lbs',
}

export interface SetInput {
  reps: string
  unit: ExerciseWeightUnit
  weight: string
}
