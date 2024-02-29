import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../../store'
import { ProgramTypes, ICategoriesState, IWorkoutWithCircuits, LevelTitle } from './types'

// export const selectMvpPrograms = createSelector<RootState, RootState, ITrainer[], Record<ProgramTypes, IProgram>>(
export const selectMvpPrograms = createSelector(
  (state: RootState) => state.data.workouts.trainers,
  (state: RootState) => Object.keys(state.data.workouts.programs ?? {}).map((k) => state.data.workouts.programs[k as ProgramTypes]),
  (trainers, programs) =>
    trainers
      ?.find((t) => t.id === 1)
      ?.programs?.map((tp) => programs.find((p) => p.id === tp))
      .filter((p) => p?.show_in_workouts_mvp) || [],
)

export const selectTrainersWithPrograms = createSelector(
  (state: RootState) => state.data.workouts.trainers,
  (state: RootState) => state.data.workouts.programs,
  (trainers, programs) =>
    Object.values(trainers).map((t) => ({
      ...t,
      programs: t.programs.map((tpID) => Object.values(programs).find((p) => p.id === tpID)),
    })),
)

export const currentTrainerWithPrograms = createSelector(
  (state: RootState) => state.data.workouts.currentTrainer,
  (state: RootState) => state.data.workouts.programs,
  (trainer, programs) => ({
    ...trainer,
    programs: trainer?.programs.map((tpID) => Object.values(programs).find((p) => p.id === tpID)),
  }),
)

export const videoCompletionsSelector = createSelector(
  (state: RootState) => state.data.workouts.completions,
  (completions) => completions?.filter((c) => c.video_id !== null),
)

export const categoriesSelector = createSelector(
  (state: RootState) => state.data.workouts.categories as ICategoriesState,
  (state: RootState) => state.data.user.workout_goal as ProgramTypes,
  (state: RootState) => state.data.workouts.programs,
  (state: RootState) => state.data.user.meta?.programs,
  (categories, workoutGoal, programs, userMetaPrograms) => {
    const currentProgram = programs && workoutGoal ? programs?.[workoutGoal] : null
    if (!currentProgram || !categories || !workoutGoal || !userMetaPrograms || !programs) {
      return []
    }
    const current_week = userMetaPrograms[workoutGoal.toLowerCase()]?.current_week ?? 1
    return categories?.[currentProgram.id]?.[current_week] ?? []
  },
)

export const currentProgramWeekSelector = createSelector(
  (state: RootState) => state.data.user.workout_goal as ProgramTypes,
  (state: RootState) => state.data.user.meta?.programs,
  (workoutGoal, userMetaPrograms) => {
    if (!workoutGoal || !userMetaPrograms) {
      return 1
    }
    return (userMetaPrograms[workoutGoal.toLowerCase()]?.current_week as number) ?? 1
  },
)

export const currentProgramFromWorkoutGoalSelector = createSelector(
  (state: RootState) => state.data.user.workout_goal as ProgramTypes,
  (state: RootState) => state.data.workouts.programs,
  (workoutGoal, programs) => {
    return programs[workoutGoal] || null
  },
)

export const currentCircuitSelector = createSelector(
  (state: RootState) => state.data.workouts.progress?.currentCircuit,
  (currentCircuit) => {
    return currentCircuit || 0
  },
)

export const currentExerciseIndexSelector = createSelector(
  (state: RootState) => state.data.workouts.progress?.currentExerciseIndex,
  (index) => {
    return index || 0
  },
)

export const currentCircuitsSelector = createSelector(
  (state: RootState) => state.data.workouts.currentWorkout as IWorkoutWithCircuits,
  (state: RootState) => state.data.user.resistance_bands,
  (state: RootState) => state.data.workouts.currentProgram,
  (state: RootState) => state.data.workouts.currentTrainer,
  (state: RootState) => state.data.user.meta?.trainers,
  (workout, specialEquipment, currentProgram, currentTrainer, userMetaTrainers) => {
    if (!currentTrainer || !currentProgram || !workout) {
      return []
    }
    const levelId = userMetaTrainers?.[currentTrainer.id]?.level_id
    return workout.circuits.filter(
      (c) =>
        (c.special_equipment === specialEquipment ||
          (currentProgram.special_equipment_enabled === false && c.special_equipment === false)) &&
        c.level_id === levelId,
    )
  },
)

export const currentWorkoutColorsSelector = createSelector(
  (state: RootState) => state.data.workouts.currentProgram,
  (state: RootState) => state.data.workouts.currentTrainer,
  (state: RootState) => state.data.workouts.currentWorkout as IWorkoutWithCircuits,
  (prog, trainer, workout) => {
    if (!trainer || !prog || !workout) {
      return { primaryColor: '', secondaryColor: '' }
    }
    const { primaryColor, secondaryColor } = workout.is_challenge
      ? { primaryColor: prog.color, secondaryColor: prog.color_secondary }
      : { primaryColor: trainer.color, secondaryColor: trainer.secondary_color }
    return { primaryColor, secondaryColor }
  },
)

export const currentTrainerLevelSelector = createSelector(
  (state: RootState) => state.data.user,
  (state: RootState) => state.data.workouts.currentTrainer,
  (state: RootState) => state.data.workouts.levels,
  (user, currentTrainer, levels) => {
    if (!currentTrainer) {
      return {
        levelId: 1,
        level: {
          id: 1,
          title: LevelTitle.Beginner,
        },
      }
    }
    const levelId = user.meta?.trainers?.[currentTrainer?.id ?? 1]?.level_id as number
    const level = levels?.[levelId]
    return {
      levelId,
      level,
    }
  },
)

export const currentCategorySelector = createSelector(
  (state: RootState) => state.data.workouts,
  (workouts) => {
    const categoryId = workouts.currentCategory
    return workouts.currentProgram?.categories?.find((c) => c.id === categoryId)
  },
)

export const completedWorkoutsSelector = createSelector(
  (state: RootState) => state.data.user.meta?.programs,
  (state: RootState) => state.data.workouts.completions || [],
  (state: RootState) => state.data.workouts.workouts,
  (state: RootState) => state.data.workouts.categories,
  (state: RootState) => state.data.workouts.currentCategory,
  (state: RootState) => state.data.workouts.programs,
  (state: RootState) => state.data.user.workout_goal,
  (userMetaPrograms, completions, workouts, categories, categoryId, programs, currentProgramSlug) => {
    if (!currentProgramSlug || !userMetaPrograms) {
      return {
        completions: [],
        completionsReversed: [],
        workouts: [],
        completionsCount: 0,
        category: {},
      }
    }
    const currentProgram = programs ? programs[currentProgramSlug] : null
    if (!currentProgram) {
      return {
        completions: [],
        completionsReversed: [],
        workouts: [],
        completionsCount: 0,
        category: {},
      }
    }
    const currWeek = userMetaPrograms[currentProgramSlug.toLowerCase()]?.current_week ?? 1
    const currentWeekCategories = categories?.[currentProgram.id]?.[currWeek] ?? []
    const categoryWorkouts = currentWeekCategories?.[categoryId]
    const weekWorkouts = categoryWorkouts ? categoryWorkouts.map((cw) => workouts[cw]) : []
    const reversed = [...completions].reverse()
    const filteredCompletions = weekWorkouts.map((w) => reversed.find((c) => c.workout_id === w.id)).filter((c) => c && !c.hidden)
    const currentProgramCategory = currentProgram.categories?.find((c) => c.id === categoryId)
    return {
      completions,
      completionsReversed: reversed,
      workouts: weekWorkouts,
      completionsCount: filteredCompletions?.length ?? 0,
      category: currentProgramCategory,
    }
  },
)
