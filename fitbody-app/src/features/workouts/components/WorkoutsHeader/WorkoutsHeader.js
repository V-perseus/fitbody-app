import React from 'react'
import { View, Pressable, Text, StyleSheet, Platform } from 'react-native'
import { ms } from 'react-native-size-matters/extend'

import ChevronLeft from '../../../../../assets/images/svg/icon/16px/cheveron/left.svg'
import Checked from '../../../../../assets/images/svg/icon/32px/circle/checked.svg'
import globals from '../../../../config/globals'

export const WorkoutsHeader = ({ navigation, cardsRef, category, workouts, completedCount, checkColor }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.rowItemsCenter}
        onPress={() => {
          if (cardsRef.current) {
            cardsRef.current.fadeOutDown(200).then(navigation.goBack)
          } else {
            navigation.goBack()
          }
        }}>
        <ChevronLeft width="16" height="16" color={globals.styles.colors.colorBlack} />
        <Text style={styles.categoryTitle}>{category?.title}</Text>
      </Pressable>
      <View style={styles.rowItemsCenter}>
        {workouts.length > 0 &&
          [...Array(workouts.length)].map((_, i) => (
            <Checked
              key={i}
              style={styles.checkedIcon}
              width={ms(32, 2)}
              height={ms(32, 2)}
              color={i < completedCount ? checkColor : globals.styles.colors.colorGrayDark}
            />
          ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    height: 65,
    borderBottomColor: globals.styles.colors.colorGray,
    borderBottomWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowItemsCenter: { flexDirection: 'row', alignItems: 'center' },
  categoryTitle: {
    marginLeft: 8,
    marginTop: Platform.select({ ios: 5, android: 0 }),
    textAlign: 'left',
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 30,
  },
  checkedIcon: { marginRight: 4 },
})
