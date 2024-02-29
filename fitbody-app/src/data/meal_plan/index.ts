import { store } from '../../store'
import {
  // getRecipesForTheDay,
  getRecipes as gr,
  getRecipesRange as grr,
  listMealSets as lms,
  changeDate as cd,
  changeMealTimeSlot as cmts,
  storeMealPlan as smp,
  storeFavorites as sf,
  storeItemHistory as sih,
  storeFilter as sFil,
  storeGroceries as sg,
  storeSelectedGroceries as ssg,
  deleteGrocery as dg,
  editRecipe as er,
  removeIngredient as ri,
  updateIngredient as ui,
  addIngredient as ai,
  addEasyAddIngredient as aeai,
  persistScreenState as pss,
  removeEasyAddIngredient as reai,
  addMealsetToFavorites as amstf,
  removeMealsetFromFavorites as rmsff,
  setIngredientsOnly as sio,
} from './mealPlanSlice'
import {
  GroceryIngredient,
  IBaseIngredient,
  IEasyAddRecipeIngredient,
  IGetRecipesRangePayload,
  IIndividualRecipeDetails,
  IListMealSetsPayload,
  IMealFilter,
  IStoreFavoritesPayload,
  IStoreGroceriesPayload,
  IStoreItemHistoryPayload,
  IStoreMealPlanPayload,
} from './types'

// export const getRecipesV3 = (data) => {
//   store.dispatch(getRecipesForTheDay(data))
// }

export const getRecipes = (date: string) => {
  store.dispatch(gr(date))
}

export const getRecipesRange = (dates: IGetRecipesRangePayload) => {
  store.dispatch(grr(dates))
}

export const listMealSets = (filter: IListMealSetsPayload) => {
  store.dispatch(lms(filter))
}

export const changeDate = (date: string | Date) => {
  store.dispatch(cd(date))
}

export const changeMealTimeSlot = (data: number) => {
  store.dispatch(cmts({ mealTimeSlotId: data }))
}

export const storeMealPlan = (data: IStoreMealPlanPayload) => {
  store.dispatch(smp(data))
}

export const storeFavorites = (data: IStoreFavoritesPayload) => {
  store.dispatch(sf(data))
}

export const storeItemHistory = (data: IStoreItemHistoryPayload) => {
  store.dispatch(sih(data))
}

export const storeFilter = (data: IMealFilter) => {
  store.dispatch(sFil(data))
}

export const storeGroceries = (data: IStoreGroceriesPayload) => {
  store.dispatch(sg(data))
}

export const storeSelectedGroceries = (data: GroceryIngredient[]) => {
  store.dispatch(ssg(data))
}

export const deleteGrocery = (data: { id: number }) => {
  store.dispatch(dg(data))
}

export const editRecipe = (data: { recipe: IIndividualRecipeDetails }) => {
  store.dispatch(er(data))
}

export const removeIngredient = (data: { id: number }) => {
  store.dispatch(ri(data))
}

export const removeEasyAddIngredient = (data: { id: string }) => {
  store.dispatch(reai(data))
}

export const updateIngredient = (data: { ingredient: IBaseIngredient }) => {
  store.dispatch(ui(data))
}

export const addIngredient = (data: { ingredient: IBaseIngredient }) => {
  store.dispatch(ai(data))
}

export const addEasyAddIngredient = (data: { ingredient: IEasyAddRecipeIngredient }) => {
  store.dispatch(aeai(data))
}

// TODO type this here and in mealPlanSlice
export const persistScreenState = (data: any) => {
  store.dispatch(pss(data))
}

export const addMealsetToFavorites = (id: number) => {
  store.dispatch(amstf(id))
}

export const removeMealsetFromFavorites = (id: number) => {
  store.dispatch(rmsff(id))
}

export const setIngredientsOnly = (val: boolean) => {
  store.dispatch(sio(val))
}
