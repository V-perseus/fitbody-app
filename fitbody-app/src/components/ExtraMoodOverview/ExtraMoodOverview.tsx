import React from 'react'
import { View, FlatList, Text, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import * as _ from 'lodash'

// Assets
import styles from './styles'
import globals from '../../config/globals'
import AddIcon from '../../../assets/images/svg/icon/24px/add.svg'
import { MoodsIconMap } from '../../config/svgs/dynamic/moodsMap'

import { moodsSelector } from '../../data/journal/selectors'

interface IExtraMoodOverview {
  onAdd?: () => void
  extraMoods: { id: number; order: number }[]
  editable?: boolean
}
const ExtraMoodOverview = ({ onAdd, extraMoods, editable }: IExtraMoodOverview) => {
  const moods = useSelector(moodsSelector)

  function renderItem({ item }: { item: { id: number; order?: number } }) {
    if (item.id < 0) {
      return renderAddButton()
    }

    const itemObj = moods.find((mood) => mood.id === item.id) || { name: 'Unknown', icon_key: 'happy' }
    const SvgIcon = MoodsIconMap[itemObj.icon_key]

    return (
      <View style={styles.tile}>
        <SvgIcon color={globals.styles.colors.colorWhite} />
        <Text style={styles.tileText}>{itemObj.name.toUpperCase()}</Text>
      </View>
    )
  }

  const renderAddButton = () => {
    return (
      <TouchableOpacity onPress={onAdd} style={styles.addButtonContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AddIcon color={globals.styles.colors.colorGrayDark} />
          <Text style={styles.addButton}>ADD MOOD</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const keyExtractor = (data: { id: number }, index: number) => `mood-overview-${index}-${data.id}`

  if (_.isEmpty(extraMoods)) {
    return <View style={styles.container}>{renderAddButton()}</View>
  }

  return (
    <View style={editable ? styles.listContainer : styles.nonEditableListContainer}>
      <FlatList
        contentContainerStyle={editable ? styles.listContent : styles.nonEditableListContent}
        data={onAdd ? [{ id: -1 }, ...extraMoods] : extraMoods}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
      />
    </View>
  )
}

export default ExtraMoodOverview
