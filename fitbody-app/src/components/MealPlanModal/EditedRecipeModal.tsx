import React from 'react'
import { View, Text } from 'react-native'
import Modal from 'react-native-modal'

// Assets
import EditedIcon from '../../../assets/images/svg/icon/16px/edited.svg'
import styles from './styles'
import globals from '../../config/globals'
import { ButtonSquare } from '../Buttons/ButtonSquare'
import { ButtonIcon } from '../Buttons/ButtonIcon'

interface IEditRecipeModalProps {
  showModal: boolean
  onClose: () => void
  noButtonPressHandler: () => void
  yesButtonPressHandler: () => void
}
const EditedRecipeModal: React.FC<IEditRecipeModalProps> = ({ showModal, onClose, noButtonPressHandler, yesButtonPressHandler }) => {
  return (
    <Modal isVisible={showModal} backdropOpacity={0.5} onBackdropPress={onClose} useNativeDriver={true} testID="modal_bg">
      <View style={[styles.modalContents, { paddingTop: 32, paddingHorizontal: 20 }]}>
        <Text style={{ fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 18, textAlign: 'center' }}>
          You previously{'\n'}edited this recipe
        </Text>
        <Text style={{ fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 14, marginTop: 16, textAlign: 'center' }}>
          Which version would you like to use?
        </Text>
        <View style={[styles.modalButtons, { marginTop: 24 }]}>
          <ButtonIcon
            style={{ ...styles.modalButton2, ...{ height: 48, paddingHorizontal: 10, marginLeft: 0 } }}
            text={'KEEP\nEDITED'}
            textStyle={{ ...styles.modalButtonText, ...styles.textColor2 }}
            useOpacity={true}
            onPress={noButtonPressHandler}
            leftIcon={() => <EditedIcon color={globals.styles.colors.colorWhite} style={{ marginRight: 8 }} />}
          />
          <ButtonSquare
            style={{ ...styles.modalButton1, ...{ height: 48, paddingHorizontal: 10, marginLeft: 12.5 } }}
            text="USE ORIGINAL"
            textStyle={{ ...styles.modalButtonText, ...styles.textColor1 }}
            onPress={yesButtonPressHandler}
          />
        </View>
      </View>
    </Modal>
  )
}

export default EditedRecipeModal
