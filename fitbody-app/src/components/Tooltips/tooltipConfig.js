/*
  each tooltip key (ex. workout, ['workout overview']) are used as router params and as
  the title shown on the tooltip screen itself so name them accordingly.

  Each category 'id' needs to be incremented/changed in order to show a new tooltip
  or updated slides. This 'id' is what is being tracked by each user. For example,
  if a slide is added to 'workout' and we want to show it to every user again, the 'id'
  could be changed to 'WT_001_1'. It must be unique among all existing and previous
  ids.

  -- just a reminder --

  const tooltipWorkoutsId = TOOLTIPS.workout.id
  if (!this.props.userTooltips || !this.props.userTooltips[tooltipWorkoutsId]) {
    setTimeout(() => {
      props.navigation.navigate('Tooltips', { screen: 'Tooltip', params: { name: 'workout' } })
    }, 250)
  }

  headerRight: (
    <TouchableOpacity style={globals.header.icons} onPress={nav to Tooltips screen}>
      <TipIcon name="Tips" width="24" height="24" viewBox="0 0 24 24" fill={globals.styles.colors.colorBlack} />
    </TouchableOpacity>
  ),

*/

// workout screen header right
import WT_001 from '../../../assets/images/tooltips/wt-001.png'
import WT_001a from '../../../assets/images/tooltips/wt-001a.png'
import WT_001b from '../../../assets/images/tooltips/wt-001b.png'
import WT_001c from '../../../assets/images/tooltips/wt-001c.png'
import WT_001d from '../../../assets/images/tooltips/wt-001d.png'

// challenge screen
import WT_002 from '../../../assets/images/tooltips/wt-002.png'
import WT_002a from '../../../assets/images/tooltips/wt-002a.png'

// workout overview screen
import WT_003 from '../../../assets/images/tooltips/wt-003.png'

// cardio screen
import WT_004 from '../../../assets/images/tooltips/wt-004.png'
import WT_004a from '../../../assets/images/tooltips/wt-004a.png'
import WT_004b from '../../../assets/images/tooltips/wt-004b.png'

// workout complete screen
import WT_005 from '../../../assets/images/tooltips/wt-005.png'
import WT_005a from '../../../assets/images/tooltips/wt-005a.png'
import WT_005b from '../../../assets/images/tooltips/wt-005b.png'
import WT_005c from '../../../assets/images/tooltips/wt-005c.png'

// mealplan screen
import MT_001 from '../../../assets/images/tooltips/mt-001.png'
import MT_001a from '../../../assets/images/tooltips/mt-001a.png'
import MT_001b from '../../../assets/images/tooltips/mt-001b.png'
import MT_001c from '../../../assets/images/tooltips/mt-001c.png'
import MT_001d from '../../../assets/images/tooltips/mt-001d.png'
import MT_001e from '../../../assets/images/tooltips/mt-001e.png'
import MT_001f from '../../../assets/images/tooltips/mt-001f.png'
import MT_001g from '../../../assets/images/tooltips/mt-001g.png'
import MT_001h from '../../../assets/images/tooltips/mt-001h.png'

// on-demand
import OD_001 from '../../../assets/images/tooltips/od-001.png'
import OD_001a from '../../../assets/images/tooltips/od-001a.png'

export const TRANSITION_TYPES = {
  slide: 'slide',
  fade: 'fade',
}

export const TOOLTIPS = {
  workout: {
    id: 'WT-001',
    slides: [
      {
        id: 'WT-001d',
        baseLayerImage: WT_001d,
        transitionType: 'slide',
      },
      {
        id: 'WT-001',
        baseLayerImage: WT_001,
        transitionType: 'slide',
      },
      {
        id: 'WT-001a',
        baseLayerImage: WT_001a,
        transitionType: 'slide',
      },
      {
        id: 'WT-001b',
        baseLayerImage: WT_001b,
        transitionType: 'slide',
      },
      {
        id: 'WT-001c',
        baseLayerImage: WT_001c,
        transitionType: null,
      },
    ],
  },
  // challenges
  ['cardio burn']: {
    id: 'WT-002',
    slides: [
      {
        id: 'WT-002',
        baseLayerImage: WT_002,
        transitionType: 'slide',
      },
      {
        id: 'WT-002a',
        baseLayerImage: WT_002a,
        transitionType: null,
      },
    ],
  },
  ['workout overview']: {
    id: 'WT-003',
    slides: [
      {
        id: 'WT-003',
        baseLayerImage: WT_003,
        transitionType: null,
      },
    ],
  },
  cardio: {
    id: 'WT-004',
    slides: [
      {
        id: 'WT-004',
        baseLayerImage: WT_004,
        transitionType: 'slide',
      },
      {
        id: 'WT-004a',
        baseLayerImage: WT_004a,
        transitionType: null,
      },
      // {
      //   id: 'WT-004b',
      //   baseLayerImage: WT_004b,
      //   transitionType: null,
      // },
    ],
  },
  ['workout complete']: {
    id: 'WT-005',
    slides: [
      {
        id: 'WT-005',
        baseLayerImage: WT_005,
        transitionType: 'slide',
      },
      {
        id: 'WT-005a',
        baseLayerImage: WT_005a,
        transitionType: 'slide',
      },
      {
        id: 'WT-005b',
        baseLayerImage: WT_005b,
        transitionType: 'slide',
      },
      {
        id: 'WT-005c',
        baseLayerImage: WT_005c,
        transitionType: null,
      },
    ],
  },
  ['meal plans']: {
    id: 'MT-001',
    slides: [
      {
        id: 'MT-001',
        baseLayerImage: MT_001,
        transitionType: 'slide',
      },
      {
        id: 'MT-001a',
        baseLayerImage: MT_001a,
        transitionType: 'slide',
      },
      {
        id: 'MT-001b',
        baseLayerImage: MT_001b,
        transitionType: 'slide',
      },
      {
        id: 'MT-001c',
        baseLayerImage: MT_001c,
        transitionType: 'slide',
      },
      {
        id: 'MT-001d',
        baseLayerImage: MT_001d,
        transitionType: 'slide',
      },
      {
        id: 'MT-001e',
        baseLayerImage: MT_001e,
        transitionType: 'slide',
      },
      {
        id: 'MT-001f',
        baseLayerImage: MT_001f,
        transitionType: 'slide',
      },
      {
        id: 'MT-001g',
        baseLayerImage: MT_001g,
        transitionType: 'slide',
      },
      {
        id: 'MT-001h',
        baseLayerImage: MT_001h,
        transitionType: null,
      },
    ],
  },
  ["look what's new"]: {
    id: 'OD-001',
    slides: [
      {
        id: 'OD-001',
        baseLayerImage: OD_001,
        transitionType: 'slide',
      },
      {
        id: 'OD-001a',
        baseLayerImage: OD_001a,
        transitionType: null,
      },
    ],
  },
}
