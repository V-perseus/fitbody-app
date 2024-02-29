import { EatingPreferencesIconMapType } from '../../config/svgs/dynamic/eatingPreferencesMap'

export const GET_RECIPES_FOR_DAY = 'meal/getRecipesForTheDay'
export const GET_RECIPES = 'meal/getRecipes'
export const LIST_MEAL_SETS = 'meal/listMealSets'
export const GET_RECIPES_RANGE = 'meal/getRecipesRange'
export const ADD_MEALSET_TO_FAVORITES = 'meal/addMealSetToFavorites'
export const REMOVE_MEALSET_FROM_FAVORITES = 'meal/removeMealSetFromFavorites'

/* ************** ENUMS ************** */
export enum EatingPreference {
  'REGULAR' = 'REGULAR',
  'VEGETARIAN' = 'VEGETARIAN',
  'VEGAN' = 'VEGAN',
  'DAIRY-FREE' = 'DAIRY-FREE',
  'PESCATARIAN' = 'PESCATARIAN',
  'GLUTEN-FREE' = 'GLUTEN-FREE',
  'GLUTEN-FREE + DIARY-FREE' = 'GLUTEN-FREE + DIARY-FREE',
  'MEDITERRANEAN' = 'MEDITERRANEAN',
  'KETO' = 'KETO',
}
export enum RecipeType {
  'recipe' = 'recipe',
  'easy_add_recipe' = 'easy_add_recipe',
  'ingredient' = 'ingredient',
}
export enum MealTimeSlot {
  'Breakfast' = 'Breakfast',
  'Lunch' = 'Lunch',
  'Dinner' = 'Dinner',
  'Snack' = 'Snack',
  // 'Snack 1' = 'Snack 1',
  // 'Snack 2' = 'Snack 2',
  // 'Snack 3' = 'Snack 3',
}

/* ************** TYPES ************** */

export type AltMeasure = {
  serving_weight: number
  measure: string
  seq: number
  qty: number
}

export type Measure = {
  amount?: number | null
  serving_unit?: string | null
  serving_weight?: number | null
}

export interface IMealPlanType {
  id: number
  name: Capitalize<Lowercase<EatingPreference>>
  key: EatingPreference
  created_at: string
  updated_at: string
  active: boolean
  order: number
  coming_soon: boolean
  is_restrictive: 0 | 1
}

export interface IRecipeStep {
  id: number
  header: string | null
  order: number
  text?: string
  items: {
    id: number
    text: string
  }[]
}

export interface IRecipeTool {
  id: number
  name: string
}

export interface IIndividualRecipeDetails
  extends Omit<Partial<IRecipe>, 'id' | 'name' | 'type' | 'calories' | 'fats' | 'carbs' | 'protein'> {
  id: number | string
  name: string
  type: RecipeType
  calories: number
  fats: number
  carbs: number
  protein: number
  img_url: string
  thumb_img_url: string
  tags: EatingPreference[]
  meal_time_slots: MealTimeSlot[]
  total_time: number
  prep_time: number
  servings: number
  is_favorite: boolean
  user_generated: boolean
  children_ids: number[]
  instructions: string
}

// this represents a recipe created by us or as part of a meal set (not from Nix)
// a FitBody recipe
export interface IBaseRecipe extends Omit<Partial<IRecipe>, 'id' | 'name' | 'type' | 'calories' | 'fats' | 'carbs' | 'protein'> {
  type: RecipeType.recipe
  id: number
  base_id?: number
  base_recipe_id?: number
  name: string
  img_url?: string
  thumb_img_url: string
  tags: EatingPreference[]
  diary_meal_time_slot_id: number
  calories: number
  fats: number
  carbs: number
  protein: number
  user_generated?: boolean
  is_favorite?: boolean
  key?: string
  original_recipe_id?: number
}

export interface IBaseIngredient {
  type: RecipeType.ingredient
  id: number
  base_id?: number
  base_ingredient_id: number
  nix_item_id: string
  is_branded: boolean
  img_url: string
  name: string
  brand_name: string | null
  calories: number
  carbs: number
  protein: number
  fats: number
  quantity: string
  serving_unit: string
  key?: string
  diary_meal_time_slot_id?: number
}

export interface IMealPlanIngredient {
  id: number
  name: string
  brand_name: string | null
  calories: number
  protein: number
  carbs: number
  fats: number
  serving_unit: string | null
  img_url: string | null
  serving_qty: number | null
  cholesterol: number
  dietary_fiber: number
  potassium: number
  saturated_fat: number
  sodium: number
  sugars: number
  serving_weight: number
  alt_measurements: AltMeasure[] | null
  quantity: string
  nix_item_id: string | null
  nix_food_name: string | null
  meal_time_slot: number
  meal_time_slot_id: number
  meal_ingradient_id: number
  key?: string
  diary_meal_time_slot_id?: number
}

// An easy add is an ingredient and recipe
export interface IEasyAddRecipeIngredient {
  type: RecipeType.easy_add_recipe
  id: string
  base_easy_add_recipe_id?: number
  base_id?: number
  name: string
  fats: number
  carbs: number
  protein: number
  calories: number
  is_favorite?: boolean
  diary_meal_time_slot_id?: number
  quantity?: number
  key?: string
  disableRightSwipe?: boolean
}

export interface IEasyAdd {
  id?: number
  name: string
  fats: number
  carbs: number
  protein: number
  calories: number
  is_favorite: boolean
}

export interface ISingleEditIngredient {
  id: number
  calories: number
  carbs: number
  protein: number
  fats: number
  quantity: number
  serving_unit: string
  meal_time_slot_id: number
  base_ingredient_id?: number
}

/* **************** MEAL PLANS their RECIPES and INGREDIENTS ***********************/

export interface IMealPlanRecipe {
  id: number
  name: string
  tags: EatingPreferencesIconMapType[]
  // tags: EatingPreference[]
  thumb_img_url: string
  calories: number
  fats: number
  carbs: number
  protein: number
  meal_time_slots: MealTimeSlot[]
  user_generated?: boolean
  diary_meal_time_slot_id?: number
}

export interface IMealPlan {
  id: number
  name: string
  total_calories: number
  total_fats: number
  total_carbs: number
  total_protein: number
  is_favorite: boolean
  eating_preferences: EatingPreference[]
  recipes: IMealPlanRecipe[]
}

export interface IMealSet {
  id: number
  name: string
  total_calories: number
  total_fats: number
  total_carbs: number
  total_protein: number
  is_favorite: boolean
  eating_preferences: EatingPreference[]
}

export interface IMacro {
  calories: number
  fats: number
  carbs: number
  protein: number
}

export interface IMealPlanItem
  extends Omit<
    Partial<IRecipe>,
    | 'id'
    | 'name'
    | 'type'
    | 'meal_time_slot_id'
    | 'original_calories'
    | 'original_fats'
    | 'original_carbs'
    | 'original_protein'
    | 'calories'
    | 'fats'
    | 'carbs'
    | 'protein'
  > {
  id: number
  name: string
  type: RecipeType
  meal_time_slot_id: number
  original_calories: number
  original_fats: number
  original_carbs: number
  original_protein: number
  calories: number
  fats: number
  carbs: number
  protein: number
}
// part of mealPlans state
export interface IMealPlanDay {
  id: number
  date: Date
  meal_set?: IMealSet
  items: IMealPlanItem[]
}

// TODO this is going to be a problem
// Descriminated union of recipe types based on the type field
export type Recipe = IBaseRecipe | IEasyAddRecipeIngredient | IBaseIngredient //| IIndividualRecipeDetails

export type GroceryIngredient = IBaseIngredient | IEasyAddRecipeIngredient | IMealPlanIngredient

export interface IRecipe {
  base_ingredient_id?: number
  is_branded?: boolean

  base_id?: number
  base_recipe_id?: number
  diary_meal_time_slot_id?: number
  is_favorite?: boolean
  key?: string
  original_recipe_id?: number
  nix_food_name?: string

  base_easy_add_recipe_id?: number
  quantity?: number | string
  disableRightSwipe?: boolean

  id: number | string
  name: string
  type: RecipeType
  original_calories?: number
  original_fats?: number
  original_carbs?: number
  original_protein?: number
  calories: number
  fats: number
  carbs: number
  protein: number
  ingredients?: IBaseIngredient[]
  easy_add_recipes?: IEasyAddRecipeIngredient[]
  user_generated?: boolean
  isDirty?: boolean
  thumb_img_url?: string
  img_url?: string
  steps?: IRecipeStep[]
  meal_time_slots?: MealTimeSlot[]
  tools?: IRecipeTool[]
  instructions?: string
  servings?: number
  prep_time?: number
  total_time?: number
  tags?: EatingPreference[]

  food_name?: string
  nix_item_id?: string | null
  brand_name?: string | null
  serving_qty?: number
  serving_unit?: string
  total_fat?: number
  trans_fat?: number | null
  saturated_fat?: number
  cholesterol?: number
  sodium?: number
  total_carbohydrate?: number
  dietary_fiber?: number
  sugars?: number
  potassium?: number
  full_nutrients?: {
    attr_id: number
    value: number
  }[]
  serving_weight_grams?: number
  photo?: {
    thumb: string
    highres: string | null
    is_user_uploaded: boolean
  }
  alt_measures?: AltMeasure[] | null
}

export interface IFavoriteMeal {
  id: number
  name: string
  type: string // recipe | easy_add_recipe | meal_set
  created_at: string
  user_genderated?: boolean
  img_url?: string
  original_recipe_id?: number
}

export interface IMealFilter {
  recipes: {
    favoritesOnly: boolean
    mealTimes: Record<MealTimeSlot, boolean>
    eatingPreferences: Record<Capitalize<Lowercase<EatingPreference>>, boolean>
  }
  mealPlans: {
    favoritesOnly: boolean
    eatingPreferences: Record<Capitalize<Lowercase<EatingPreference>>, boolean>
  }
}

/* ************** STATE ************** */

export interface IMealPlanState {
  day: Date | string
  mealTimeSlot: number
  mealSets: IMealPlan[]
  mealPlans: {
    [key: string]: {
      [key: string]: {
        [key: string]: {
          data: IMealPlanDay
        }
      }
    }
  }
  mealPlansv4: {}
  groceries: GroceryIngredient[]
  selectedGroceries: GroceryIngredient[]
  dates: string
  favorites: IFavoriteMeal[]
  history: Partial<IRecipe>[]
  initialDataLoaded: boolean
  persistedScreenState: Record<string, any>
  currentRecipe: IRecipe | null // TODO still need to figure out what a Recipe is. So many variations
  setOn: Date | string | null
  filters: IMealFilter | null
  isLoading: boolean
  ingredientsOnly: boolean
}

/* ********** GUARDS ********** */
export function isEasyAddRecipeIngredient(ing: any): ing is IEasyAddRecipeIngredient {
  return ing.type === RecipeType.easy_add_recipe
}

/* ************** Api responses and action payloads ******************************* */

export interface IListMealsResponse extends IMealPlanDay {}

export interface IGetRecipesRangePayload {
  startDate: string
  endDate?: string
}

export interface IListMealSetsPayload {
  eatingPreferences: {
    [key in Capitalize<Lowercase<EatingPreference>>]: boolean
  }
  favoritesOnly: boolean
}

export interface IListRecipesResponse {
  data: {
    id: number
    name: string
    thumb_img_url: string
    tags: EatingPreference[]
    meal_time_slots: MealTimeSlot[]
    calories: number
    fats: number
    carbs: number
    protein: number
    is_favorite: boolean
    user_generated: boolean
    original_recipe_id: number | null
    children_ids: number[]
  }[]
  meta: {
    pagination: {
      total: number
      count: number
      per_page: number
      current_page: number
      total_pages: number
      links: Record<string, any>
    }
  }
}

export interface IIngredientsSearchResponse {
  common: {
    food_name: string
    serving_unit: string
    tag_name: string
    serving_qty: number
    common_type: string | null
    tag_id: number
    photo: {
      thumb: string
    }
    locale: string
  }[]
  branded: {
    food_name: string
    serving_unit: string
    nix_brand_id: string
    brand_name_item_name: string
    serving_qty: number
    nf_calories: number
    photo: {
      thumb: string
      highres: string | null
      is_user_uploaded: boolean
    }
    brand_name: string
    region: number
    brand_type: string
    nix_item_id: string
    locale: string
  }[]
}

export interface IRenderableIngredientItem extends Partial<IRecipe> {
  id: number
  type: RecipeType
  key: string
  disableRightSwipe?: boolean
  base_ingredient_id: number
  nix_food_name: string
  meal_time_slot_id: number
  serving_qty: number
  serving_weight_grams: number
  calories: number
  protein: number
}

export interface IIngredientDetailsResponse extends IRenderableIngredientItem {
  error?: boolean
}

export interface IRecipeDetailsResponse {
  id: number
  name: string
  type_id: number
  yields: number
  total_time: number
  mpr_id: number
  instructions: string
  goal_type_id: number
  calories: number
  carbs: number
  fats: number
  protein: number
  prep_time: number
  tag: Capitalize<Lowercase<EatingPreference>>
  full_img_url: string
  thumb_img_url: string
  meal_time_slot?: MealTimeSlot
  meal_time_slot_id?: number
  tags: EatingPreference[]
  ingredients: IMealPlanIngredient[]
  steps: IRecipeStep[]
  tools: IRecipeTool[]
  eating_preferences: EatingPreference[]
}

export interface IMealSetDetailsNewResponse extends IMealPlan {}

export interface IStoreMealSetPayload {
  date: string | Date
  meal_set_id: number
}

export interface IStoreMealSetResponse extends IMealPlanDay {}

export interface IStoreIngredientPayload {
  id: string
  date: string | Date
  meal_time_slot_id: number
  quantity: number
  protein: number
  serving_unit: string
  carbs: number
  fats: number
  calories: number
}

export interface IStoreIngredientResponse extends IMealPlanDay {}

export interface ICreateEasyAddPayload extends IEasyAdd {}

export interface ICreateEasyAddResponse extends IEasyAdd {}

export interface IUpdateEasyAddResponse extends IEasyAdd {}

export interface IEasyAddDetailsResponse extends IEasyAdd {}

export interface IEasyAddSearchResponse extends IEasyAdd {}

export interface IAddEasyAddToDiaryPayload {
  date: string | Date
  easy_add_recipe_id: number
  meal_time_slot_id: number
}

export interface IAddEasyAddToDiaryResponse extends IMealPlanDay {}

export interface IAddRecipeToDiaryPayload {
  date: string | Date
  recipe_id: number | string
  meal_time_slot_id: number
}

export interface IAddRecipeToDiaryResponse extends IMealPlanDay {}

export interface IAddRecipeToFavoritesResponse {
  data: IFavoriteMeal[]
}

export interface IRemoveRecipeFromFavoritesResponse {
  data: IFavoriteMeal[]
}

export interface IAddEasyAddToFavoritesResponse {
  data: IFavoriteMeal[]
}

export interface IRemoveEasyAddFromFavoritesResponse {
  data: IFavoriteMeal[]
}

export interface IAddMealSetToFavoritesResponse {
  data: IFavoriteMeal[]
}

export interface IRemoveMealSetFromFavoritesResponse {
  data: IFavoriteMeal[]
}

export interface IListFavoritesResponse {
  data: IFavoriteMeal[]
}

export type SelectedItem = { type: RecipeType; id: number; meal_time_slot_id: number }
export interface IDeleteDiaryItemPayload {
  date: string | Date
  items: SelectedItem[]
}

export interface IDeleteDiaryItemsResponse {
  data: IMealPlanDay
}

export interface ICopyDiaryItemsPayload {
  dates: string[] | Date[]
  items: {
    id: number
    type: string // recipe | ingredient | easy_add_recipe
    meal_time_slot_id: number
  }[]
}

export interface ICopyDiaryItemsResponse {
  data: IMealPlanDay[]
}

export interface IUpdateIngredientPayload {
  date: string | Date
  data: {
    id: number
    calories: number
    carbs: number
    protein: number
    fats: number
    quantity: number
    serving_unit: string
    meal_time_slot_id: number
  }
}

export interface IUpdateDiaryIngredientResponse {
  data: IMealPlanDay
}

export interface ICreateUserRecipePayload {
  recipe_id: number | string
  name: string
  ingredients: IBaseIngredient[]
  easy_add_recipe_ids: number[] | string[]
}

export interface ICreateUserRecipeResponse {
  data: IIndividualRecipeDetails
}

export interface IUpdateUserRecipePayload {
  id: number | string
  recipe: {
    recipe_id: number | string
    name?: string
    ingredients: IBaseIngredient[]
    easy_add_recipe_ids: number[] | string[]
  }
}
export interface IUpdateUserRecipeResponse {
  data: IIndividualRecipeDetails
}

export interface IStoreMealPlanPayload {
  date: string | Date
  data: IMealPlanDay | null
}

export interface IStoreFavoritesPayload {
  data: IFavoriteMeal[]
}

export interface IStoreItemHistoryPayload {
  item: Partial<IRecipe>
}

export interface IStoreGroceriesPayload {
  dates: string
  ingredients: GroceryIngredient[]
}
