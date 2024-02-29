import React from 'react'
import { View, Text, Pressable, ViewStyle, TextStyle } from 'react-native'

import ChevronRight from '../../../../../assets/images/svg/right.svg'
import ChallengeUnchecked from '../../../../../assets/images/svg/challenge_unchecked.svg'
import globals from '../../../../config/globals'

interface IWeekChallengeProps {
  onPress: () => void
}
export const Week_Challenge: React.FC<IWeekChallengeProps> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => styles.container(pressed)}>
      <ChallengeUnchecked width={40} height={40} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Today's 5 minute cardio burn</Text>
      </View>
      <ChevronRight width={24} height={24} color={globals.styles.colors.colorYellow} />
    </Pressable>
  )
}

const styles = {
  container: (pressed: boolean): ViewStyle => ({
    borderWidth: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 14,
    borderColor: globals.styles.colors.colorYellow,
    borderRadius: 8,
    paddingVertical: 24,
    flexDirection: 'row',
    backgroundColor: globals.styles.colors.colorWhite,
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: pressed ? 0.25 : 0.43,
    shadowRadius: pressed ? 3.84 : 9.51,
    elevation: pressed ? 5 : 15,
  }),
  titleContainer: {
    flexDirection: 'column',
    marginLeft: 8,
  } as ViewStyle,
  title: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
  } as TextStyle,
}
