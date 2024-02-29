import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import moment, { Moment } from 'moment'

// Components
import CloseIcon from '../../../assets/images/svg/icon/24px/close.svg'

// Assets
import styles from './styles'
import globals from '../../config/globals'

interface IDIaryCopyModal {
  sourceDate: Moment
  showModal: boolean
  closeModal: () => void
  selectDayHandler: (day: Moment) => void
  selectedDays: Moment[]
  createButtonHandler: () => void
}
const DiaryCopyModal: React.FC<IDIaryCopyModal> = ({
  sourceDate,
  showModal,
  closeModal,
  selectDayHandler,
  selectedDays,
  createButtonHandler,
}) => {
  // const mealPlans = useSelector((state) => state.data.meal.mealPlans)

  const renderWeek = (isThisWeek: boolean) => {
    const today = moment()
    const weekStart = today.clone().startOf('week')
    const weekEnd = today.clone().endOf('week')
    const days: JSX.Element[] = []

    for (let i = 0; i <= 6; i++) {
      const day = isThisWeek ? moment(weekStart).add(i, 'd') : moment(weekEnd).add(i + 1, 'd')

      const disabled = day.isSame(sourceDate, 'day')
      // || mealPlans[day.year()]?.[day.month()]?.[day.date()]?.meal_set

      days.push(
        <View key={i} style={styles.date}>
          <Text style={styles.weekDay}>{day.format('ddd').toUpperCase()}</Text>
          <TouchableOpacity
            style={[
              styles.dateWrapper,
              selectedDays.findIndex((d) => d.isSame(day)) >= 0 && styles.activeDate,
              disabled && styles.disabledDate,
            ]}
            disabled={disabled}
            onPress={() => selectDayHandler(day)}>
            <Text style={[styles.dateLabel, disabled && styles.disabledDateLabel]}>{day.format('D').toUpperCase()}</Text>
          </TouchableOpacity>
        </View>,
      )
    }
    return days
  }

  return (
    <Modal isVisible={showModal} backdropOpacity={0.5} onBackdropPress={closeModal} style={{ margin: 0 }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContents}>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton} testID="close_btn">
            <CloseIcon color={globals.styles.colors.colorBlack} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Copy Selected Foods</Text>
          <Text style={styles.modalDescription}>Choose which day(s) to{'\n'}copy selected foods to.</Text>
          <Text style={styles.weekHeader}>This Week</Text>
          <View style={styles.weekDays}>{renderWeek(true)}</View>
          <Text style={styles.weekHeader}>Next Week</Text>
          <View style={styles.weekDays}>{renderWeek(false)}</View>
          <TouchableOpacity style={styles.modalButton} onPress={createButtonHandler}>
            <Text style={styles.modalButtonText}>COPY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default DiaryCopyModal
