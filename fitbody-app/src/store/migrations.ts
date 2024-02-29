import moment from 'moment'
import { PersistedState } from 'redux-persist/es/types'

import trainerData from '../../assets/trainers.json'
import globals from '../config/globals'
import { ProgramTypes } from '../data/workout/types'

export const resetTrainerExtraction = (state: any) => {
  return {
    ...state,
    data: {
      ...state.data,
      workouts: {
        ...state.data.workouts,
        trainersExtracted: false,
        trainers: trainerData.trainers,
        programs: trainerData.programs,
      },
    },
  }
}

export const wipeMealPlans = (state: any): PersistedState => {
  return {
    ...state,
    data: {
      ...state.data,
      meal: {
        ...(state?.data?.meal ?? {}),
        day: moment().format('YYYY-MM-DD'),
        mealPlans: {},
        favorites: [],
      },
    },
  }
}

export const addDisclaimerAccepts = (state: any): PersistedState => {
  return {
    ...state,
    data: {
      ...state.data,
      user: {
        ...state.data.user,
        disclaimer_accepts: state.data.user.disclaimer_accepts || {},
      },
    },
  }
}

export const forceWorkoutsRefresh = (state: any): PersistedState => {
  return {
    ...state,
    data: {
      ...state.data,
      workouts: {
        ...state.data.workouts,
        trainersExtracted: false,
        trainers: trainerData.trainers,
        programs: trainerData.programs,
      },
    },
  }
}

export const forceCategoriesRefresh = (state: any): PersistedState => {
  return {
    ...state,
    data: {
      ...state.data,
      workouts: {
        ...state.data.workouts,
        categories: {},
      },
    },
  }
}

export const setInitialWorkoutsState = (state: any): PersistedState => {
  return {
    ...state,
    data: {
      ...state.data,
      workouts: {
        initialWeeksDownloaded: false,
        trainersExtracted: false,
        trainers: [
          ...(state.data?.workouts?.trainers ?? []),
          {
            id: 1,
            name: 'Anna Victoria',
            subtitle: 'HIIT, Strength Training, Pregnancy',
            color: globals.styles.colors.colorLove,
            secondary_color: globals.styles.colors.colorPink,
            logo_url: '/assets/trainers/1/fb_anna.svg',
            foreground_img_url: '/assets/trainers/1/anna-foreground.png',
            background_img_url: '/assets/trainers/1/anna-background.png',
            banner_img_url: '/assets/trainers/1/anna_card.png',
            icon_url: '',
            sort_order: 1,
            programs: [1, 3, 2, 9],
          },
        ],
        programs: {
          ...(state.data?.workouts?.programs ?? {}),
          SHRED: {
            id: 1,
            title: 'SHRED',
            subtitle: 'Burn Fat + Lean Down',
            description: 'BODYWEIGHT CIRCUIT TRAINING',
            slug: 'SHRED',
            special_equipment_enabled: true,
            special_equipment_name: 'Resistance Bands',
            background_image_url: '/assets/trainers/1/shred_bg.png',
            background_image_card_url: '/assets/trainers/1/shred_program_bg_card.png',
            icon_url: '/assets/trainers/1/icon_24_px_program_shred.svg',
            logo_big_url: '/assets/trainers/1/icon_logo_program_full_shred_1.svg',
            logo_small_url: '/assets/trainers/1/icon_logo_program_shred.svg',
            color: globals.styles.colors.colorLove,
            color_secondary: globals.styles.colors.colorPink,
            workout_max_week: 0,
            sort_order: 0,
            hide_rounds: false,
            hide_challenges: true,
            all_weeks_available: false,
            at_home: true,
            at_gym: true,
            show_in_workouts_mvp: true,
            week_meta: null,
            video_url: '/assets/trainers/1/anna_pregnancy.mp4',
            session_duration: '30',
            has_disclaimer: false,
            disclaimer_text: null,
            categories: [
              { id: 1, title: 'Strength', image: '/assets/trainers/1/shred-strength.jpg', sort_order: 0 },
              { id: 2, title: 'Core', image: '/assets/trainers/1/shred-core.jpg', sort_order: 1 },
              { id: 3, title: 'Cardio', image: '/assets/trainers/1/shred-cardio.jpg', sort_order: 2 },
            ],
            equipment: [
              { name: 'Platform', icon_url: '/assets/trainers/platform.svg', adds_to_weight: false },
              { name: 'Yoga Mat', icon_url: '/assets/trainers/yoga_mat.svg', adds_to_weight: false },
            ],
          },
          SCULPT: {
            id: 3,
            title: 'SCULPT',
            subtitle: 'Build Muscle + Sculpt Your Body',
            description: 'STRENGTH TRAINING',
            slug: 'SCULPT',
            special_equipment_enabled: true,
            special_equipment_name: 'Resistance Bands',
            background_image_url: '/assets/trainers/1/sculpt_bg.png',
            background_image_card_url: '/assets/trainers/1/sculpt_program_bg_card.png',
            icon_url: '/assets/trainers/1/icon_24_px_program_sculpt.svg',
            logo_big_url: '/assets/trainers/1/icon_logo_program_full_sculpt_1.svg',
            logo_small_url: '/assets/trainers/1/icon_logo_program_sculpt.svg',
            color: globals.styles.colors.colorTopaz,
            color_secondary: globals.styles.colors.colorSkyBlue,
            workout_max_week: 0,
            sort_order: 2,
            hide_rounds: false,
            hide_challenges: false,
            all_weeks_available: false,
            at_home: false,
            at_gym: true,
            show_in_workouts_mvp: true,
            week_meta: null,
            video_url: '/assets/trainers/1/anna_pregnancy.mp4',
            session_duration: '45',
            has_disclaimer: false,
            disclaimer_text: null,
            categories: [
              { id: 7, title: 'Strength', image: '/assets/trainers/1/sculpt-strength.jpg', sort_order: 0 },
              { id: 8, title: 'Core', image: '/assets/trainers/1/sculpt-core.jpg', sort_order: 1 },
              { id: 9, title: 'Cardio', image: '/assets/trainers/1/sculpt-cardio.jpg', sort_order: 2 },
            ],
            equipment: [
              { name: 'Platform', icon_url: '/assets/trainers/platform.svg', adds_to_weight: false },
              { name: 'Dumbbells', icon_url: '/assets/trainers/dumbbells.svg', adds_to_weight: false },
              { name: 'Yoga Mat', icon_url: '/assets/trainers/yoga_mat.svg', adds_to_weight: false },
              { name: 'Barbell', icon_url: '/assets/trainers/barbell.svg', adds_to_weight: false },
            ],
          },
          TONE: {
            id: 2,
            title: 'TONE',
            subtitle: 'Gain Strength + Tone Up',
            description: 'DUMBBELL CIRCUIT TRAINING',
            slug: 'TONE',
            special_equipment_enabled: true,
            special_equipment_name: 'Resistance Bands',
            background_image_url: '/assets/trainers/1/tone_bg.png',
            background_image_card_url: '/assets/trainers/1/tone_program_bg_card.png',
            icon_url: '/assets/trainers/1/icon_24_px_program_tone.svg',
            logo_big_url: '/assets/trainers/1/icon_logo_program_full_tone_1.svg',
            logo_small_url: '/assets/trainers/1/icon_logo_program_tone.svg',
            color: globals.styles.colors.colorPurple,
            color_secondary: globals.styles.colors.colorLavender,
            workout_max_week: 0,
            sort_order: 3,
            hide_rounds: true,
            hide_challenges: false,
            all_weeks_available: false,
            at_home: true,
            at_gym: true,
            show_in_workouts_mvp: true,
            week_meta: null,
            video_url: '/assets/trainers/1/anna_pregnancy.mp4',
            session_duration: '30',
            has_disclaimer: false,
            disclaimer_text: null,
            categories: [
              { id: 4, title: 'Strength', image: '/assets/trainers/1/tone-strength.jpg', sort_order: 0 },
              { id: 5, title: 'Core', image: '/assets/trainers/1/tone-core.jpg', sort_order: 1 },
              { id: 6, title: 'Cardio', image: '/assets/trainers/1/tone-cardio.jpg', sort_order: 2 },
            ],
            equipment: [
              { name: 'Platform', icon_url: '/assets/trainers/platform.svg', adds_to_weight: false },
              { name: 'Dumbbells', icon_url: '/assets/trainers/dumbbells.svg', adds_to_weight: false },
              { name: 'Yoga Mat', icon_url: '/assets/trainers/yoga_mat.svg', adds_to_weight: false },
            ],
          },
        },
      },
    },
  }
}

export const forceChallengesRefresh = (state: any): PersistedState => {
  return {
    ...state,
    data: {
      ...state.data,
      workouts: {
        ...state.data.workouts,
        challengeMonth: {},
      },
    },
  }
}

export const forceChallengeAndCategoriesRefresh = (state: any): PersistedState => {
  return {
    ...state,
    data: {
      ...state.data,
      workouts: {
        ...state.data.workouts,
        challengeMonth: {},
        categories: {},
      },
    },
  }
}

// user events deprecated
export const clearUserEvents = (state: any): PersistedState => {
  return {
    ...state,
    data: {
      ...state.data,
      user: {
        ...state.data.user,
        events: [],
      },
    },
  }
}

export const addMealIngredientsOnly = (state: any): PersistedState => {
  return {
    ...state,
    data: {
      ...state.data,
      meal: {
        ...state.data.meal,
        ingredientsOnly: false,
      },
    },
  }
}

export const resetUserQuiz = (state: any): PersistedState => {
  if (!state.data.user?.quiz) {
    return state
  }
  const newQuizStructure =
    state.data.user.quiz.programs?.map((programSlug: ProgramTypes, idx: number) => {
      return {
        type: 'program',
        slug: programSlug,
        sort_order: idx + 1,
      }
    }) ?? []

  return {
    ...state,
    data: {
      ...state.data,
      user: {
        ...(state.data.user || {}),
        quiz: {
          ...(state.data.user?.quiz || {}),
          programs: newQuizStructure,
        },
      },
    },
  }
}
