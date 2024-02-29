import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

import api from '../../services/api'
import { isAppErrorResponse } from '../../services/api/api'
import { setErrorMessage } from '../../services/error'

import {
  GET_RECIPES,
  GET_RECIPES_RANGE,
  IGetRecipesRangePayload,
  IListMealSetsPayload,
  IMealPlanState,
  LIST_MEAL_SETS,
  IMealPlanDay,
  IStoreMealPlanPayload,
  IStoreFavoritesPayload,
  IStoreItemHistoryPayload,
  RecipeType,
  IMealFilter,
  IStoreGroceriesPayload,
  GroceryIngredient,
  IEasyAddRecipeIngredient,
  IBaseIngredient,
  IIndividualRecipeDetails,
  ADD_MEALSET_TO_FAVORITES,
  REMOVE_MEALSET_FROM_FAVORITES,
} from './types'

// @DEV deprecated v3 endpoint
// export const getRecipesForTheDay = createAsyncThunk(GET_RECIPES_FOR_DAY, async (payload, thunkAPI) => {
//   const { day } = payload
//   try {
//     const data = await api.eating.getRecipes(day)
//     thunkAPI.dispatch(mealPlanSlice.actions.getRecipesForTheDayComplete(data))
//   } catch (error) {
//     setErrorMessage({ error: error.response.data.message })
//   }
// })

export const getRecipes = createAsyncThunk(GET_RECIPES, async (date: string, { rejectWithValue }) => {
  try {
    const { data } = await api.eating.listMeals(date)
    return { date, data }
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return rejectWithValue(error)
  }
})

export const getRecipesRange = createAsyncThunk(GET_RECIPES_RANGE, async (dates: IGetRecipesRangePayload, { rejectWithValue }) => {
  try {
    const { data } = await api.eating.listMealsRange(dates.startDate, dates.endDate)
    return { data }
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return rejectWithValue(error)
  }
})

export const listMealSets = createAsyncThunk(LIST_MEAL_SETS, async (filter: IListMealSetsPayload, { rejectWithValue }) => {
  try {
    const prefs = filter?.eatingPreferences ?? null
    let queryString = `favorites=${filter.favoritesOnly}`
    if (prefs) {
      queryString += `&eating_preferences=${Object.keys(prefs)
        .filter((x) => prefs[x as keyof typeof prefs] === true)
        .join(',')}`
    }
    const { data } = await api.eating.listMealSets(queryString)
    return { mealSets: data }
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return rejectWithValue(error)
  }
})

export const addMealsetToFavorites = createAsyncThunk(ADD_MEALSET_TO_FAVORITES, async (id: number, { rejectWithValue }) => {
  try {
    const response = await api.eating.addMealSetToFavorites({ id })
    return { favorites: response.data }
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return rejectWithValue(error)
  }
})

export const removeMealsetFromFavorites = createAsyncThunk(REMOVE_MEALSET_FROM_FAVORITES, async (id: number, { rejectWithValue }) => {
  try {
    const response = await api.eating.removeMealSetFromFavorites({ id })
    return { favorites: response.data }
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return rejectWithValue(error)
  }
})

// @DEV consumed by getRecipes and getRecipesRange fulfilled
export const updateMealPlan = (state: IMealPlanState, date: Date | string, data: IMealPlanDay) => {
  const dateArray = moment(date).toArray()
  const year = dateArray[0].toString()
  const month = dateArray[1].toString() // zero indexed
  const day = dateArray[2].toString()

  return {
    ...state,
    mealPlans: {
      ...state.mealPlans,
      [year]: {
        ...(state.mealPlans?.[year] || {}),
        [month]: {
          ...(state.mealPlans?.[year]?.[month] || {}),
          [day]: { data },
        },
      },
    },
  }
}

// Recipes and ingredients are such a mess. Good luck with this.
export const initialState: IMealPlanState = {
  day: moment().format('YYYY-MM-DD'),
  mealTimeSlot: 1,
  mealSets: [],
  mealPlans: {},
  mealPlansv4: {},
  groceries: [],
  selectedGroceries: [],
  dates: '',
  favorites: [],
  history: [],
  initialDataLoaded: false,
  persistedScreenState: {},
  isLoading: false,
  currentRecipe: null,
  setOn: null,
  filters: null,
  ingredientsOnly: false,
}

const mealPlanSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {
    setMealPlanLoading: (state, action) => {
      state.isLoading = action.payload
    },
    changeDate: (state, action: PayloadAction<string | Date>) => {
      return { ...state, day: action.payload, setOn: moment().format('YYYY-MM-DD') }
    },
    changeMealTimeSlot: (state, action: PayloadAction<{ mealTimeSlotId: number }>) => {
      const { mealTimeSlotId } = action.payload
      const mealTimes = {
        Breakfast: mealTimeSlotId === 1,
        Lunch: mealTimeSlotId === 2,
        Dinner: mealTimeSlotId === 3,
        Snack: [4, 5, 6].includes(mealTimeSlotId),
      }

      const newState = state.filters
        ? {
            ...state,
            mealTimeSlot: mealTimeSlotId,
            filters: {
              ...state.filters,
              recipes: {
                ...state.filters?.recipes,
                mealTimes,
              },
            },
          }
        : {
            ...state,
            mealTimeSlot: mealTimeSlotId,
          }
      return newState
    },
    storeMealPlan: (state, action: PayloadAction<IStoreMealPlanPayload>) => {
      const { date, data } = action.payload
      if (data) {
        return updateMealPlan(state, date, data)
      }
      return state
    },
    storeFavorites: (state, action: PayloadAction<IStoreFavoritesPayload>) => {
      state.favorites = action.payload.data
    },
    storeItemHistory: (state, action: PayloadAction<IStoreItemHistoryPayload>) => {
      const { item } = action.payload
      return {
        ...state,
        history: [
          item,
          ...(state.history || []).filter(
            (x) =>
              x !== null &&
              !(
                x.type === item.type &&
                (x.name?.toLowerCase() === item.name?.toLowerCase() || (item.type === RecipeType.recipe && x.name === item.name))
              ),
          ),
        ],
      }
    },
    storeFilter: (state, action: PayloadAction<IMealFilter>) => {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      }
    },
    storeGroceries: (state, action: PayloadAction<IStoreGroceriesPayload>) => {
      const { ingredients, dates } = action.payload
      return {
        ...state,
        groceries: ingredients,
        selectedGroceries: [],
        dates: dates,
      }
    },
    storeSelectedGroceries: (state, action: PayloadAction<GroceryIngredient[]>) => {
      state.selectedGroceries = action.payload
    },
    deleteGrocery: (state, action: PayloadAction<{ id: number }>) => {
      const { id } = action.payload
      return {
        ...state,
        groceries: state.groceries.filter((g) => g.id !== id),
        selectedGroceries: state.selectedGroceries.filter((g) => g.id !== id),
      }
    },
    editRecipe: (state, action: PayloadAction<{ recipe: IIndividualRecipeDetails }>) => {
      const { recipe } = action.payload
      return {
        ...state,
        currentRecipe: {
          ...recipe,
          original_calories: recipe.calories,
          original_fats: recipe.fats,
          original_carbs: recipe.carbs,
          original_protein: recipe.protein,
        },
      }
    },
    removeIngredient: (state, action) => {
      const { id } = action.payload
      // attempt to find ingredient from user added ingredients
      // otherwise find ingredient from recipe base ingredients
      if (!state.currentRecipe) {
        return state
      }
      if (state.currentRecipe.type === RecipeType.recipe) {
        state.currentRecipe
      }
      let ingredient: IEasyAddRecipeIngredient | IBaseIngredient | undefined
      ingredient = state.currentRecipe?.easy_add_recipes?.find((x: IEasyAddRecipeIngredient) => x.id === id)
      if (!ingredient) {
        ingredient = state.currentRecipe?.ingredients?.find((x: IBaseIngredient) => x.base_ingredient_id === id)
      }

      if (ingredient && state.currentRecipe) {
        return {
          ...state,
          currentRecipe: {
            ...state.currentRecipe,
            calories: state.currentRecipe.calories! - ingredient.calories,
            fats: state.currentRecipe.fats! - ingredient.fats,
            carbs: state.currentRecipe.carbs! - ingredient.carbs,
            protein: state.currentRecipe.protein! - ingredient.protein,
            easy_add_recipes: [...(state.currentRecipe?.easy_add_recipes?.filter((x: IEasyAddRecipeIngredient) => x.id !== id) || [])],
            ingredients: [...(state.currentRecipe?.ingredients?.filter((x: IBaseIngredient) => x.base_ingredient_id !== id) || [])],
            isDirty: true,
          },
        }
      }
      return state
    },
    updateIngredient: (state, action: PayloadAction<{ ingredient: IBaseIngredient }>) => {
      const { ingredient } = action.payload
      const index = state.currentRecipe?.ingredients?.findIndex((x: any) => x.base_ingredient_id === ingredient.base_ingredient_id)
      const oldIngredient = state.currentRecipe?.ingredients?.find((x: any) => x.base_ingredient_id === ingredient.base_ingredient_id)
      if (state.currentRecipe && oldIngredient && index && index > -1) {
        return {
          ...state,
          currentRecipe: {
            ...state.currentRecipe,
            calories: state.currentRecipe.calories! - oldIngredient.calories + ingredient.calories,
            fats: state.currentRecipe.fats! - oldIngredient.fats + ingredient.fats,
            carbs: state.currentRecipe.carbs! - oldIngredient.carbs + ingredient.carbs,
            protein: state.currentRecipe.protein! - oldIngredient.protein + ingredient.protein,
            ingredients: [
              ...(state.currentRecipe?.ingredients?.slice(0, index) || []),
              { ...state.currentRecipe?.ingredients?.[index], ...ingredient },
              ...(state.currentRecipe?.ingredients?.slice(index + 1) || []),
            ],
            isDirty: true,
          },
        }
      }
      return state
    },
    addIngredient: (state, action: PayloadAction<{ ingredient: IBaseIngredient }>) => {
      const { ingredient } = action.payload
      if (state.currentRecipe) {
        return {
          ...state,
          currentRecipe: {
            ...state.currentRecipe,
            calories: state.currentRecipe.calories! + ingredient.calories,
            fats: state.currentRecipe.fats! + ingredient.fats,
            carbs: state.currentRecipe.carbs! + ingredient.carbs,
            protein: state.currentRecipe.protein! + ingredient.protein,
            ingredients: [...(state.currentRecipe?.ingredients ?? []), ingredient],
            isDirty: true,
          },
        }
      }
      return state
    },
    addEasyAddIngredient: (state, action: PayloadAction<{ ingredient: IEasyAddRecipeIngredient }>) => {
      const { ingredient } = action.payload
      if (state.currentRecipe) {
        return {
          ...state,
          currentRecipe: {
            ...state.currentRecipe,
            calories: state.currentRecipe.calories! + ingredient.calories,
            fats: state.currentRecipe.fats! + ingredient.fats,
            carbs: state.currentRecipe.carbs! + ingredient.carbs,
            protein: state.currentRecipe.protein! + ingredient.protein,
            easy_add_recipes: [...(state.currentRecipe.easy_add_recipes || []), ingredient],
            isDirty: true,
          },
        }
      }
      return state
    },
    removeEasyAddIngredient: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload
      const ingredient = state.currentRecipe?.easy_add_recipes?.find((x: IEasyAddRecipeIngredient) => x.id === id)
      if (state.currentRecipe && ingredient) {
        return {
          ...state,
          currentRecipe: {
            ...state.currentRecipe,
            calories: state.currentRecipe.calories! - ingredient.calories,
            fats: state.currentRecipe.fats! - ingredient.fats,
            carbs: state.currentRecipe.carbs! - ingredient.carbs,
            protein: state.currentRecipe.protein! - ingredient.protein,
            easy_add_recipes: [...(state.currentRecipe?.easy_add_recipes?.filter((x: any) => x.id !== id) || [])],
            isDirty: true,
          },
        }
      }
      return state
    },
    persistScreenState: (state, action) => {
      const { screenName } = action.payload
      const newPersistedScreenState = state.persistedScreenState ? state.persistedScreenState[screenName] : {}
      return {
        ...state,
        persistedScreenState: {
          ...state.persistedScreenState,
          [screenName]: {
            ...newPersistedScreenState,
            ...action.payload.state,
          },
        } as Record<string, any>,
      }
    },
    setIngredientsOnly: (state, action: PayloadAction<boolean>) => {
      state.ingredientsOnly = action.payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getRecipes.fulfilled, (state, action) => {
        return updateMealPlan(state, action.payload.date, action.payload.data)
      })
      .addCase(getRecipes.rejected, () => {
        // state.isLoading = false
      })
      .addCase(getRecipesRange.fulfilled, (state, action) => {
        const data = action.payload.data
        if (Array.isArray(data)) {
          data.forEach((day) => {
            return updateMealPlan(state, day.date, day)
          })
        }
      })
      .addCase(getRecipesRange.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(listMealSets.pending, (state) => {
        state.isLoading = true
      })
      .addCase(listMealSets.fulfilled, (state, action) => {
        state.mealSets = action.payload.mealSets
        state.isLoading = false
      })
      .addCase(listMealSets.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(addMealsetToFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload.favorites
      })
      .addCase(addMealsetToFavorites.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(removeMealsetFromFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload.favorites
      })
      .addCase(removeMealsetFromFavorites.rejected, (state) => {
        state.isLoading = false
      })
  },
})

export const {
  changeDate,
  changeMealTimeSlot,
  storeMealPlan,
  storeFavorites,
  storeItemHistory,
  storeFilter,
  storeGroceries,
  storeSelectedGroceries,
  deleteGrocery,
  editRecipe,
  removeIngredient,
  updateIngredient,
  addIngredient,
  addEasyAddIngredient,
  removeEasyAddIngredient,
  persistScreenState,
  setMealPlanLoading,
  setIngredientsOnly,
} = mealPlanSlice.actions

export default mealPlanSlice.reducer
