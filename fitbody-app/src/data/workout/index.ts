import { store } from '../../store'
import {
  IClearCheckmarksPayload,
  IClearDownloadsPayload,
  ICreateCompletionPayload,
  IFetchTrainersProgramsPayload,
  IGetWeekPayload,
  IHideCompletionPayload,
  IProgram,
  IProgress,
  ISetAlternativeExercisesMapPayload,
  ISubmitCompletionPayload,
  ITrainer,
  IWorkoutWithCircuits,
  ProgramTypes,
} from './types'
import {
  getWeek as gWeek,
  trainerDataExtracted as tde,
  submitCompletion as subC,
  setCurrentTrainer as sct,
  setCurrentWorkout as scw,
  setCurrentProgram as scp,
  createCompletion as cc,
  hideCompletion as hc,
  fetchTrainersPrograms as ftp,
  setCurrentCategory as scc,
  fetchWeek as fw,
  fetchCompletions as fComp,
  fetchChallenges as fChal,
  clearWorkoutProgress as cwp,
  updateWorkoutProgress as uwp,
  clearCheckmarks as ccm,
  clearChallengeMonth as cchm,
  workoutStarted as ws,
  clearDownloads as cd,
  clearAll,
  getQuizQuestions as gqq,
  checkExistingProgram as cep,
  setAlternativeExercisesMap as saem,
} from './workoutsSlice'

export const getWeek = (data: IGetWeekPayload) => {
  store.dispatch(gWeek(data))
}

export const trainerDataExtracted = () => {
  store.dispatch(tde())
}

export const clearWorkouts = () => {
  store.dispatch(clearAll())
}

export const submitCompletion = (data: ISubmitCompletionPayload) => {
  store.dispatch(subC(data))
}

export const setCurrentTrainer = (data: ITrainer) => {
  store.dispatch(sct(data))
}

export const setCurrentWorkout = (data: {
  workoutId?: number
  currentProgram: Partial<IProgram>
  currentWorkout?: Partial<IWorkoutWithCircuits>
}) => {
  store.dispatch(scw(data))
}

export const setCurrentProgram = (data: IProgram) => {
  store.dispatch(scp(data))
}

export const setCurrentCategory = (data: { categoryId: number }) => {
  store.dispatch(scc(data))
}

export const createCompletion = (data: ICreateCompletionPayload) => {
  store.dispatch(cc(data))
}

export const hideCompletion = (data: IHideCompletionPayload) => {
  store.dispatch(hc(data))
}

export const fetchTrainersPrograms = (data: IFetchTrainersProgramsPayload) => {
  store.dispatch(ftp(data))
}

export const fetchWeek = (data: { program: number; week_number: number }) => {
  store.dispatch(fw(data))
}

export const fetchCompletions = () => {
  store.dispatch(fComp())
}

export const fetchChallenges = (data: string) => {
  store.dispatch(fChal(data))
}

export const clearWorkoutProgress = () => {
  store.dispatch(cwp())
}

export const updateWorkoutProgress = (data: IProgress) => {
  store.dispatch(uwp(data))
}

export const clearCheckmarks = (data: IClearCheckmarksPayload) => {
  store.dispatch(ccm(data))
}

export const workoutStarted = () => {
  store.dispatch(ws())
}

export const clearDownloads = (data: IClearDownloadsPayload) => {
  store.dispatch(cd(data))
}

export const clearChallengeMonth = () => {
  store.dispatch(cchm())
}

export const getQuizQuestions = () => {
  store.dispatch(gqq())
}

export const checkExistingProgram = (workoutGoal: ProgramTypes | null) => {
  store.dispatch(cep(workoutGoal))
}

export const setAlternativeExercisesMap = (data: ISetAlternativeExercisesMapPayload) => {
  store.dispatch(saem(data))
}
