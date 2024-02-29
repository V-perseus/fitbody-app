import React from 'react'
import { View, Text, FlatList } from 'react-native'
import { TableProps } from './types'
import { createStyles } from './styles'
import globals from '../../../../config/globals'

const WeightTrackHistoryTable: React.FC<TableProps> = ({ data, bgColor = globals.styles.colors.colorPink }) => {
  const styles = createStyles(bgColor)
  const headerTexts = ['Sets', 'Reps', 'Weight']

  return (
    <View style={styles.container}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        {headerTexts.map((text, index) => (
          <View key={index} style={styles.textWrapper}>
            <Text style={styles.headerText}>{text}</Text>
          </View>
        ))}
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <View style={styles.textWrapper}>
              <Text style={[styles.tableText, styles.headerText]}>{item.set}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.tableText}>{item.reps}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.tableText}>{item.weight}</Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}

export default WeightTrackHistoryTable
