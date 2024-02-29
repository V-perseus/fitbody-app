import { StyleSheet, Dimensions, Platform } from 'react-native'
import globals from '../../config/globals'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}

const slideHeight = viewportHeight * 0.6
const slideWidth = wp(75)
const itemHorizontalMargin = wp(2)

export const sliderWidth = viewportWidth
export const itemWidth = slideWidth + itemHorizontalMargin * 2

const entryBorderRadius = 8

const styles = StyleSheet.create({
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18, // needed for shadow
  },
  imageContainer: {
    flex: 1,
    backgroundColor: globals.styles.colors.colorWhite,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  imageContainerEven: {
    backgroundColor: globals.styles.colors.colorWhite,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  // image's border radius is buggy on ios; let's hack it!
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  radiusMaskEven: {
    backgroundColor: globals.styles.colors.colorWhite,
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: globals.styles.colors.colorWhite,
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
  },
  textContainerEven: {
    backgroundColor: globals.styles.colors.colorWhite,
  },
  title: {
    color: globals.styles.colors.colorBlackDark,
    fontSize: 13,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  titleEven: {
    color: globals.styles.colors.colorBlackDark,
  },
  subtitle: {
    marginTop: 6,
    color: globals.styles.colors.colorBlackDark,
    fontSize: 12,
    // fontStyle: 'italic',
    textAlign: 'center',
  },
  subtitleEven: {
    color: globals.styles.colors.colorBlackDark,
  },
  email: {
    marginTop: 6,
    color: globals.styles.colors.colorBlackDark,
    textAlign: 'center',
  },
  phoneNumber: {
    marginTop: 6,
    color: globals.styles.colors.colorBlackDark,
    textAlign: 'center',
  },
  textsliderBracketsView: {
    fontSize: 15,
    color: globals.styles.colors.colorBlackDark,
    left: -7,,
  },
  textsliderContentView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    backgroundColor: globals.styles.colors.colorWhite,
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
  },
  sliderContentName: {
    color: globals.styles.colors.colorBlackDark,
    fontSize: 20,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
  sliderTitleView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  sliderButtonsView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
})

export default styles
