import Exercised from '../../../../assets/images/svg/icon/32px/exercise.svg'
import AteHealthy from '../../../../assets/images/svg/icon/32px/healthy.svg'
import MealPrepped from '../../../../assets/images/svg/icon/32px/meal.svg'
import DrankWater from '../../../../assets/images/svg/icon/32px/water.svg'
import RestDay from '../../../../assets/images/svg/icon/32px/rest.svg'
import Sleep from '../../../../assets/images/svg/icon/32px/sleep.svg'
import Social from '../../../../assets/images/svg/icon/32px/social.svg'
import Worked from '../../../../assets/images/svg/icon/32px/work.svg'
import Productive from '../../../../assets/images/svg/icon/32px/productive.svg'
import School from '../../../../assets/images/svg/icon/32px/school.svg'
import Studied from '../../../../assets/images/svg/icon/32px/study.svg'
import Posture from '../../../../assets/images/svg/icon/32px/posture.svg'
import Priority from '../../../../assets/images/svg/icon/32px/prioritise.svg'
import Period from '../../../../assets/images/svg/icon/32px/period.svg'
import Indulged from '../../../../assets/images/svg/icon/32px/indulged.svg'
import Alcohol from '../../../../assets/images/svg/icon/32px/alcohol.svg'

export type ActivitiesIconMapType = keyof typeof ActivitiesIconMap

export const ActivitiesIconMap = Object.freeze({
  exercised: Exercised,
  ate_healthy: AteHealthy,
  meal_prepped: MealPrepped,
  'drank_3-4_liters_of_water': DrankWater,
  took_a_rest_day: RestDay,
  'slept_6-8_hours': Sleep,
  was_social: Social,
  worked: Worked,
  was_productive: Productive,
  went_to_school: School,
  studied: Studied,
  focused_on_posture: Posture,
  made_myself_a_priority: Priority,
  am_on_my_period: Period,
  indulged: Indulged,
  drank_alcohol: Alcohol,
})
