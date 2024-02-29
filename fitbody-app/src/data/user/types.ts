import { Action } from '@reduxjs/toolkit'
import { IGetQuizResponseBodyData, ProgramTypes } from '../workout/types'

export const UPDATE = 'user/UPDATE'
export const CLEAR = 'user/CLEAR'
export const SET_CURRENT_WEEK = 'user/SET_CURRENT_WEEK'
export const SET_TOOLTIPS_VIEWED = 'user/SET_TOOLTIPS_VIEWED'
export const SET_CURRENT_GOAL = 'user/SET_CURRENT_GOAL'
export const UPDATE_USER_PROFILE_ONLINE = 'users/updateUserProfileOnline'
export const UPDATE_USER_PROFILE = 'users/updateUserProfile'
export const UPDATE_USER_PROFILE_COMMIT = 'users/updateUserProfile/commit'
export const UPDATE_USER_PROFILE_ROLLBACK = 'users/updateUserProfile/rollback'
export const UPDATE_USER_META_COMMIT = 'users/updateUserMeta/commit'
export const UPDATE_USER_META_ROLLBACK = 'users/updateUserMeta/rollback'
export const ACCEPT_DISCLAIMER_COMMIT = 'users/acceptDisclaimer/commit'
export const ACCEPT_DISCLAIMER_ROLLBACK = 'users/acceptDisclaimer/rollback'

export function isProgramType(slug: any): slug is ProgramTypes {
  return Object.values(ProgramTypes).includes(slug)
}

export function isUserType(user: any): user is IUser {
  return user !== undefined && typeof user === 'object'
}

export interface ActionWithPayload<T, P> extends Action {
  type: T
  payload: P
  meta?: any
}

export enum ExerciseWeightUnit {
  'lbs' = 'lbs',
  'kg' = 'kg',
}

export enum WeightUnit {
  'lb' = 'lb',
  'kg' = 'kg',
}

export enum HeightUnit {
  'inches' = 'inches',
  'cm' = 'cm',
}

export type Goal = 'LOSE' | 'MAINTAIN' | 'GAIN'

export interface IQuiz {
  level: number
  location: number
  goal: number
  pace: number
  programs: IGetQuizResponseBodyData[]
}

export interface IUserPlan {
  id: number
  user_id: number
  payment_type: string // APPLE_PAYMENT | STRIPE_PAYMENT | GOOGLE_PAYMENT ???
  subscription_id: number
  parent_transaction_id: string
  transaction_id: string
  expire_on: string
  is_active: 0 | 1 | boolean
  canceled: boolean
  with_trial: boolean
  promocode_id: number | null
  created_at: string
  updated_at: string
  has_paid: boolean
  refunded?: boolean
  latest_payment_at: string | null
  promo_code_added_at: string | null
  subscription_title: string
  subscription_price_per_month: number
  subscription_total_price: number
  subscription_total_months: number
}

export type UserEatingPreference = {
  id: number
  key: string // TODO - type this to MealType ie. REGULAR | VEGAN | KETO when meal types get merged
}

export interface IEvent {
  event: string
  date: Date | string
  payload: any
}

export interface IUser {
  id: number
  name: string
  email: string
  password?: string
  old_password?: string
  api_token: string
  instagram_uid: string | null
  facebook_uid: string | null
  date_of_birth: string | Date | null
  eating_preference: string | null
  joining_date: string | Date | null
  profile_picture: string | null
  profile_picture_url: string | null
  profile_picture_thumb_url: string | null
  city: string
  state: string | null
  zip: string | null
  country: string
  height: number
  height_unit: HeightUnit
  weight: number
  weight_unit: WeightUnit
  pregnancy: number
  mpr: number
  age: number
  activeness: number
  level_id: number
  subscription_id: number | null
  goal: Goal
  workout_goal: ProgramTypes | null
  resistance_bands: boolean
  meta: { [key: string]: any }
  verify_code: string
  verify_code_valid_till: string | Date | null
  stripe_customer_id: string | null
  remember_token: string | null
  notification_enable: 0 | 1
  show_tutorial: 0 | 1
  accepted_challenge: 0 | 1
  status: 0 | 1
  current_week_number: number | null
  active_week_number: number
  timezone: string
  week_count_updated_at: string | Date
  terms_and_conditions: string
  privacy_policy: string
  got_welcome_mail: 0 | 1
  newsletter: boolean
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date
  last_activity: string
  exercise_weight_unit: ExerciseWeightUnit
  events: IEvent[]
  notification_settings: string | null
  notification_token: string
  notification_os: string
  notification_meta: string | null
  sent_progress_photo_welcome_mail: string | Date | null
  ambassador_link: string
  ambassador_code: string
  referrer_user_id: number | null
  subscription_promo_name: string | null
  appsflyer_id: string
  device_os: 'android' | 'ios'
  referred_from_trainer: 0 | 1
  recaptcha_score: number | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  sounds_alerts: boolean
  first_login_at: string | Date
  quiz: IQuiz | null
  quiz_results_id: number | null
  locale_identifier: string | null
  irclickid: string | null
  impact_conversion_at: string | Date | null
  eating_preferences: UserEatingPreference[]
  disclaimer_accepts: Record<ProgramTypes, string>
  is_restricted: boolean
  plans: IUserPlan[]
  has_active_plans: boolean
  trial_expires_on: Date | null
  trial_plan_start_date: Date | null
  form_tips_audio: boolean
  tooltips_viewed: Record<string, boolean>
  week_disclaimers_viewed: Record<string, string>
  is_ambassador: boolean
  is_referee: boolean
  has_ever_subscribed: boolean
  has_ever_paid: boolean
  plan_payment_type: string | null
  origin?: string
}

/* ******** Payloads and actions ******** */

export interface IUpdateCurrentWeekPayload {
  week: number
}

export interface ICalculateMacrosPayload {
  id: number
  height_value: number
  height_unit: HeightUnit
  weight_value: number
  weight_unit: WeightUnit
  activeness: number
  goal: number
  age: number
  pregnancy: number
}
