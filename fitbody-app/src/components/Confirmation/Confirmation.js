import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import Modal from 'react-native-modal'
import LinearGradient from 'react-native-linear-gradient'

import globals from '../../config/globals'

const styles = StyleSheet.create({
  container: {
    width: globals.window.width,
    paddingHorizontal: 25,
    flexDirection: 'column',
    // height: globals.window.height * 0.14,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: globals.styles.colors.colorWhite,
    fontSize: 16,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    flexDirection: 'column',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  activeButton: {
    flex: 1,
    height: 55,
    backgroundColor: globals.styles.colors.colorWhite,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 5,
  },
  activeLabel: {
    fontSize: 18,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorPink,
  },
  inactiveButton: {
    flex: 1,
    height: 55,
    borderColor: globals.styles.colors.colorWhite,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 5,
  },
  inactiveLabel: {
    fontSize: 18,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
})

const Confirmation = (props) => (
  <Modal
    testID="confirmation_modal"
    style={{ justifyContent: 'flex-end', margin: 0 }}
    onBackButtonPress={props.handleNo}
    backdropOpacity={0.5}
    useNativeDriver={true}
    animationIn="slideInUp"
    onModalHide={props.onHide}
    animationInTiming={600}
    animationOutTiming={0}
    isVisible={props.visible}>
    <LinearGradient style={[styles.container, props.style]} colors={[globals.styles.colors.colorPink, globals.styles.colors.colorLove]}>
      <Text style={styles.title}>{props.question}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.activeButton} onPress={props.handleYes}>
          <Text style={styles.activeLabel}>{props.yesText}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveButton} onPress={props.handleNo}>
          <Text style={styles.inactiveLabel}>{props.noText}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </Modal>
)

export default Confirmation
