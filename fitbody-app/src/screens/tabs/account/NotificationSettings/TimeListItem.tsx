import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import moment from 'moment'

import TimeIcon from '../../../../../assets/images/svg/icon/24px/time.svg'
import TrashIcon from '../../../../../assets/images/svg/icon/16px/trash.svg'

import globals from '../../../../config/globals'
import { ButtonOpacity } from '../../../../components/Buttons/ButtonOpacity'

interface ITileListItemProps {
  onPress: () => void
  time: string
}
export const TimeListItem: React.FC<ITileListItemProps> = ({ onPress, time }) => {
  return (
    <View style={styles.container}>
      <View style={styles.rowCenter}>
        <TimeIcon color={globals.styles.colors.colorWhite} />
        <Text style={styles.text}>{moment().startOf('day').add(moment.duration(time)).format('hh:mm A')}</Text>
      </View>
      <ButtonOpacity onPress={onPress} testID="del_button">
        <TrashIcon color={globals.styles.colors.colorWhite} />
      </ButtonOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginBottom: 7,
    backgroundColor: globals.styles.colors.colorSkyBlue,
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  text: { marginLeft: 15, fontWeight: 'bold', color: globals.styles.colors.colorWhite },
})
