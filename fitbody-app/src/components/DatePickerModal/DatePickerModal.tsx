import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Modal from 'react-native-modal'
import ScrollPicker, { ScrollPickerRef } from 'react-native-wheel-scrollview-picker'
import moment from 'moment'

import styles from './styles'
import globals from '../../config/globals'

import Close from '../../../assets/images/svg/icon/24px/close.svg'
import PinkButton from '../PinkButton'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const NO_OP = () => {}

interface IDatePickerModalProps {
  date?: Date
  visible: boolean
  minDate?: Date | null
  maxDate?: Date
  minYear?: number | null
  todayLink?: boolean
  title?: string
  onClose: () => void
  onDateChange: (date: Date) => void
}
const DatePickerModal = ({
  date,
  visible = false,
  minDate = null,
  maxDate = new Date(),
  minYear = null,
  todayLink = false,
  title,
  onClose = NO_OP,
  onDateChange,
}: IDatePickerModalProps) => {
  const mYear = minYear ? minYear : minDate ? moment(minDate).year() : 2015

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeYear, setActiveYear] = useState(() => (date ? moment(date).year() - mYear : moment().year() - mYear))
  const [activeMonth, setActiveMonth] = useState(() => (date ? moment(date).month() : moment().month()))
  const [activeDay, setActiveDay] = useState(() => (date ? moment(date).date() - 1 : moment().date() - 1))
  const [years] = useState(new Array(maxDate.getFullYear() - mYear + 1 || 1).fill(undefined).map((k, i) => i + mYear))
  const [months, setMonths] = useState<string[]>([])
  const [days, setDays] = useState<number[]>([])

  const yearRef = useRef<ScrollPickerRef>(null)
  const monthRef = useRef<ScrollPickerRef>(null)
  const dayRef = useRef<ScrollPickerRef>(null)

  useEffect(() => {
    if (date) {
      setSelectedDate(date)
    }
  }, [date])

  useEffect(() => {
    setIsModalOpen(visible)
  }, [visible])

  const handleDateChange = () => {
    let currMonth = selectedDate.getMonth()
    if (activeMonth >= 0) {
      currMonth = activeYear === maxDate.getFullYear() - mYear && maxDate.getMonth() < activeMonth ? maxDate.getMonth() : activeMonth
    }
    const max_days_month = new Date(activeYear + mYear, currMonth + 1, 0).getDate()

    const max_days =
      activeYear === maxDate.getFullYear() - mYear && currMonth === maxDate.getMonth() && max_days_month > maxDate.getDate()
        ? maxDate.getDate()
        : max_days_month

    const currDay = activeDay >= 0 ? (activeDay > max_days - 1 ? max_days - 1 : activeDay) : selectedDate.getDate() - 1

    return new Date(activeYear + mYear, currMonth, currDay + 1)
  }

  useEffect(() => {
    const max_days_month = new Date(activeYear + mYear, activeMonth + 1, 0).getDate()
    const max_days =
      activeYear === maxDate.getFullYear() - mYear && activeMonth === maxDate.getMonth() && max_days_month > maxDate.getDate()
        ? maxDate.getDate()
        : max_days_month

    if (max_days) {
      setDays(new Array(max_days).fill(undefined).map((k, i) => i))
    }

    setMonths(activeYear === maxDate.getFullYear() - mYear ? MONTHS.slice(0, maxDate.getMonth() + 1) : MONTHS)

    const currentDate = handleDateChange()
    setSelectedDate(currentDate)
  }, [activeYear, activeDay, activeMonth])

  let shift = 12
  shift += todayLink ? 40 : 0
  shift += title ? 70 : 0

  function handleClose() {
    setIsModalOpen(false)
    onClose()
  }

  function goToToday() {
    const d = moment()
    yearRef?.current?.scrollToIndex(d.year() - mYear)
    dayRef?.current?.scrollToIndex(d.date() - 1)
    monthRef?.current?.scrollToIndex(d.month())
    setActiveMonth(d.month())
    setActiveYear(d.year() - mYear)
    setActiveDay(d.date() - 1)
  }

  function renderItem(data: string | number, style?: ViewStyle) {
    const text = String(data)
    return <ScrollPickerItem text={text} style={style} />
  }

  return (
    <Modal
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      backdropOpacity={0.5}
      useNativeDriver={true}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      isVisible={isModalOpen}>
      {isModalOpen ? (
        <View style={styles.modalContent(shift)}>
          <View style={styles.modalContentColumn}>
            {title && (
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title.toUpperCase()}</Text>
              </View>
            )}

            {todayLink && (
              <View style={styles.todayLinkContainer}>
                <TouchableOpacity onPress={goToToday}>
                  <Text style={styles.todayLinkText}>GO TO TODAY</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.pickerContainer}>
              {/* Month Picker */}
              <View style={styles.pickerContainerMonth}>
                <ScrollPicker
                  ref={monthRef}
                  dataSource={months}
                  selectedIndex={activeMonth}
                  itemHeight={49.3}
                  wrapperHeight={345 - 98.6}
                  highlightColor={globals.styles.colors.colorWhite}
                  renderItem={(data) => renderItem(data, styles.pickerContainerMonthItem)}
                  onValueChange={(data: any, selectedIndex: number) => {
                    setActiveMonth(selectedIndex)
                  }}
                />
              </View>
              {/* Day Picker */}
              <View style={styles.pickerContainerDay}>
                <ScrollPicker
                  ref={dayRef}
                  dataSource={days}
                  selectedIndex={activeDay}
                  itemHeight={49.3}
                  wrapperHeight={345 - 98.6}
                  highlightColor={globals.styles.colors.colorWhite}
                  renderItem={(data) => renderItem(+data + 1)}
                  onValueChange={(data: any, selectedIndex: number) => {
                    setActiveDay(selectedIndex)
                  }}
                />
              </View>
              {/* Year Picker */}
              <View style={styles.pickerContainerYear}>
                <ScrollPicker
                  ref={yearRef}
                  dataSource={years}
                  selectedIndex={activeYear}
                  itemHeight={49.3}
                  wrapperHeight={345 - 98.6}
                  highlightColor={globals.styles.colors.colorWhite}
                  renderItem={(data) => renderItem(data)}
                  onValueChange={(data: any, selectedIndex: number) => {
                    setActiveYear(selectedIndex)
                  }}
                />
              </View>
            </View>
          </View>
          <LinearGradient
            style={styles.gradientBottom}
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
            pointerEvents={'none'}
          />
          <LinearGradient
            style={styles.gradientTop(shift)}
            colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
            pointerEvents={'none'}
          />
          <TouchableOpacity
            onPress={() => {
              setIsModalOpen(false)
              onClose()
            }}
            testID="datepicker_close_button"
            style={styles.closeButton}>
            <Close color={globals.styles.colors.colorBlack} />
          </TouchableOpacity>
          <View style={styles.currentBorder(shift)} pointerEvents={'none'}>
            <Text>{'   '}</Text>
          </View>
          <PinkButton
            buttonStyle={styles.pinkButton}
            handlePress={() => {
              setIsModalOpen(false)
              onDateChange(selectedDate)
            }}
            title={'SELECT'}
          />
        </View>
      ) : (
        <View />
      )}
    </Modal>
  )
}

function ScrollPickerItem({ text, style }: { text: string; style?: ViewStyle }) {
  return (
    <View>
      <Text style={[styles.date, { color: 'black', fontSize: 25, marginTop: 10, marginBottom: 10 }, style]}>{text}</Text>
    </View>
  )
}

export default DatePickerModal
