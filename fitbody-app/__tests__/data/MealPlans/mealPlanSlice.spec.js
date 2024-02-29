import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moment from 'moment'
import 'isomorphic-fetch'

import reducer, {
  initialState,
  getRecipes,
  getRecipesRange,
  listMealSets,
  updateMealPlan,
  setMealPlanLoading,
  changeDate,
  changeMealTimeSlot,
  storeItemHistory,
  storeMealPlan,
  storeFavorites,
  storeFilter,
  storeGroceries,
} from '../../../src/data/meal_plan/mealPlanSlice'
import api from '../../../src/services/api'
import { cleanup } from '../../../testUtils'

jest.mock('../../../src/services/api')

const mockStore = configureMockStore([thunk])

const recipeResponsePayload = (withDate) => {
  const payload = {
    data: {
      id: 2831,
      date: '2021-06-06',
      items: [
        {
          id: 472,
          name: 'Breakfast Bowl',
          thumb_img_url: 'https://bodylove-cf.s3-us-west-2.amazonaws.com/recipe/thumb/eTTJwabBEInUHSJ7fXAja23xOES86lD7FfgF9IjI.jpeg',
          tags: ['REGULAR', 'VEGETARIAN', 'PESCATARIAN', 'DAIRY-FREE'],
          meal_time_slots: ['Breakfast'],
          calories: 237.88201752149607,
          fats: 15.75,
          carbs: 9.619999999999997,
          protein: 15.611926530612248,
          is_favorite: false,
          user_generated: true,
          original_recipe_id: 454,
          children_ids: [],
        },
        // etc...
      ],
    },
  }
  if (withDate) {
    payload.date = '2021-06-06'
  }
  return payload
}

const errorResponsePayload = (msg = 'Error') => ({
  response: {
    data: {
      message: msg,
    },
  },
})

const initialStateOverride = (data) => ({
  ...initialState,
  ...data,
})

let store = null
beforeEach(() => {
  store = mockStore(initialState)
})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => {
  cleanup()
})

afterAll(() => {
  jest.unmock('../../../src/services/api')
})

describe('MealPlan slice', () => {
  describe('reducer, actions and selectors', () => {
    it('should return the initial state on first run', () => {
      // Arrange
      const nextState = initialState

      // Act
      const result = reducer(undefined, {})

      // Assert
      expect(result).toEqual(nextState)
    })

    it('should set loading state', () => {
      expect(reducer(initialState, setMealPlanLoading(false))).toEqual({
        ...initialState,
        isLoading: false,
      })
    })

    it('should change date', () => {
      const payload = moment().format('YYYY-MM-DD')
      expect(reducer(initialStateOverride({ day: '1230-12-12', setOn: '1230-12-11' }), changeDate(payload))).toEqual({
        ...initialState,
        day: payload,
        setOn: payload,
      })
    })

    it('should change mealTimeSlot without filters', () => {
      const payload = { mealTimeSlotId: 1 }
      expect(reducer(initialState, changeMealTimeSlot(payload))).toEqual({
        ...initialState,
        mealTimeSlot: payload.mealTimeSlotId,
      })
    })

    it('should change mealTimeSlot to Dinner', () => {
      const payload = { mealTimeSlotId: 3 }
      const state = initialStateOverride({
        filters: {
          recipes: [{ recipeId: 1 }],
          mealTimeSlot: 1,
        },
      })
      expect(reducer(state, changeMealTimeSlot(payload))).toEqual({
        ...initialState,
        mealTimeSlot: payload.mealTimeSlotId,
        filters: {
          ...state.filters,
          recipes: {
            ...state.filters.recipes,
            mealTimes: {
              Breakfast: false,
              Dinner: true,
              Lunch: false,
              Snack: false,
            },
          },
        },
      })
    })

    it('should storeItemHistory properly', () => {
      const item = { item: { id: 1, name: 'name', calories: 1, fats: 1, carbs: 1, protein: 1, base_id: 0, type: 'easy_add_recipe' } }
      expect(reducer(initialStateOverride({ history: [item.item] }), storeItemHistory(item))).toEqual({
        ...initialState,
        history: [item.item],
      })
    })

    it('should store a meal plan properly', () => {
      const mealPlan = {
        date: '2021-12-24',
        data: {
          id: 9,
          date: '2021-12-24',
          items: [{ id: 1, name: 'name', calories: 1, fats: 1, carbs: 1, protein: 1, base_id: 0, type: 'easy_add_recipe' }],
        },
      }
      expect(reducer(initialState, storeMealPlan(mealPlan))).toEqual({
        ...initialState,
        mealPlans: {
          ...initialState.mealPlans,
          2021: {
            ...(initialState.mealPlans?.['2021'] || {}),
            11: {
              ...(initialState.mealPlans?.['2021']?.['11'] || {}),
              24: { data: mealPlan.data },
            },
          },
        },
      })
    })

    it('should storeFavorites properly', () => {
      expect(reducer(initialState, storeFavorites({ data: ['1', '2'] }))).toEqual({
        ...initialState,
        favorites: ['1', '2'],
      })
    })

    it('should storeFilter properly', () => {
      const payload = { recipes: {}, mealPlans: {} }
      expect(reducer(initialState, storeFilter(payload))).toEqual({
        ...initialState,
        filters: {
          ...initialState.filters,
          ...payload,
        },
      })
    })

    it('should storeGroceries properly', () => {
      const payload = { ingredients: [{ name: 'vodka' }], dates: `2097-10-10 - 2098-10-10` }
      expect(reducer(initialState, storeGroceries(payload))).toEqual({
        ...initialState,
        dates: payload.dates,
        selectedGroceries: [],
        groceries: payload.ingredients,
      })
    })
  })

  describe('MealPlan thunks', () => {
    it('getRecipes should get and set recipes', async () => {
      const requestPayload = '2021-06-06'

      // the response from the api
      await api.eating.listMeals.mockResolvedValueOnce(recipeResponsePayload(true))

      const {
        meta: { requestId },
      } = await store.dispatch(getRecipes(requestPayload))

      const expectedActions = [
        getRecipes.pending(requestId, requestPayload),
        getRecipes.fulfilled(recipeResponsePayload(true), requestId, requestPayload),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })

    it('getRecipes should fail to get and set recipes properly', async () => {
      const requestPayload = 'invalidDate'
      // laravel error response from the api

      await api.eating.listMeals.mockRejectedValueOnce(errorResponsePayload('Failed'))

      const {
        meta: { requestId },
      } = await store.dispatch(getRecipes(requestPayload))

      const expectedActions = [
        getRecipes.pending(requestId, requestPayload),
        getRecipes.rejected({ message: 'Rejected' }, requestId, requestPayload, errorResponsePayload('Failed')),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })

    it('getRecipesRange should get and set recipes', async () => {
      const requestPayload = { startDate: '2021-06-06', endDate: '2021-07-07' }

      await api.eating.listMealsRange.mockResolvedValueOnce(recipeResponsePayload(false))

      const {
        meta: { requestId },
      } = await store.dispatch(getRecipesRange(requestPayload))

      const expectedActions = [
        getRecipesRange.pending(requestId, requestPayload),
        getRecipesRange.fulfilled(recipeResponsePayload(false), requestId, requestPayload),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })

    it('getRecipesRange should fail to get and set recipes properly', async () => {
      const requestPayload = { startDate: 'invalid-date', endDate: 'inVaLiDatE' }

      await api.eating.listMealsRange.mockRejectedValueOnce(errorResponsePayload('Failed'))

      const {
        meta: { requestId },
      } = await store.dispatch(getRecipesRange(requestPayload))

      const expectedActions = [
        getRecipesRange.pending(requestId, requestPayload),
        getRecipesRange.rejected({ message: 'Rejected' }, requestId, requestPayload, errorResponsePayload('Failed')),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })

    it('listMealSets get and set meal sets properly', async () => {
      const requestPayload = {
        favoritesOnly: false,
        eatingPreferences: {
          Regular: true,
          Vegan: false,
          Vegetarian: false,
          Pescatarian: false,
          Keto: false,
          'Dairy-Free': false,
          'Gluten-Free': false,
          Mediterranean: false,
        },
      }
      // the response from the api
      const responsePayload = [
        {
          id: 105863,
          name: 'Sweet & Nutritious',
          total_calories: 1963,
          total_fats: 67,
          total_carbs: 199,
          total_protein: 141,
          is_favorite: false,
          eating_preferences: ['REGULAR', 'VEGETARIAN', 'PESCATARIAN'],
        },
        {
          id: 105865,
          name: 'Green & Appetizing',
          total_calories: 1944,
          total_fats: 64,
          total_carbs: 200,
          total_protein: 142,
          is_favorite: false,
          eating_preferences: ['REGULAR', 'VEGETARIAN', 'PESCATARIAN'],
        },
      ]

      await api.eating.listMealSets.mockResolvedValueOnce({ data: responsePayload })

      const {
        meta: { requestId },
      } = await store.dispatch(listMealSets(requestPayload))

      const expectedActions = [
        listMealSets.pending(requestId, requestPayload),
        listMealSets.fulfilled({ mealSets: responsePayload }, requestId, requestPayload),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })

    it('listMeals should fail to get and set mealsets properly', async () => {
      const requestPayload = {}

      await api.eating.listMealSets.mockRejectedValueOnce(errorResponsePayload('Failed'))

      const {
        meta: { requestId },
      } = await store.dispatch(listMealSets(requestPayload))

      const expectedActions = [
        listMealSets.pending(requestId, requestPayload),
        listMealSets.rejected({ message: 'Rejected' }, requestId, requestPayload, errorResponsePayload('Failed')),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('MealPlan helpers', () => {
    it('should update mealSest properly', () => {
      const payload = [
        {
          id: 105863,
          name: 'Sweet & Nutritious',
          total_calories: 1963,
          total_fats: 67,
          total_carbs: 199,
          total_protein: 141,
          is_favorite: false,
          eating_preferences: ['REGULAR', 'VEGETARIAN', 'PESCATARIAN'],
        },
      ]
      const response = updateMealPlan(initialState, '2021-08-10', payload)
      expect(response).toEqual({
        ...initialState,
        mealPlans: {
          2021: {
            7: {
              10: {
                data: payload,
              },
            },
          },
        },
      })
    })
  })
})
