import React from 'react'
import { View, Text } from 'react-native'
import Modal from 'react-native-modal'

// Components
import { ButtonSquare } from '../Buttons/ButtonSquare'

// Assets
import styles from './styles'

interface IMealPlanModalProps {
  onClose: () => void
  showModal: boolean
  modalText: string
  noButtonText: string
  noButtonPressHandler: () => void
  yesButtonText: string
  yesButtonPressHandler: () => void
}
const MealPlanModal: React.FC<IMealPlanModalProps> = ({
  onClose,
  showModal,
  modalText,
  noButtonText,
  noButtonPressHandler,
  yesButtonText,
  yesButtonPressHandler,
}) => (
  <Modal isVisible={showModal} backdropOpacity={0.5} onBackdropPress={onClose} useNativeDriver={true} testID="modal_bg">
    <View style={styles.modalContents}>
      <Text style={styles.modalTitle}>{modalText}</Text>
      <View style={styles.modalButtons}>
        <ButtonSquare style={styles.modalButton1} text={noButtonText} textStyle={styles.modalButtonText} onPress={noButtonPressHandler} />
        <ButtonSquare
          style={styles.modalButton2}
          text={yesButtonText}
          textStyle={{ ...styles.modalButtonText, ...styles.textColor2 }}
          onPress={yesButtonPressHandler}
        />
      </View>
    </View>
  </Modal>
)

export default MealPlanModal
