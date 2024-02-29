import DairyFree from '../../../../assets/images/svg/icon/16px/meal/dairy-free.svg'
import GlutenFreeDairyFree from '../../../../assets/images/svg/icon/16px/meal/gluten-free-dairy-free.svg'
import GlutenFree from '../../../../assets/images/svg/icon/16px/meal/gluten-free.svg'
// import HeartHealthy from '../../../../assets/images/svg/icon/16px/meal/heart-healthy.svg'
import Keto from '../../../../assets/images/svg/icon/16px/meal/keto.svg'
// import Mothers from '../../../../assets/images/svg/icon/16px/meal/mothers.svg'
import Regular from '../../../../assets/images/svg/icon/16px/meals-solid.svg'
import Pescatarian from '../../../../assets/images/svg/icon/16px/meal/pescatarian.svg'
import Vegan from '../../../../assets/images/svg/icon/16px/meal/vegan.svg'
import Vegetarian from '../../../../assets/images/svg/icon/16px/meal/vegetarian.svg'
import Mediterranean from '../../../../assets/images/svg/icon/16px/meal/mediterranean.svg'

// Consumed by RecipeCard.js

export type EatingPreferencesIconMapType = keyof typeof EatingPreferencesMap

export const EatingPreferencesMap = Object.freeze({
  KETO: Keto,
  VEGETARIAN: Vegetarian,
  VEGAN: Vegan,
  PESCATARIAN: Pescatarian,
  'GLUTEN-FREE': GlutenFree,
  'DAIRY-FREE': DairyFree,
  'GLUTEN-FREE + DAIRY-FREE': GlutenFreeDairyFree,
  // HeartHealthy: HeartHealthy,
  REGULAR: Regular,
  MEDITERRANEAN: Mediterranean,
})
