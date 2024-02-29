import React, { memo, useMemo } from 'react'
import { ScrollView, Text, View } from 'react-native'

// Components

// styles
import styles from './styles'
import { SvgUri } from 'react-native-svg'

import { resolveLocalUrl } from '../../../../services/helpers'
import globals from '../../../../config/globals'

const WorkoutOverviewEquipment = (props) => {
  const { workout, isChallenge, programColor } = props

  const theArray = useMemo(() => workout.equipment, [workout])

  // console.log(programColor)

  if (theArray.length > 0) {
    return (
      <View style={styles.equipmentContainer}>
        <ScrollView
          style={styles.iconRow}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          horizontal={true}
          bounces={true}>
          {theArray.map((machine) => (
            <View key={`${machine.name}`} style={styles.iconBox}>
              <View style={styles.iconBorder}>
                <SvgUri
                  uri={resolveLocalUrl(machine.icon_url)}
                  color={isChallenge ? globals.styles.colors.colorBlack : programColor}
                  style={{
                    fontSize: 50,
                  }}
                />
              </View>
              <Text style={styles.iconName}>{machine.name.toUpperCase()}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    )
  } else {
    return <View />
  }
}

export default memo(WorkoutOverviewEquipment)
