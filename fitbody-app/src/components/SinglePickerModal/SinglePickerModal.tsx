import React, { useEffect, useState } from 'react'
import { View, Text, TextStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Modal from 'react-native-modal'
import ScrollPicker from 'react-native-wheel-scrollview-picker'

import styles from './styles'
import globals from '../../config/globals'

import CloseIcon from '../../../assets/images/svg/icon/24px/close.svg'
import PinkButton from '../PinkButton'
import { ButtonOpacity } from '../Buttons/ButtonOpacity'

const NO_OP = () => {}
type PickerItem = { text: string; value: any } | string
interface ISinglePickerModalProps {
  selectedIndex: number
  items: PickerItem[]
  visible: boolean
  title?: string
  titleStyle?: TextStyle
  body?: string
  onClose: () => void
  onSelectedIndexChanged?: (index: number) => void | null
  onDateChange?: (date: number) => void | null
  onValueChange?: (value: any) => void | null
}
const SinglePickerModal: React.FC<ISinglePickerModalProps> = ({
  selectedIndex = 0,
  items,
  visible = false,
  title,
  titleStyle,
  body,
  onClose = NO_OP,
  onSelectedIndexChanged = null,
  onDateChange = null,
  onValueChange = null,
}) => {
  const [selected, setSelected] = useState(0)
  const [selectedItem, setSelectedItem] = useState(items[selectedIndex])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const idx = selectedIndex > -1 ? selectedIndex : 0
    setSelected(idx)
    setSelectedItem(items[idx])
  }, [selectedIndex, items])

  useEffect(() => {
    setIsModalOpen(visible)
  }, [visible])

  function handleClose() {
    setIsModalOpen(false)
    onClose()
  }

  function renderItem(data: PickerItem) {
    return (
      <View>
        <Text style={styles.date}>{typeof data === 'object' ? data?.text : data}</Text>
      </View>
    )
  }

  function handleValueChange(data: PickerItem, index: number) {
    setSelected(index)
    setSelectedItem(data)
    onSelectedIndexChanged && onSelectedIndexChanged(index)
  }

  function handleSelect() {
    onDateChange && onDateChange(selected)
    onValueChange && onValueChange(selectedItem)
    setIsModalOpen(false)
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
        <View style={styles.container}>
          {title && (
            <View style={styles.titleContainer}>
              <Text style={[styles.titleStyle, titleStyle]}>{title}</Text>
            </View>
          )}
          {body && (
            <View style={styles.bodyContainer}>
              <Text style={styles.bodyText}>{body}</Text>
            </View>
          )}
          <View style={[styles.pickerContainer, { marginTop: body ? 20 : 0 }]}>
            <View style={styles.pickerContainerInner}>
              <ScrollPicker
                // @ts-ignore
                dataSource={items}
                selectedIndex={selected}
                itemHeight={49.3}
                wrapperHeight={231.4}
                highlightColor={globals.styles.colors.colorWhite}
                // @ts-ignore
                renderItem={renderItem}
                // @ts-ignore
                onValueChange={handleValueChange}
              />
            </View>
            {/* Picker top fade effect */}
            <LinearGradient
              style={styles.gradientTop}
              colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
              pointerEvents={'none'}
            />
            {/* Picker bottom fade effect */}
            <LinearGradient
              style={styles.gradientBottom}
              colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
              pointerEvents={'none'}
            />
            {/* Selected box window */}
            <View style={styles.selectedWindow} pointerEvents={'none'}>
              <Text>{'   '}</Text>
            </View>
          </View>
          <ButtonOpacity onPress={handleClose} style={styles.closeButton}>
            <CloseIcon color={globals.styles.colors.colorBlack} />
          </ButtonOpacity>
          <PinkButton buttonStyle={styles.selectButton} handlePress={handleSelect} title={'SELECT'} />
        </View>
      ) : (
        <View />
      )}
    </Modal>
  )
}

export default SinglePickerModal
