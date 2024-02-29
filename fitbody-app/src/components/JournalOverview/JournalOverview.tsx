import React, { Fragment } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import moment from 'moment'

// styles
import globals from '../../config/globals'
import styles from './styles'

// Components
import ExtraMoodOverview from '../ExtraMoodOverview'
import ActivityOverview from '../ActivityOverview'

// Services
import { journalsSelector } from '../../data/journal/selectors'
import { sortMoodByOrder } from '../../services/helpers'

interface IJournalOverview {
  date: string
}
const JournalOverview = ({ date = moment().format('YYYY-MM-DD') }: IJournalOverview) => {
  const journals = useSelector(journalsSelector)
  const journal = journals.find((j) => j.entry_date === date)

  return (
    <View style={styles.container}>
      {journal ? (
        <Fragment>
          <View style={{ flex: 1 }}>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: globals.styles.colors.colorGray,
              }}>
              <Text style={styles.activityTitle}>TODAY I FEEL:</Text>
              <ExtraMoodOverview
                extraMoods={[{ id: journal.main_mood_id || 1, order: 0 }, ...[...journal.mood_items].sort(sortMoodByOrder)]}
              />
            </View>
            {journal.journal_activity_ids?.length > 0 && (
              <Fragment>
                <Text style={styles.activityTitle}>TODAY I:</Text>
                <ActivityOverview myActivities={journal.journal_activity_ids} />
              </Fragment>
            )}
          </View>
          <View>
            {journal.accomplished_today?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SOMETHING I ACCOMPLISHED TODAY:</Text>
                <Text style={styles.input}>{journal.accomplished_today}</Text>
              </View>
            )}
            {journal.accomplish_tmrw?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SOMETHING I WANT TO DO TOMORROW:</Text>
                <Text style={styles.input}>{journal.accomplish_tmrw}</Text>
              </View>
            )}
            {journal.proud_of_today?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SOMETHING I’M PROUD OF TODAY:</Text>
                <Text style={styles.input}>{journal.proud_of_today}</Text>
              </View>
            )}
            {journal.additional_thoughts?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>ADDITIONAL THOUGHTS</Text>
                <Text style={styles.input}>{journal.additional_thoughts}</Text>
              </View>
            )}
          </View>
        </Fragment>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: 21 }}>
          <TouchableOpacity>
            <View style={styles.addButton}>
              <Text style={styles.addButtonText}>ADD JOURNAL ENTRY</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default JournalOverview
