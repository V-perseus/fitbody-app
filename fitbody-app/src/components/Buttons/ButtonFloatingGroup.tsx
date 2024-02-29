import React from 'react'
import { Text, View, Pressable, ViewStyle } from 'react-native'
import { scale, moderateScale } from 'react-native-size-matters'

import BottomHover from '../../shared/BottomHover'

import ShareIcon from '../../../assets/images/svg/icon/24px/share.svg'
import EditIcon from '../../../assets/images/svg/icon/24px/edit.svg'
import CopyIcon from '../../../assets/images/svg/icon/24px/copy.svg'
import TrashIcon from '../../../assets/images/svg/icon/24px/trash.svg'

import globals from '../../config/globals'

const AvailableIconNames = Object.freeze({
  share: ShareIcon,
  edit: EditIcon,
  copy: CopyIcon,
  trash: TrashIcon,
})
interface IButtonFloatingProps {
  onPressLeft: null | (() => void)
  onPressRight: null | (() => void)
  btnLeftStyles?: ViewStyle
  btnRightStyles?: ViewStyle
  btnLeftIconName?: keyof typeof AvailableIconNames
  btnRightIconName?: keyof typeof AvailableIconNames
  btnLeftText: string
  btnRightText: string
}
export const ButtonFloatingGroup: React.FC<IButtonFloatingProps> = ({
  onPressLeft,
  onPressRight,
  btnLeftStyles,
  btnRightStyles,
  btnLeftIconName = 'share',
  btnRightIconName = 'edit',
  btnLeftText = 'LEFT',
  btnRightText = 'RIGHT',
}) => {
  const leftButtonStyles = (pressed: boolean) => [styles.touchableLeft(pressed), btnLeftStyles && btnLeftStyles]
  const rightButtonStyles = (pressed: boolean) => [styles.touchableRight(pressed), btnRightStyles && btnRightStyles]
  const LeftIcon = AvailableIconNames[btnLeftIconName]
  const RightIcon = AvailableIconNames[btnRightIconName]

  return (
    <BottomHover>
      <View style={styles.container}>
        <Pressable onPress={onPressLeft} style={({ pressed }) => leftButtonStyles(pressed)} testID="button_left">
          <LeftIcon width={scale(24)} height={scale(24)} color={styles.iconColor} />
          <Text style={styles.touchableLeftText}>{btnLeftText}</Text>
        </Pressable>
        <Pressable onPress={onPressRight} style={({ pressed }) => rightButtonStyles(pressed)} testID="button_right">
          <RightIcon width={scale(24)} height={scale(24)} color={styles.iconColor} />
          <Text style={styles.touchableRightText}>{btnRightText}</Text>
        </Pressable>
      </View>
    </BottomHover>
  )
}

const styles = {
  container: { flexDirection: 'row', paddingHorizontal: 16 } as ViewStyle,
  touchableLeft: (pressed: boolean): ViewStyle => ({
    flex: 1,
    flexDirection: 'row',
    marginVertical: scale(5),
    marginHorizontal: scale(8),
    marginTop: scale(25),
    marginBottom: scale(30),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: globals.styles.colors.colorSkyBlue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: globals.styles.colors.colorSkyBlue,
    shadowOpacity: pressed ? 0.3 : 0.7,
    shadowRadius: pressed ? 5 : scale(15),
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  }),
  touchableLeftText: {
    marginLeft: scale(8),
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
  } as ViewStyle,
  touchableRight: (pressed: boolean): ViewStyle => ({
    flex: 1,
    marginVertical: scale(5),
    marginHorizontal: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(25),
    marginBottom: scale(30),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: globals.styles.colors.colorLove,
    justifyContent: 'center',
    shadowColor: globals.styles.colors.colorPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: pressed ? 0.3 : 0.7,
    shadowRadius: pressed ? 5 : scale(15),
    elevation: 3,
  }),
  touchableRightText: {
    marginLeft: scale(8),
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
  } as ViewStyle,
  iconColor: globals.styles.colors.colorWhite,
}
