import _ from 'lodash'

import { apiAuth, apiPublic } from './api'
import { withTransaction } from '../helpers'
import { storeRegistry } from '../../store/storeRegistry'

import { ICalculateMacrosPayload, IEvent, IUser } from '../../data/user/types'
import { IActivity, IJournal, IMood } from '../../data/journal/types'
import { INotification, INotificationSetting, IUpdateNotificationSettingPayload } from '../../data/notification/types'
import { IDownloadLinks, IFetchMediaResponse } from '../../data/media/types'
import { ProgressPhotoDays, ISendProgessPhotosPayload } from '../../data/progress_photos/types'
import {
  IAddEasyAddToDiaryPayload,
  IAddEasyAddToDiaryResponse,
  IAddEasyAddToFavoritesResponse,
  IAddMealSetToFavoritesResponse,
  IAddRecipeToDiaryPayload,
  IAddRecipeToDiaryResponse,
  IAddRecipeToFavoritesResponse,
  ICopyDiaryItemsPayload,
  ICopyDiaryItemsResponse,
  ICreateEasyAddPayload,
  ICreateEasyAddResponse,
  ICreateUserRecipePayload,
  ICreateUserRecipeResponse,
  IDeleteDiaryItemPayload,
  IDeleteDiaryItemsResponse,
  IEasyAdd,
  IEasyAddDetailsResponse,
  IEasyAddSearchResponse,
  IIndividualRecipeDetails,
  IIngredientDetailsResponse,
  IIngredientsSearchResponse,
  IListFavoritesResponse,
  IListMealsResponse,
  IListRecipesResponse,
  IMealPlan,
  IMealPlanType,
  IMealSetDetailsNewResponse,
  IRecipeDetailsResponse,
  IRemoveEasyAddFromFavoritesResponse,
  IRemoveMealSetFromFavoritesResponse,
  IRemoveRecipeFromFavoritesResponse,
  IStoreIngredientPayload,
  IStoreIngredientResponse,
  IStoreMealSetPayload,
  IStoreMealSetResponse,
  IUpdateDiaryIngredientResponse,
  IUpdateEasyAddResponse,
  IUpdateUserRecipePayload,
  IUpdateUserRecipeResponse,
} from '../../data/meal_plan/types'
import {
  IChallengeMonth,
  ICompletion,
  IClearCheckmarksPayload,
  ITrainerWithPrograms,
  IWorkoutWeekResponse,
  IHideCompletionPayload,
  IWorkoutLog,
  IGetWeekPayload,
  IGetWeekResponse,
  IQuizQuestion,
  IGetQuizResponsePayload,
  IGetQuizResponseBody,
} from '../../data/workout/types'
import { GoogleSubscriptionCheckPayload } from '../session/types'

const EATING_PREF_DATE = '2021-06-20'

interface ISignInProps {
  email: string
  password: string
  timezone: string
  trial: boolean
}
interface ISignUpProps extends ISignInProps {
  name: string
  newsletter: boolean
}

interface ITermsResponseProps {
  terms: {
    content: string
    version: number
    updated_at: string
  }
}

interface IPolicyResponseProps {
  policy: {
    content: string
    version: number
    updated_at: string
  }
}

const SHOW_HIDDEN_PROGRAMS: 0 | 1 = 0
const SHOW_HIDDEN_QUIZ_RESULTS: 0 | 1 = 0

export default {
  // Public legal APIs
  legal: {
    terms: () => apiPublic<ITermsResponseProps>('/v3/terms-and-conditions'),
    privacy: () => apiPublic<IPolicyResponseProps>('/v3/privacy-policy'),
  },
  // User email and auth routes
  users: {
    checkEmail: (data: string) => apiPublic('/v3/user/availability-check', 'post', { email: data }),
    forgotPassword: (data: string) => apiPublic('/v3/user/forgot-password', 'post', { email: data }),
    signInWithEmail: (data: ISignInProps): Promise<{ user: IUser; active_plan: boolean }> =>
      withTransaction(apiPublic('/v3/user/sign-in-email', 'post', data), { name: 'users.signInWithEmail' }),
    signUpWithEmail: (data: ISignUpProps): Promise<{ user: IUser }> =>
      withTransaction(apiPublic<{ data: IUser }>('/v3/user/sign-up-email', 'post', data), { name: 'users.signUpWithEmail' }),
    signInUpWithFacebook: (data: any) => apiPublic('/v3/user/facebook', 'post', data), // DEPRECATED
    signInUpWithInstagram: (data: any) => apiPublic('/v3/user/instagram', 'post', data), // DEPRECATED
    joinAmbassador: () => apiPublic<{ user: IUser }>('/v4/ambassador', 'post', null, false),
    getRecommendedProductsLink: () => apiPublic<{ data: { url: string } }>('/v4/recommendations', 'get', null, false),
    getCurrentUserObject: () => apiPublic<{ user: IUser }>('/v4/me', 'get', null, false),
    getInstagramUserData: (token: string) => fetch(`https://api.instagram.com/v1/users/self/?access_token=${token}`),
    // Authenticated routes
    updateUserProfile: (data: Partial<IUser>): Promise<{ user: IUser }> =>
      withTransaction(apiAuth(`/v3/user/update/${data.id}?ep_before=${EATING_PREF_DATE}`, 'post', data, false), {
        name: 'users.updateUserProfile',
      }),
    updateUserMeta: (data: any) => {
      // DEPRECATED
      if (data.keys[2] === 'current_week') {
        const programList = _.get(storeRegistry.getState(), 'data.user.meta.programs', false)
        let goal = _.get(storeRegistry.getState(), 'data.user.workout_goal', false)
        if (!programList || !goal) {
          // a brand new user doesn't have a goal set by default and we cant fail this request
          // return Promise.reject({})
        } else {
          // if (!goal) {
          //   goal = data.keys[1]
          // }
          const currentProgram = programList[goal]
          if (
            currentProgram &&
            currentProgram.current_week &&
            currentProgram.active_week &&
            currentProgram.current_week > currentProgram.active_week
          ) {
            // let's don't and say we did (for meal plans)
            let out = {
              user: _.cloneDeep(storeRegistry.getState().data.user),
            }
            if (out.user?.meta) {
              out.user.meta.programs[goal].current_week = data.value
            }
            return Promise.resolve(out)
          }
        }
      }
      return apiAuth(`/v3/user/update/${data.id}/meta`, 'patch', data, false)
    },
    getEvents: () => apiAuth<{ events: IEvent[] }>('/v3/user/events', 'get', null, false),
    reportEvent: (data: { name: string; meta: any }) => apiAuth('/v4/events', 'post', data, false),
    requestAccountDelete: () => apiAuth<{ sent: boolean; message: string }>('/v4/me/account-deletion', 'post', null, false),
  },
  // Pull the Guidance videos
  guidance: {
    getAll: () => apiAuth('/v3/guidance'), // DEPRECATED
    getAllv4: () => apiAuth<IFetchMediaResponse>(`/v4/videos?with_hidden=${SHOW_HIDDEN_PROGRAMS}`),
  },
  // Macro Calculator
  calculator() {
    return {
      get: (data: any) => apiAuth(`/v4/macro-calculator/${data.id}`, 'get'), // DEPRECATED
      calculate: (data: ICalculateMacrosPayload) =>
        apiAuth<{ user: IUser }>(`/v4/macro-calculator/${data.id}?ep_before=${EATING_PREF_DATE}`, 'post', data),
    }
  },
  // Pull Meal plan and save grocery lists
  eating: {
    getMealPlanTypes: () => apiAuth<IMealPlanType[]>(`/v3/recipes/eating-preferences?ep_before=${EATING_PREF_DATE}`, 'get'),
    // DEPRECATED
    getRecipes: (data: any) => apiAuth(`/v3/recipes?ep_before=${EATING_PREF_DATE}`, 'post', data),
    searchRecipes: (qs: string, data: string) =>
      apiAuth<IListRecipesResponse>(`/v4/recipes?query=${data}&${qs}&ep_before=${EATING_PREF_DATE}`, 'get', null, false),
    listRecipes: (qs: string) => apiAuth<IListRecipesResponse>(`/v4/recipes?${qs}&ep_before=${EATING_PREF_DATE}`, 'get', null, false),
    // DEPRECATED
    getGroceries: (data: { current_week_number: number }) => apiAuth(`/v3/groceries/${data.current_week_number}`, 'get'),
    // DEPRECATED
    saveGroceries: (data: any) => apiAuth(`/v3/groceries/${data.current_week_number}/save`, 'post', data),
    listMealSets: (queryString: string) =>
      apiAuth<{ data: IMealPlan[] }>(`/v4/meal-sets?includes=recipes&${queryString}&ep_before=${EATING_PREF_DATE}`, 'get', null, true),
    listMeals: (date: string) =>
      apiAuth<{ data: IListMealsResponse }>(`/v4/diaries/${date}?ep_before=${EATING_PREF_DATE}`, 'get', null, false),
    listMealsRange: (dateStart: string, dateEnd?: string) => {
      const date = dateEnd ? `${dateStart}/${dateEnd}` : dateStart
      return apiAuth<{ data: IListMealsResponse[] }>(`/v4/diaries/range/${date}?ep_before=${EATING_PREF_DATE}`, 'get', null, false)
    },
    deleteMealSet: (date: string) => apiAuth<{ message: string }>(`/v3/meals?date=${date}`, 'delete', null, true),
    // DEPRECATED
    deleteIngredient: ({ date, ingredient }: { date: string; ingredient: string }) =>
      apiAuth(`/v3/meals/ingredients/${ingredient}?date=${date}`, 'delete', null, true),
    // DEPRECATED
    ingredientHistory: (data: { query: string }) => apiAuth(`/v3/ingredients/history?query=${data.query}`, 'get', null, false),
    ingredientSearch: (data: { query: string }) =>
      apiAuth<IIngredientsSearchResponse>(`/v3/ingredients/search?query=${data.query}`, 'get', null, true),
    ingredientDetails: (data: { id: string }) =>
      apiAuth<IIngredientDetailsResponse>(`/v3/ingredients/${encodeURIComponent(data.id)}`, 'get', null, true),
    recipeDetails: (data: { mealplan: number; recipe: string }) =>
      apiAuth<IRecipeDetailsResponse>(`/v3/meal-sets/${data.mealplan}/recipes/${data.recipe}`, 'get', null, true),
    individualRecipeDetails: (data: { recipe: number }, showLoader = true) =>
      apiAuth<{ data: IIndividualRecipeDetails }>(
        `/v4/recipes/${data.recipe}?includes=ingredients,easy_add_recipes,tools,steps&ep_before=${EATING_PREF_DATE}`,
        'get',
        null,
        showLoader,
      ),
    individualRecipeDetailsV3: (data: { recipe: string }) =>
      apiAuth<IRecipeDetailsResponse>(`/v3/recipes/${data.recipe}`, 'get', null, true),
    // DEPRECATED
    mealSetDetails: (data: { mealplan: string }) => apiAuth(`/v3/meal-sets/${data.mealplan}`, 'get', null, true),
    mealSetDetailsNew: (data: { mealplan: string }) =>
      apiAuth<{ data: IMealSetDetailsNewResponse }>(`/v4/meal-sets/${data.mealplan}?includes=recipes`, 'get', null, true),
    storeMealSet: (mealSetData: IStoreMealSetPayload, showLoader: boolean = true) =>
      apiAuth<{ data: IStoreMealSetResponse }>('/v4/diaries/meal-sets', 'post', mealSetData, showLoader),
    storeIngredient: (ingredientData: { ingredient: IStoreIngredientPayload }) =>
      apiAuth<{ data: IStoreIngredientResponse }>('/v4/diaries/ingredients', 'post', ingredientData.ingredient, true),
    createEasyAdd: (data: ICreateEasyAddPayload) => apiAuth<{ data: ICreateEasyAddResponse }>('/v4/easy-add-recipes', 'post', data, true),
    updateEasyAdd: (id: number, data: IEasyAdd) =>
      apiAuth<{ data: IUpdateEasyAddResponse }>(`/v4/easy-add-recipes/${id}`, 'put', data, true),
    easyAddDetails: (id: number) => apiAuth<{ data: IEasyAddDetailsResponse }>(`/v4/easy-add-recipes/${id}`, 'get', null, true),
    searchEasyAdds: (data: { query: string }) =>
      apiAuth<{ data: IEasyAddSearchResponse[] }>(`/v4/easy-add-recipes?query=${data.query}`, 'get', null, true),
    addEasyAddToDiary: (data: IAddEasyAddToDiaryPayload) =>
      apiAuth<{ data: IAddEasyAddToDiaryResponse }>('/v4/diaries/easy-add-recipes', 'post', data, true),
    addRecipeToDiary: (data: IAddRecipeToDiaryPayload, showLoader: boolean = true) =>
      apiAuth<{ data: IAddRecipeToDiaryResponse }>('/v4/diaries/recipes', 'post', data, showLoader),
    addRecipeToFavorites: (data: { id: number }) =>
      apiAuth<IAddRecipeToFavoritesResponse>(`/v4/favorites/recipes/${data.id}`, 'post', null, false),
    addEasyAddToFavorites: (data: { id: number }) =>
      apiAuth<IAddEasyAddToFavoritesResponse>(`/v4/favorites/easy-add-recipes/${data.id}`, 'post', null, false),
    removeRecipeFromFavorites: (data: { id: number }) =>
      apiAuth<IRemoveRecipeFromFavoritesResponse>(`/v4/favorites/recipes/${data.id}`, 'delete', null, false),
    removeEasyAddFromFavorites: (data: { id: number }) =>
      apiAuth<IRemoveEasyAddFromFavoritesResponse>(`/v4/favorites/easy-add-recipes/${data.id}`, 'delete', null, false),
    addMealSetToFavorites: (data: { id: number }) =>
      apiAuth<IAddMealSetToFavoritesResponse>(`/v4/favorites/meal-sets/${data.id}`, 'post', null, false),
    removeMealSetFromFavorites: (data: { id: number }) =>
      apiAuth<IRemoveMealSetFromFavoritesResponse>(`/v4/favorites/meal-sets/${data.id}`, 'delete', null, false),
    listFavorites: () => apiAuth<IListFavoritesResponse>('/v4/favorites', 'get', null, true),
    deleteDiaryItems: (data: IDeleteDiaryItemPayload) =>
      apiAuth<IDeleteDiaryItemsResponse>(`/v4/diaries/${data.date}`, 'put', { items: data.items }, true),
    copyDiaryItems: (data: ICopyDiaryItemsPayload) => apiAuth<ICopyDiaryItemsResponse>('/v4/diary-items/copy', 'post', data, true),
    updateDiaryIngredient: (date: string, data: Partial<IIngredientDetailsResponse>) =>
      apiAuth<IUpdateDiaryIngredientResponse>(`/v4/diaries/${date}`, 'patch', data, true),
    createUserRecipe: (data: ICreateUserRecipePayload) => apiAuth<ICreateUserRecipeResponse>('/v4/me/recipes', 'post', data, true),
    updateUserRecipe: (data: IUpdateUserRecipePayload) =>
      apiAuth<IUpdateUserRecipeResponse>(`/v4/me/recipes/${data.id}`, 'put', data.recipe, true),
  },
  // Submit to the Contact Us form
  contactUs() {
    return {
      send: (data: any) => apiAuth('/v3/contact-us', 'post', data), // DEPRECATED
    }
  },
  // Workouts
  workouts: {
    getWeek: (data: IGetWeekPayload) => apiAuth<{ week: IGetWeekResponse }>('/v3/workouts/week/simple', 'post', data, false),
    // Deprecated
    getDayDetails: (data: any) => apiAuth('/v3/workouts/details/simple', 'post', data, false),
    // Deprecated
    saveCircuits: (data: any) => apiAuth('/v3/workouts/save', 'post', data),
    // Deprecated
    getWorkoutPerformance: (data: any) => apiAuth('/v3/workouts/performance', 'post', data),
    // Deprecated
    getHistory: (data: any) => apiAuth('/v3/calendar', 'post', data, false),
    getPrograms: () => apiAuth('/v4/workouts/programs', 'get', null, true),
    // @DEV with_hidden will return hidden weeks, needs to match with getWorkoutWeek
    getTrainers: () =>
      apiAuth<{ data: ITrainerWithPrograms[] }>(
        `/v4/trainers?include_approval_required=1&show_hidden=${SHOW_HIDDEN_PROGRAMS}&with_hidden=${SHOW_HIDDEN_PROGRAMS}`,
        'get',
        null,
        false,
      ),
    // @DEV with_hidden will return hidden weeks, needs to match with getTrainers
    getWorkoutWeek: (data: { program: number; week: number }, loader = false) =>
      apiAuth<{ data: IWorkoutWeekResponse }>(
        `/v4/workouts/week?program=${data.program}&week=${data.week}&legacy=0&with_hidden=${SHOW_HIDDEN_PROGRAMS}`,
        'get',
        null,
        loader,
      ),
    getCompletions: () => apiAuth<{ data: ICompletion[] }>('/v4/workouts/logs?with_videos=1', 'get', null, false),
    // createCompletion Deprecated in favor of offline action
    createCompletion: (data: any) => apiAuth<{ data: any }>('/v4/workouts/log', 'post', data, false),
    hideCompletion: (data: IHideCompletionPayload) => apiAuth<IWorkoutLog>(`/v4/workouts/log/${data.id}`, 'patch', { hidden: true }, false),
    clearCompletions: (data: IClearCheckmarksPayload) => apiAuth<ICompletion[]>('/v4/workouts/logs', 'patch', data, false),
    acceptProgram: (data: { id: string }) => apiAuth(`/v4/programs/${data.id}/accept`, 'post', {}, false),
    getQuizQuestions: () =>
      apiAuth<{ data: IQuizQuestion }>(`/v5/quiz/questions?with_hidden=${SHOW_HIDDEN_QUIZ_RESULTS}`, 'get', null, false),
    getQuizResponse: (data: IGetQuizResponsePayload) =>
      apiAuth<IGetQuizResponseBody>(
        `/v5/quiz/recommendations?level=${data.level}&location=${data.location}&goal=${data.goal}&pace=${data.pace}&with_hidden=${SHOW_HIDDEN_QUIZ_RESULTS}`,
        'get',
        null,
        false,
      ),
  },
  downloads: {
    requestDownload: (data: { entries: IDownloadLinks[] }) =>
      apiAuth<{ id: string; url: string }>('/v4/workouts/download', 'post', data, false),
    // Only used to manually download assets via postman or something
    download: (data: any) => apiAuth(`/v4/workouts/download/${data}`, 'get', data, false),
  },
  // Challenges
  challenges: {
    // Deprecated
    getNew: (date: string) => apiAuth(`/v4/challenges/${date}`, 'get', null, true),
    // Deprecated
    get: (data: { query: string }) => apiAuth(`/v3/challenge/simple${data.query}`, 'get', null, false),
    getMonth: (data: string) => apiAuth<{ data: IChallengeMonth }>(`/v4/challenges/month/${data}`, 'get', null, false),
    // Deprecated
    accept: (data: any) => apiAuth(`/v3/challenge/${data.challenge_id}/accept`, 'put', data),
    // Deprecated
    complete: (data: any) => apiAuth(`/v3/challenge/${data.challenge_id}/mark-completed`, 'post', data),
  },
  // Notifications
  notifications: {
    getNotifications: () => apiAuth<{ notifications: INotification[] }>('/v3/notifications', 'get', null, false),
    markAsRead: (data: any) => apiAuth(`/v3/notifications/${data.id}/read`, 'get'), // DEPRECATED
    deleteNotification: (data: Partial<INotification>) =>
      apiAuth<{ notifications: INotification[]; message: string }>(`/v3/notifications/${data.id}/delete`, 'get'),
    clearNotification: () => apiAuth<{ notifications: INotification[] }>('/v3/notifications/delete-all', 'get'),
    markAllRead: () => apiAuth<{ notifications: INotification[] }>('/v3/notifications/read-all', 'get'),
    settings: () => apiAuth<{ notificationTypes: INotificationSetting[] }>('/v3/notifications/types', 'get'),
    saveSettings: (data: { settings: IUpdateNotificationSettingPayload }) => apiAuth('/v3/notifications/settings', 'patch', data),
  },
  // Rounds
  rounds() {
    return {
      getRounds: () => apiAuth('/v3/rounds', 'get', null, false),
    }
  },
  // Progress Photos
  progress_photos: {
    getPhotos: (week_id?: string) => {
      let qs = ''
      if (week_id) {
        qs = '?week_id=' + week_id
      }
      return apiAuth<{ photos: ProgressPhotoDays }>('/v3/progress-photos' + qs, 'get', null, false)
    },
    saveRoundPhoto: (data: any) => apiAuth('/v3/progress-photos/round-select', 'post', data), // DEPRECATED
    savePhotos: (data: ISendProgessPhotosPayload) => apiAuth('/v3/progress-photos/store', 'post', data, false),
    getDeleteProgressPhoto: (photoId: string) => apiAuth(`/v3/progress-photos/delete/${photoId}`, 'get'),
  },
  // Subscriptions
  subscriptions: {
    getSubscriptions: () => apiPublic('/v3/subscriptions'),
    appleSubscriptionCheck: (data: { receipt: string }) => apiAuth<{ is_active: boolean }>('/v3/subscriptions/verify-apple', 'post', data),
    googleSubscriptionCheck: (data: GoogleSubscriptionCheckPayload) =>
      apiAuth<{ is_active: boolean }>('/v3/subscriptions/verify-google', 'post', data),
  },
  // Subscriptions
  journals: {
    getMoods: () => apiPublic<IMood[]>('/v3/moods', 'get', null, false),
    getActivities: () => apiPublic<IActivity[]>('/v3/journal-activities', 'get', null, false),
    createJournal: (data: Partial<IJournal>) => apiAuth<IJournal>('/v3/journals', 'post', data),
    updateJournal: (id: string, data: Partial<IJournal>) => apiAuth<IJournal>(`/v3/journals/${id}`, 'patch', data),
    getJournals: (start_date: string, end_date: string) =>
      apiAuth<IJournal[]>(`/v3/journals?start_date=${start_date}&end_date=${end_date}`, 'get', null, false),
  },
}
