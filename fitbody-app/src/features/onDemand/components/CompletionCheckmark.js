import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { ButtonOpacity } from '../../../components/Buttons/ButtonOpacity'
import DatePickerModal from '../../../components/DatePickerModal'

import CheckedIcon from '../../../../assets/images/svg/icon/32px/circle/checked.svg'
import globals from '../../../config/globals'

import { hideCompletion, submitCompletion } from '../../../data/workout'
import { createCompletion } from '../helpers'
import { useSegmentLogger } from '../../../services/hooks/useSegmentLogger'

export const CompletionCheckmark = ({ complete, item, navigation }) => {
  const { logEvent } = useSegmentLogger()
  const [showDatePicker, setShowDatePicker] = useState(false)

  const startDate = useSelector((state) => state.data.user.created_at)

  const logSegmentEvent = (name) => {
    logEvent(null, name, {
      type: 'Video Completion',
      scope: 'single',
      video_id: item.id,
    })
  }

  const removeCheckmark = () => {
    hideCompletion({ id: complete.id })
    logSegmentEvent('Check Marks Unchecked')
  }

  const addCheckmark = (date) => {
    const completion = createCompletion(item, item.duration, true, date.format('YYYY-MM-DD'))
    submitCompletion(completion)
    logSegmentEvent('Check Marks Checked')
  }

  function toggleCompletion() {
    if (complete && !complete.hidden) {
      navigation.navigate('Modals', {
        screen: 'ConfirmationDialog',
        params: {
          yesLabel: 'CLEAR',
          noLabel: 'KEEP CHECK',
          yesHandler: removeCheckmark,
          title: 'Are you sure you want to clear the check for this workout?',
        },
      })
    } else {
      setShowDatePicker(true)
    }
  }
  return (
    <>
      <ButtonOpacity onPress={toggleCompletion}>
        <CheckedIcon color={complete && !complete.hidden ? globals.styles.colors.colorPink : globals.styles.colors.colorGrayDark} />
      </ButtonOpacity>
      <DatePickerModal
        todayLink={true}
        date={moment().toDate()}
        title={'What day on the calendar do you want to add this check mark to?'}
        minDate={moment(startDate).toDate()}
        onDateChange={(date) => {
          addCheckmark(moment(date))
          setShowDatePicker(false)
        }}
        onClose={() => setShowDatePicker(false)}
        visible={showDatePicker}
      />
    </>
  )
}
