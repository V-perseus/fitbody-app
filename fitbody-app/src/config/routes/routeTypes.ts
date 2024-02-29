import { CompositeNavigationProp, NavigatorScreenParams, RouteProp, NavigationProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { IEasyAddRecipeIngredient, IFavoriteMeal, IIngredientDetailsResponse, IRecipeDetailsResponse } from '../../data/meal_plan/types'
import { IVideoData } from '../../data/media/types'
import { IProgressPhoto, ProgressPhotoViewTypes } from '../../data/progress_photos/types'
import { ICategory, IExercise, IProgram, ITiming, IWorkout, ProgramTypes } from '../../data/workout/types'

/*
  Many routes still do not have their params defined yet.
*/

// Screen navigation and route types
export type BottomTabScreenOptionsProps = {
  route: RouteProp<MainBottomTabNavigatorParamList, keyof MainBottomTabNavigatorParamList>
  navigation: any
}

export type AddFoodStackOptionsProps = {
  route: RouteProp<EatingStackParamList, 'Food' | 'Ingredient'>
  navigation: any
}

export type SubscriptionStackOptionsProps = {
  route: RouteProp<MainStackParamList, 'Subscription'>
  navigation: CompositeNavigationProp<
    NavigationProp<MainStackParamList, 'Subscription'>,
    NavigationProp<WorkoutsStackParamList, 'ProgramDetails' | 'RecommendedPrograms'>
  >
}

export type SignInSignUpOptionsProps = {
  navigation: NavigationProp<LoggedOutStackParamList, 'SignInSignUp' | 'ForgotPassword'>
}

export type DisclaimerOptionsProps = {
  route: RouteProp<ModalsStackParamList, 'Disclaimer'>
  navigation: NavigationProp<MainStackParamList>
}

export type PerformanceScreenNavigationProps = {
  route: RouteProp<MainStackParamList, 'Performance'>
  navigation: NavigationProp<WorkoutsStackParamList>
}

export type RecommendedProgramsScreenNavigationProps = {
  route: RouteProp<WorkoutsStackParamList, 'RecommendedPrograms'>
  navigation: CompositeNavigationProp<
    StackNavigationProp<WorkoutsStackParamList & MainStackParamList>,
    StackNavigationProp<GuidanceStackParamList & MainBottomTabNavigatorParamList, 'OnDemandCategory' | 'Guidance'>
  >
}

export type WorkoutOverviewScreenNavigationProps = {
  navigation: CompositeNavigationProp<
    NavigationProp<WorkoutsStackParamList>,
    NavigationProp<MainStackParamList, 'Tooltips' | 'Level' | 'GetReady'>
  >
}

export type DownloadsScreenNavigationProps = CompositeNavigationProp<
  NavigationProp<AccountStackParamList, 'Downloads'>,
  NavigationProp<MainStackParamList, 'Modals'>
>

// if navigation needs access to more than one router
export type MenuScreenUseNavigationProp = CompositeNavigationProp<
  NavigationProp<AccountStackParamList>,
  NavigationProp<MainStackParamList, 'Modals'>
>

export type MealPlanScreenUseNavigationProp = CompositeNavigationProp<
  NavigationProp<EatingStackParamList, 'FoodMacros' | 'Recipe'>,
  NavigationProp<MainStackParamList, 'Modals' | 'EatingPreference' | 'Calculator'>
>

export type RecentFoodsScreenNavigationProps = {
  navigation: NavigationProp<
    EatingStackParamList,
    'MealPlan' | 'IndividualRecipe' | 'EasyAdd' | 'MealsetDetails' | 'FoodMacros' | 'BarcodeScan'
  >
}

export type AccountDeletionScreenUseNavigationProp = CompositeNavigationProp<
  NavigationProp<AccountStackParamList, 'AccountDeletion'>,
  NavigationProp<MainStackParamList, 'Modals'>
>

export type CollagePhotoScreenNavigationProps = {
  route: RouteProp<AccountStackParamList, 'CollagePhoto'>
  navigation: NavigationProp<AccountStackParamList>
}

export type ViewProgressPhotoScreenNavigationProps = {
  route: RouteProp<AccountStackParamList, 'ViewProgressPhoto'>
  navigation: NavigationProp<AccountStackParamList, 'CollagePhoto'>
}

export type CalculatorScreenNavigationProps = {
  navigation: NavigationProp<MainStackParamList, 'CalculatedMacros'>
}

export type WeightTrackerScreenNavigationProps = {
  route: RouteProp<MainStackParamList, 'WeightTracker'>
  navigation: NavigationProp<MainStackParamList, 'WeightTracker'>
}

type VideoCategoryParams = {
  title: string
  headerImage: string
  categoryId: number
  description: string
}

// stack routes and params defs
export type MainBottomTabNavigatorParamList = {
  Workout: undefined
  Eating: undefined
  Guidance: { screen: 'GuidanceCategories' | 'OnDemandCategory'; params: VideoCategoryParams | undefined } | undefined
  History: undefined
  Profile: undefined
}

export type MainStackParamList = {
  Home: { screen: any; params: { screen: 'RecommendedPrograms' } } | undefined
  QuizLevel: undefined
  QuizLocation: undefined
  QuizGoal: undefined
  QuizPace: undefined
  Overview: undefined
  SingleWorkout: { continuePrevious?: boolean; exercise?: IExercise } | undefined
  Level: { from: string } | undefined
  Cardio: undefined
  GetReady: { circuitIdx: number } | undefined
  CircuitComplete: undefined
  CircuitRest: undefined
  Exercise: undefined
  Modals: NavigatorScreenParams<ModalsStackParamList>
  Complete: undefined
  Performance: {
    program: IProgram
    workout: IWorkout
    exercise?: IExercise
    category: ICategory
    elapsed: number
    timings: ITiming[]
    isHistory: boolean
  }
  EditExtraMood: undefined
  Subscription: { from: keyof MainStackParamList | keyof WorkoutsStackParamList; params: any } | undefined
  Tooltips: { screen: 'Tooltip'; params: { name: string; openedManually: boolean } } | undefined
  EatingPreference: { fromProfile: boolean } | undefined
  CalculatedMacros: { fromProfile: boolean } | undefined
  Calculator: undefined
  WeightPreference: { fromProfile: boolean } | undefined
  WeightTracker: { title: string; primaryColor: string; secondaryColor: string; unit: string }
}

export type ModalsStackParamList = {
  ProgramSettings: { program: IProgram; weekNumber: number }
  VideoSettings: undefined
  ConfirmationDialog: {
    showCloseButton?: boolean
    hideNoButton?: boolean
    title: string
    body?: string | null | undefined
    yesLabel: string
    noLabel?: string
    backOnYes?: boolean
    backOnNo?: boolean
    yesHandler: () => void
    noHandler?: () => void
    iconType?: string | null
    yesBtnColor?: string
  }
  DownloadsDialog: undefined
  ProgramSelector: undefined
  Invite: undefined
  Disclaimer: {
    title: string
    body: string
    acceptHandler: () => void
    approvalRequired?: boolean
  }
  ContactDialog: undefined
  Video: {
    video: {
      duration: number
      id: number
      thumbnail: string
      name: string
      video_data: IVideoData
      description?: string
    }
    onComplete: () => void
    type: string
    category: string
    skipCompletionLogging: boolean
  }
}

export type WorkoutsStackParamList = {
  Categories: undefined
  RecommendedPrograms: { fromCategories: boolean }
  ProgramDetails: { fromCategories: boolean; slug: ProgramTypes | null | undefined } | undefined
  Workouts: undefined
  Challenges: { program: IProgram } | undefined
}

export type HistoryTabStackParamList = {
  Month: undefined
  Week: undefined
  Journal: undefined
}

export type HistoryStackParamList = {
  Home: undefined
  EditJournal: { date: string } | undefined
}

export type WeightTrackTabStackParamList = {
  Tracker: undefined
  History: undefined
}

export type WeightTrackStackParamList = {
  Home: undefined
}

export type AccountStackParamList = {
  Menu: undefined
  ProfileView: undefined
  ProfileEdit: undefined
  Settings: undefined
  ChangePassword: undefined
  Privacy: undefined
  Terms: undefined
  Notifications: undefined
  FAQ: undefined
  ProgressPhotos: undefined
  Progress: { selectedDate: string; viewType: number } | undefined
  // eslint-disable-next-line prettier/prettier
  ViewProgressPhoto: {
    picture: string | null
    view_type: ProgressPhotoViewTypes
    progressPhotos: Partial<IProgressPhoto>[]
    date: string | undefined
  }
  CollagePhoto: { picture: string }
  Downloads: undefined
  NotificationSettings: undefined
  AccountDeletion: undefined
}

export type GuidanceStackParamList = {
  OnDemandGuidance: undefined
  GuidanceCategories: undefined
  GuidanceCategory: undefined
  OnDemandCategories: undefined
  OnDemandCategory: VideoCategoryParams | undefined
}

export type TooltipStackParamList = {
  Tooltip: undefined
}

export type LoggedOutStackParamList = {
  Welcome: undefined
  SignInSignUp: undefined
  SignUp: undefined
  ForgotPassword: undefined
  Terms: undefined
  Privacy: undefined
}

export type AddFoodTabsStackParamList = {
  RecentFoods: undefined
  RecipeSearch: undefined
  RecommendedMealPlans: undefined
  Favorites: undefined
}

export type AddIngredientsTabsStackParamList = {
  RecentFoods: undefined
  Favorites: undefined
}

export type AddFoodStackParamList = {
  AddFood: undefined
}

export type AddIngredientStackParamList = {
  AddIngredient: undefined
}

export type EatingStackParamList = {
  MealPlan: undefined
  Recipe: { recipe: IRecipeDetailsResponse } | undefined
  FoodMacros: { ingredient: IIngredientDetailsResponse; currentValues: any; mealSlotId?: number } | undefined
  BarcodeScan: undefined
  GroceryList: undefined
  EasyAdd: { easyAdd: IEasyAddRecipeIngredient; addAfterUpdate: boolean } | undefined
  Filter: undefined
  MealsetDetails: { mealSet: IFavoriteMeal } | undefined
  IndividualRecipe: { existingRecipe: boolean; existingId: number; instanceId: number } | undefined
  Food: undefined
  Ingredient: { key: string } | undefined
}
