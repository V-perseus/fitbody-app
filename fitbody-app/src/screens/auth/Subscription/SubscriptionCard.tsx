import React from 'react'
import { Text, View, Pressable, StyleSheet, ViewStyle } from 'react-native'
import { Subscription } from 'react-native-iap'

import { ISubscriptionData } from './Subscription'

import ChevronRight from '../../../../assets/images/svg/icon/24px/cheveron/right.svg'
import globals from '../../../config/globals'

interface ISubscriptionCardProps {
  sub: ISubscriptionData
  highlighted?: boolean
  onPress: (sub: Subscription) => void
  highlightColor?: string
}
export const SubscriptionCard: React.FC<ISubscriptionCardProps> = ({ sub, highlighted, onPress, highlightColor }) => {
  function handlePress() {
    if (sub.sub) {
      onPress(sub.sub)
    }
  }
  return (
    <Pressable onPress={handlePress} style={({ pressed }) => styleFunctions.container(pressed, highlighted, highlightColor)}>
      <View style={styles.innerContainer}>
        <View style={styles.subInfoContainer}>
          <Text style={styles.subInfoTitle}>{sub.period}</Text>
          {sub.originalPrice && <Text style={styles.originalPrice}>{sub.originalPrice}</Text>}
          <Text style={[styles.subInfoPriceYear, { color: highlightColor || globals.styles.colors.colorLove }]}>{sub.amount}</Text>
          <Text style={styles.subInfoPriceDay}>{sub.term}</Text>
        </View>
        <ChevronRight style={styles.chevron} color={globals.styles.colors.colorBlack} />
      </View>
      {sub.highlightedText && (
        <View style={[styles.discountContainer, { backgroundColor: highlightColor || globals.styles.colors.colorLove }]}>
          <Text style={styles.discountText}>{sub.highlightedText}</Text>
        </View>
      )}
    </Pressable>
  )
}

const styleFunctions = {
  container: (pressed: boolean, highlighted?: boolean, highlightColor?: string) =>
    ({
      shadowColor: globals.styles.colors.colorBlackDark,
      shadowOpacity: 0.25,
      shadowRadius: pressed ? 5 : 10,
      shadowOffset: { width: 0, height: 3 },
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      marginTop: 24,
      width: globals.window.width - 48,
      marginHorizontal: 24,
      borderRadius: 8,
      borderWidth: highlighted ? 3 : 0,
      borderColor: highlightColor || globals.styles.colors.colorLove,
      backgroundColor: globals.styles.colors.colorWhite,
    } as ViewStyle),
}

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 141,
  },
  subInfoContainer: {
    flexGrow: 1,
    minHeight: 141,
    justifyContent: 'space-between',
    paddingLeft: 25,
  },
  subInfoTitle: {
    color: globals.styles.colors.colorBlack,
    fontSize: 35,
    height: 32,
    marginTop: 12,
    marginBottom: 7,
    textTransform: 'uppercase',
    ...globals.fonts.secondary.style,
  },
  originalPrice: {
    color: globals.styles.colors.colorGrayDark,
    fontSize: 28,
    textTransform: 'uppercase',
    textDecorationLine: 'line-through',
    ...globals.fonts.secondary.style,
  },
  subInfoPriceYear: {
    fontSize: 35,
    textTransform: 'uppercase',
    ...globals.fonts.secondary.style,
  },
  subInfoPriceDay: {
    color: globals.styles.colors.colorBlack,
    fontSize: 14,
    marginBottom: 24,
    ...globals.fonts.primary.style,
  },
  chevron: {
    marginHorizontal: 16,
  },
  discountContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 35,
  },
  discountText: {
    fontSize: 16,
    color: globals.styles.colors.colorWhite,
    ...globals.fonts.primary.boldStyle,
  },
})
