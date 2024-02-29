import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Modal from 'react-native-modal'
import ScrollPicker, { ScrollPickerRef } from 'react-native-wheel-scrollview-picker'

import styles from './styles'
import globals from '../../config/globals'

import Close from '../../../assets/images/svg/icon/24px/close.svg'
import PinkButton from '../PinkButton'

const NO_OP = () => {}

interface IScrollListModalProps {
  selectedIndex?: number
  visible: boolean
  title?: string
  onClose: () => void
  onChange: (data: any) => void
  options: (string | number)[]
}
const ScrollingListModal = ({ selectedIndex = 0, visible = false, title, onClose = NO_OP, onChange, options }: IScrollListModalProps) => {
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const listRef = useRef<ScrollPickerRef>(null)

  useEffect(() => {
    if (selectedIndex) {
      setSelectedItem(selectedIndex)
    }
  }, [selectedIndex, options])

  useEffect(() => {
    setIsModalOpen(visible)
  }, [visible])

  function handleClose() {
    setIsModalOpen(false)
    onClose()
  }

  function renderItem(data: string | number) {
    const text = String(data)
    return <ScrollPickerItem text={text} style={styles.pickerContainerItem} />
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
        <View style={styles.modalContent}>
          <View style={styles.modalContentColumn}>
            {title && (
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title.toUpperCase()}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                setIsModalOpen(false)
                onClose()
              }}
              testID="scrollist_modal_close_button"
              style={styles.closeButton}>
              <Close color={globals.styles.colors.colorBlack} />
            </TouchableOpacity>

            <View style={styles.pickerContainer}>
              {/* Month Picker */}
              <ScrollPicker
                ref={listRef}
                dataSource={options}
                selectedIndex={selectedIndex}
                itemHeight={60}
                wrapperHeight={280}
                highlightColor={globals.styles.colors.colorWhite}
                renderItem={renderItem}
                onValueChange={(data: any, index: number) => {
                  setSelectedItem(index)
                }}
              />
            </View>
          </View>
          <LinearGradient
            style={styles.gradientBottom}
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
            pointerEvents={'none'}
          />
          <LinearGradient style={styles.gradientTop} colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']} pointerEvents={'none'} />
          <View style={styles.currentBorder} pointerEvents={'none'}>
            <Text>{'   '}</Text>
          </View>
          <PinkButton
            buttonStyle={styles.pinkButton}
            handlePress={() => {
              setIsModalOpen(false)
              onChange(selectedItem)
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
      <Text style={[styles.item, style]}>{text}</Text>
    </View>
  )
}

export default ScrollingListModal
