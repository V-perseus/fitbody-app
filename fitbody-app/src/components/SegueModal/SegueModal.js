import React from 'react'
import { Modal, View, Text, TouchableOpacity } from 'react-native'

// Assets
import CloseIcon from '../../../assets/images/svg/icon/24px/close.svg'
import styles from './styles'
import { openLink } from '../../config/utilities'
import globals from '../../config/globals'

const nobuttonTextStyle = [styles.modalButtonText, styles.textColor1]
const yesbuttonTextStyle = [styles.modalButtonText, styles.textColor2]

const NoButtonComponent = ({ text, showModal }) => {
  return (
    <TouchableOpacity
      style={styles.modalButton1}
      onPress={() => {
        showModal(false)
      }}>
      <Text style={nobuttonTextStyle}>{text}</Text>
    </TouchableOpacity>
  )
}

const YesButtonComponent = ({ url, text, showModal }) => {
  return (
    <TouchableOpacity
      style={styles.modalButton2}
      onPress={() => {
        openLink(url)
        showModal(false)
      }}>
      <Text style={yesbuttonTextStyle}>{text}</Text>
    </TouchableOpacity>
  )
}

const SegueModal = (props) => {
  const { noButtonText, yesButtonText, url = 'fitbody.com', modalText, showModal, setShowModal } = props
  return (
    <Modal visible={showModal} animationType="slide" transparent backdropPressToClose>
      <View style={styles.modalContainer}>
        <View style={styles.modalContents}>
          <TouchableOpacity
            style={styles.cancelIcon}
            onPress={() => {
              setShowModal(false)
            }}>
            <CloseIcon color={globals.styles.colors.colorBlack} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{modalText}</Text>
          <View style={styles.modalButtons}>
            <YesButtonComponent text={yesButtonText} showModal={setShowModal} url={url} />
            <NoButtonComponent text={noButtonText} showModal={setShowModal} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default SegueModal
