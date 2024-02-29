import { Platform, StatusBar, ViewStyle } from 'react-native'
import colors from './colors'

// Default global styles
const styles = {
  colors: {
    ...colors,
  },
  fonts: {
    primary: {
      style: {
        fontFamily: 'OpenSans',
      },
      semiboldStyle: {
        fontFamily: 'OpenSans-Semibold',
      },
      boldStyle: {
        fontFamily: 'OpenSans-Bold',
      },
      extraBoldStyle: {
        fontFamily: 'OpenSans-ExtraBold',
      },
    },
    secondary: {
      style: {
        fontFamily: 'BebasNeue',
      },
    },
    accent: {
      style: {
        fontFamily: 'JustLovely',
      },
    },
  },
  container: {
    flex: 1,
  },
  view: {
    flex: 1,
    marginHorizontal: 15,
    flexDirection: 'column',
    marginTop: Platform.OS === 'ios' ? 60 : 60 + (StatusBar.currentHeight || 0),
  } as ViewStyle,
  workouts: {
    colors: {
      SHRED: colors.colorLove,
      TONE: colors.colorPurple,
      SCULPT: colors.colorTopaz,
    },
    gradients: {
      SHRED: [colors.colorPink, colors.colorLove],
      // This is an intentional different dark purple...
      TONE: [colors.colorLavender, colors.colorPurple],
      SCULPT: [colors.colorSkyBlue, colors.colorTopaz],
    },
  },
  gradients: {
    SCREEN: [colors.colorLavender, colors.colorPink],
  },
}

export default styles
