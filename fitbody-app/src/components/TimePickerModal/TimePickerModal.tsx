import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Modal from 'react-native-modal'
import ScrollPicker from 'react-native-wheel-scrollview-picker'
import moment from 'moment'

import styles from './styles'
import globals from '../../config/globals'

import CloseIcon from '../../../assets/images/svg/icon/24px/close.svg'
import PinkButton from '../PinkButton'
import { ButtonOpacity } from '../Buttons/ButtonOpacity'

const HOURS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const MINUTES = ['00', '30']
const AMPM = ['AM', 'PM']

const NO_OP = () => {}

interface ITimePickerModalProps {
  testID?: string
  visible: boolean
  onClose: () => void
  onChange: (time: string) => void
}
const TimePickerModal: React.FC<ITimePickerModalProps> = ({ testID, visible, onClose = NO_OP, onChange = NO_OP }) => {
  const [isModalOpen, setIsModalOpen] = useState(visible)
  const [activeHourIndex, setActiveHourIndex] = useState(6)
  const [activeMinuteIndex, setActiveMinuteIndex] = useState(0)
  const [activeAmpmIndex, setActiveAmpmIndex] = useState(0)

  useEffect(() => {
    setIsModalOpen(visible)
  }, [visible])

  function handleClose() {
    setIsModalOpen(false)
    onClose()
  }

  function handleSelectTime() {
    const time = `${HOURS[activeHourIndex]}:${MINUTES[activeMinuteIndex]} ${AMPM[activeAmpmIndex]}`
    setIsModalOpen(false)
    onChange(moment(time, 'hh:mm a').format('HH:mm'))
  }

  function renderHoursItem(data: string | number) {
    return (
      <View>
        <Text style={[styles.date, { textAlign: 'right' }]}>{data}</Text>
      </View>
    )
  }

  function renderMinutesItem(data: string | number) {
    return (
      <View>
        <Text style={styles.date}>{data}</Text>
      </View>
    )
  }

  function renderAmpmItem(data: string | number) {
    return (
      <View>
        <Text style={styles.date}>{data}</Text>
      </View>
    )
  }

  return (
    <Modal
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      backdropOpacity={0.5}
      useNativeDriver={true}
      animationIn="fadeIn"
      animationOut="fadeOut"
      isVisible={isModalOpen}>
      {isModalOpen ? (
        <View testID={testID} style={styles.container}>
          <View style={styles.pickerContainer}>
            <View style={styles.hoursPickerContainer}>
              <ScrollPicker
                dataSource={HOURS}
                selectedIndex={activeHourIndex}
                itemHeight={49.3}
                wrapperHeight={345}
                highlightColor={globals.styles.colors.colorWhite}
                renderItem={renderHoursItem}
                onValueChange={(data, selectedIndex) => {
                  setActiveHourIndex(selectedIndex)
                }}
              />
            </View>
            <Text style={[styles.date, { textAlign: 'right', marginTop: 22 }]}>:</Text>
            <View style={styles.minutesPickerContainer}>
              <ScrollPicker
                dataSource={MINUTES}
                selectedIndex={activeMinuteIndex}
                itemHeight={49.3}
                wrapperHeight={345}
                highlightColor={globals.styles.colors.colorWhite}
                renderItem={renderMinutesItem}
                onValueChange={(data, selectedIndex) => {
                  setActiveMinuteIndex(selectedIndex)
                }}
              />
            </View>
            <View style={styles.ampmPickerContainer}>
              <ScrollPicker
                dataSource={AMPM}
                selectedIndex={activeAmpmIndex}
                itemHeight={49.3}
                wrapperHeight={345}
                highlightColor={globals.styles.colors.colorWhite}
                renderItem={renderAmpmItem}
                onValueChange={(data, selectedIndex) => {
                  setActiveAmpmIndex(selectedIndex)
                }}
              />
            </View>
          </View>
          {/* Top fade out effect */}
          <LinearGradient style={styles.gradientTop} colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']} pointerEvents={'none'} />
          {/* Bottom fade out effect */}
          <LinearGradient
            style={styles.gradientBottom}
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
            pointerEvents={'none'}
          />
          <ButtonOpacity testID="close_btn" onPress={handleClose} style={{ padding: 15, position: 'absolute', top: 0, right: 0 }}>
            <CloseIcon color={globals.styles.colors.colorBlack} />
          </ButtonOpacity>
          {/* Selected window box */}
          <View style={styles.selectorWindow} pointerEvents={'none'}>
            <Text>{'   '}</Text>
          </View>
          <PinkButton buttonStyle={styles.selectButton} handlePress={handleSelectTime} title={'SELECT'} />
        </View>
      ) : (
        <View />
      )}
    </Modal>
  )
}

export default TimePickerModal
