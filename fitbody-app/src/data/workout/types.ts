import { Action } from '@reduxjs/toolkit'

/* ******** Action Types *************/
export const FETCH_TRAINERS_PROGRAMS = 'workouts/fetchTrainersPrograms'
export const FETCH_CHALLENGES = 'workouts/fetchChallenges'
export const FETCH_WEEK = 'workouts/fetchWeek'
export const FETCH_COMPLETIONS = 'workouts/fetchCompletions'
export const CLEAR_CHECKMARKS = 'workouts/clearCheckmarks'
export const CREATE_COMPLETION = 'workouts/createCompletion'
export const HIDE_COMPLETION = 'workouts/hideCompletion'
export const GET_WEEK = 'workouts/getWeek'
export const GET_QUIZ_QUESTIONS = 'workouts/getQuizQuestions'
export const SUBMIT_COMPLETION_COMMIT = 'workouts/submitCompletion/commit'
export const SUBMIT_COMPLETION_ROLLBACK = 'workouts/submitCompletion/rollback'

// export type TrainersJson = typeof import('../../../assets/trainers.json')
export type TrainersJson = {
  trainers: ITrainer[]
  programs: Record<ProgramTypes, IProgram>
}

/* ******** Enums *************/

export enum DownloadEntryType {
  'media' = 'media',
  'trainers' = 'trainers',
  'challenges' = 'challenges',
  'workouts' = 'workouts',
  'completions' = 'completions',
  'week' = 'week',
}

export enum ProgramTypes {
  'SHRED' = 'SHRED',
  'TONE' = 'TONE',
  'SCULPT' = 'SCULPT',
  'GROW + GLOW' = 'GROW + GLOW',
  'STRONG' = 'STRONG',
  'ENDURANCE' = 'ENDURANCE',
  'MOVE' = 'MOVE',
  'RISE' = 'RISE',
  'REVIVE' = 'REVIVE',
  'LIFT' = 'LIFT',
  'IGNITE' = 'IGNITE',
}

export enum LevelTitle {
  'Beginner' = 'Beginner',
  'Intermediate' = 'Intermediate',
  'Advanced' = 'Advanced',
}

export type FinalObject = {
  programs: Record<ProgramTypes, IProgram>
  trainers: ITrainer[]
}

export type DownloadEntry = {
  Url: string
  ZipPath: string
  skipDownload?: boolean
}

export interface ILevel {
  id: number
  title: LevelTitle
}

export interface ICardioInfo {
  name: string
  description: string
}

export interface ICategory {
  id: number
  title: string
  image: string
  sort_order: number
  icon_url: string
  icon: {
    id: number
    name: string
    icon_url: string
  }
  hidden?: boolean
}

export interface IEquipment {
  name: string
  icon_url: string
  adds_to_weight: boolean
}

export interface ITiming {
  circuit?: string
  circuit_id: number
  circuit_title?: string // refactor timings to use only either circuit or circuit_title as the name of circuit
  time: number
  elapsed: number
}

export interface IRound {
  label: string
  description: string
  round_number: number
  start_week: number
  end_week: number
  is_open: boolean
  is_in_progress: boolean
  is_checked: boolean
  is_active: boolean
}

export interface IProperFormTip {
  id: number
  exercise_id: number
  description: string
  sound_file: string
  sound_duration?: number
  sound_file_mime: string
  tts_status: string
  hidden: boolean
}

export interface IProgramDisclaimer {
  id: number
  title: string
  text: string
}

export interface IProgram {
  id: number
  title: string
  subtitle: string
  description: string
  long_description: string
  slug: ProgramTypes
  special_equipment_enabled: boolean
  special_equipment_name: string | null
  background_image_url: string
  background_image_card_url: string
  background_image_color_card_url: string
  icon_url: string
  logo_big_url: string
  logo_small_url: string
  color: string
  color_secondary: string
  workout_max_week: number
  total_workout_weeks: number
  sort_order: number
  hide_rounds: boolean
  hide_challenges: boolean
  all_weeks_available: boolean
  at_home: boolean
  at_gym: boolean
  show_in_workouts_mvp: boolean
  week_meta: any[]
  disclaimers: IProgramDisclaimer[]
  video_url: string
  session_duration: string
  has_disclaimer: boolean
  disclaimer_title: string | null
  disclaimer_text: string | null
  approval_required: boolean
  week_selection_required: boolean
  week_selection_title: string | null
  week_selection_text: string | null
  bullets: string[]
  categories: ICategory[]
  equipment: IEquipment[]
  rounds: IRound[]
  is_coming_soon: boolean
}

export interface ITrainer {
  id: number
  name: string
  subtitle: string
  color: string
  secondary_color: string
  logo_url: string
  foreground_img_url: string
  background_img_url: string
  banner_img_url: string
  icon_url: string
  sort_order: number
  description: string
  programs: number[]
}

export interface ITrainerWithPrograms extends Omit<ITrainer, 'programs' | 'categories' | 'equipment'> {
  programs: IProgram[]
  categories: ICategory[]
  equipment: IEquipment[]
}

export interface ICircuitExercise {
  exercise_id: number
  reps?: string
  weight?: null
  weight_kg?: null
  duration?: number
  secondary_timer?: boolean
  audio_alerts?: boolean
  if_each_side: boolean
  replacements?: IAlternativeExercise[]
  exercise: IExercise
}

export interface IExercise {
  id: number
  exercise_id: number
  title: string
  name?: string
  reps?: string
  weight?: null
  weight_kg?: null
  duration?: number
  secondary_timer?: boolean
  audio_alerts?: boolean
  if_each_side: boolean
  video_url: string
  image_url: string
  proper_form_tip?: IProperFormTip
  hidden?: boolean
  replacements?: IAlternativeExercise[]
  equipment: IEquipment[]
}

export interface IAlternativeExercise extends IExercise {
  replacement_id: number
  type: string
}

export interface ICircuit {
  id: number
  level_id: number
  sort_order?: number
  circuits_masters_id: number
  special_equipment: boolean
  rounds_or_reps: number
  exercises: ICircuitExercise[]
  circuitMaster?: ICircuitMaster
}

export interface ICardioWorkout {
  cardio_type_id: number
  level_id: number
  duration: number
  walkthroughs: number[]
  cardioType: ICardioType
}

export interface ICardioWorkoutWithWalkthroughs extends Omit<ICardioWorkout, 'walkthroughs'> {
  walkthroughs: ICardioWalkthrough[]
}

export interface ICardioType {
  id: number
  name: string
  description: string
  guidance_id: number
}

export interface ICardioDirective {
  id: number
  start_time: number
  audio_file_url: string | null
  directive_length: number
  caption: string
  time_caption: string
}

export interface ICardioWalkthrough {
  id: number
  cardio_type_id: number
  cardio_exercise_id: number
  directives: ICardioDirective[]
}

export interface ICardioExercise {
  id: number
  name: string
  icon_url: string
}

export interface ICircuitMaster {
  id: number
  circuits_title: string
  rest_between_exercise?: boolean
  rest_after_set?: number
  rest_after_circuit?: number
}

export interface IWorkout {
  id: number
  day_title?: string
  legacy_workout_id?: number
  title: string
  challenge_name?: string
  is_challenge?: boolean
  image_url: string
  duration: number
  circuits: number[]
  equipment: IEquipment[]
  cardio: ICardioWorkout[]
  downloading?: boolean
  downloaded?: boolean
}

export interface IWorkoutWithCircuits extends Omit<IWorkout, 'circuits' | 'cardio'> {
  circuits: ICircuit[]
  cardio: ICardioWorkoutWithWalkthroughs[]
}

export interface IChallengeDay {
  id: number
  date: string
  description: string
  resistance_band: false
  repeat_until: null
  reps_and_rounds: number
  day_subtitle: string
  challenge_duration: number
  equipment: IEquipment[]
  exercises: IExercise[]
  downloaded?: boolean
  downloading?: boolean
}

export interface IWeekStateDay {
  id: number
  week_id: number
  day_title: string
  day_subtitle: string
  warm_up_cardio: null
  duration_cardio: null
  duration_abs: null
  duration: number
  workout_completed: boolean
}

export interface IWeekState {
  id: number
  program: ProgramTypes
  resistance_bands: boolean
  week_number: number
  days: IWeekStateDay[]
}

export interface IChallengeMonth {
  title: string
  month: number
  year: number
  bg_image_url: string
  bg_image_thumb_url: string
  days: IChallengeDay[]
  exercises: IExercise[]
}

export interface IWorkoutWeekResponse {
  categories: {
    id: number
    workout_count: number
    workouts: number[]
  }[]
  workouts: IWorkout[]
  circuits: ICircuit[]
  exercises: IExercise[]
  cardio_types: ICardioType[]
  cardio_walkthroughs: ICardioWalkthrough[]
  levels: ILevel[]
  cardio_exercises: ICardioExercise[]
  circuit_masters: ICircuitMaster[]
}

export interface IWorkoutLog {
  id?: number | string
  workout_id?: number | null
  challenge_id?: number | null
  video_id: number | null
  user_id?: number
  time: number
  date: string
  hidden: boolean
  manual: boolean
  meta: { [key: string]: any }
  created_at?: string
  updated_at?: string
}

export interface ICompletion extends IWorkoutLog {
  category_icon_url: string | null
  trainer_color?: string
  trainer_color_secondary?: string
  program_color?: string
  program_color_secondary?: string
  workout_title?: string
  workout_category?: string
  level_title?: string
  week_number?: number
  program_id?: number
  trainer_id: number
  challenge_name?: string | null
  is_challenge?: boolean
  is_video: boolean
  challenge_day?: number | null
  challenge_background_img?: string | null
  video_title?: string | null
}

export type QuizLevel = {
  id: number
  title: string
  sort_order: number
  value: number
}

export type QuizGoal = {
  id: number
  title: string
  sort_order: number
  value: number
}

export type QuizLocation = {
  id: number
  title: string
  sort_order: number
  value: number
}

export type QuizPace = {
  id: number
  title: string
  sort_order: number
  value: number
}

export interface IQuizQuestion {
  levels: QuizLevel[]
  goals: QuizGoal[]
  locations: QuizLocation[]
  paces: QuizPace[]
}

export interface ICategoriesState {
  [key: number]: {
    [key: number]: {
      [key: number]: number[]
    }
  }
}

export interface IAlternativeExerciseMap {
  [key: number]: {
    [key: number]: IAlternativeExercise
  }
}

export interface IProgress {
  elapsed?: number
  currentSet?: number
  currentCircuit?: number
  currentExerciseIndex?: number
}

export interface IDownloadStateData {
  downloadId: string
  progress: number
  payloadToSave: any
  links: DownloadEntry[]
  type: DownloadEntryType
}

export interface IDownloadState {
  [key: string]: IDownloadStateData
}

/* ************ Initial State ************ */

export type WorkoutState = {
  week: number | null
  weeks: { [key: string]: IWeekState }
  workout: null
  challenge: null
  circuitIndex: number
  roundIndex: number
  excerciseIndex: number
  times: []
  isRecoverable: boolean
  downloading: []
  downloadInfoViewed: boolean
  initialWeeksDownloaded: boolean
  downloadingChallenges: []
  downloadedWorkouts: {}
  downloadedChallenges: {}
  downloadedVideos: {}
  downloadedChallengeVideos: {}
  trainers: ITrainer[]
  programs: Record<ProgramTypes, IProgram>
  quizQuestions: IQuizQuestion | null
  currentTrainer: ITrainer | null
  currentProgram: IProgram | null
  completions: ICompletion[]
  alternativeExercisesMap: IAlternativeExerciseMap | {}
  categories: ICategoriesState | { [key: number]: never }
  trainersExtracted: boolean
  workouts: {
    [key: number]: IWorkout
  }
  circuits: {
    [key: number]: ICircuit
  }
  exercises: {
    [key: number]: IExercise
  }
  cardio_types: {
    [key: number]: ICardioType
  }
  levels: {
    [key: number]: ILevel
  }
  cardio_walkthroughs: {
    [key: number]: ICardioWalkthrough
  }
  cardio_exercises: {
    [key: number]: ICardioExercise
  }
  circuit_masters: {
    [key: number]: ICircuitMaster
  }
  challengeMonth?: IChallengeMonth
  downloads: IDownloadState
  currentCategory: number
  currentWorkout?: IWorkoutWithCircuits
  progress: IProgress | null
}

/* ************ Payloads, responses, and reducers ************ */

export interface ActionWithPayload<T, P> extends Action {
  type: T
  payload: P
  meta?: any
}

export interface IClearCheckmarksPayload {
  program_id?: number
  week_id?: number
  video_category_id?: number
  hidden: boolean
}

export interface ICreateCompletionPayload {
  workout_id: number
  manual: boolean
  date: string
  meta: { key: string; value: any }
}

export interface IHideCompletionPayload {
  id: number
}

export interface IFetchTrainersProgramsPayload {
  forceDownload?: boolean
}

export interface IGetWeekPayload {
  week_id: number
  program: ProgramTypes
  resistance_bands: boolean
}

export interface IGetWeekResponse extends IWeekState {}

export interface ISubmitCompletionPayload {
  server: {
    workout_id?: number
    challenge_id?: number
    video_id?: number
    manual: boolean
    date: string
    meta: { key: string; value: any } | {}
  }
  local: ICompletion
}

export interface IClearDownloadsPayload {
  programId: number
}

export interface ISetAlternativeExercisesMapPayload {
  currentCircuit: number
  currentExerciseIndex: number
  exercise: IAlternativeExercise
}

export enum QuizResponseProgramType {
  'program' = 'program',
  'on_demand' = 'on_demand',
}

export type QuizResponseGifProgram = {
  type: QuizResponseProgramType.program
  slug: ProgramTypes
  sort_order: number
}

export type QuizResponseOnDemandProgram = {
  type: QuizResponseProgramType.on_demand
  id: number
  sort_order: number
}

export interface IGetQuizResponsePayload {
  level: number
  location: number
  goal: number
  pace: number
}

export type IGetQuizResponseBodyData = QuizResponseGifProgram | QuizResponseOnDemandProgram

export interface IGetQuizResponseBody {
  data: IGetQuizResponseBodyData[]
}
