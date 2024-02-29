import React from 'react'
import { useSelector } from 'react-redux'
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import Modal from 'react-native-modal'
import moment from 'moment'

// Assets
import styles from './styles'
import globals from '../../config/globals'
import CloseIcon from '../../../assets/images/svg/icon/24px/close.svg'
import GroceryIcon from '../../../assets/images/svg/icon/32px/grocery.svg'

const GroceryModal = ({ showModal, closeModal, modalType, selectDayHandler, selectedDays, createButtonHandler }) => {
  const mealPlans = useSelector((state) => state.data.meal.mealPlans)

  const renderWeek = (isThisWeek) => {
    const today = moment()
    const weekStart = today.clone().startOf('week')
    const weekEnd = today.clone().endOf('week')
    const days = []

    for (let i = 0; i <= 6; i++) {
      const day = isThisWeek ? moment(weekStart).add(i, 'd') : moment(weekEnd).add(i + 1, 'd')

      const currentDaysMeals = mealPlans[day.year()]?.[day.month()]?.[day.date()]?.data?.items?.length > 0

      const disabled = !currentDaysMeals || day.isBefore(today, 'day')

      const dateTextStyles = [styles.dateLabel, disabled && styles.disabledDateLabel]

      const dateWrapperStyles = [
        styles.dateWrapper,
        selectedDays.findIndex((d) => d.isSame(day)) >= 0 && styles.activeDate,
        disabled && styles.disabledDate,
      ]

      days.push(
        <View key={i} style={styles.date}>
          <Text style={styles.weekDay}>{day.format('ddd')}</Text>
          <TouchableOpacity style={dateWrapperStyles} onPress={disabled ? null : () => selectDayHandler(day)}>
            <Text style={dateTextStyles}>{day.format('D')}</Text>
          </TouchableOpacity>
        </View>,
      )
    }
    return days
  }

  return (
    <Modal isVisible={showModal} backdropOpacity={0.5} onBackdropPress={closeModal} style={styles.modal}>
      {modalType === 0 ? (
        <View style={styles.modalContainer}>
          <View style={styles.modalContents}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <CloseIcon width={25} height={25} color={globals.styles.colors.colorBlack} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Grocery List</Text>
            <Text style={styles.modalDescription}>Pick days to add ingredients from so we can build a grocery list for you!</Text>
            <Text style={styles.weekHeader}>This Week</Text>
            <View style={styles.weekDays}>{renderWeek(true)}</View>
            <Text style={styles.weekHeader}>Next Week</Text>
            <View style={styles.weekDays}>{renderWeek(false)}</View>
            <TouchableOpacity style={styles.modalButton} onPress={createButtonHandler}>
              <Text style={styles.modalButtonText}>CREATE GROCERY LIST</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.modalContainerEmpty}>
          <View style={styles.alertBox}>
            <GroceryIcon color={globals.styles.colors.colorBlack} />
            <View style={styles.alertMsgs}>
              <Text style={styles.alertBold}>
                No Items. <Text style={styles.alert}>The days you selected did not have any meal sets added.</Text>
              </Text>
            </View>
          </View>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.backgroundClose} />
          </TouchableWithoutFeedback>
        </View>
      )}
    </Modal>
  )
}

export default GroceryModal
