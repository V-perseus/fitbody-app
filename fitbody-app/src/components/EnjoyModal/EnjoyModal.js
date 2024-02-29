import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import Modal from 'react-native-modal'
import Rate, { AndroidMarket } from 'react-native-rate'

import styles from './styles'

const EnjoyModal = (props) => {
  const [visible, setVisible] = useState(props.isVisible)

  useEffect(() => {
    setVisible(props.isVisible)
  }, [props.isVisible])

  const [flow, setFlow] = useState(0)

  const close = (result) => {
    setVisible(false)
    props.onClose ? props.onClose(result) : null
  }

  function onYes() {
    if (Platform.OS === 'ios') {
      // You can't actually rate the app in development
      Rate.rate(
        {
          AppleAppID: '1281856473',
          preferInApp: true,
          openAppStoreIfInAppFails: true,
        },
        (success) => {
          // this technically only tells us if the user successfully went to the Review popup.
          // Whether they actually did anything, we do not know.
          close(Result.DONE)
        },
      )
    } else {
      setFlow(1)
    }
  }

  function onAbsolutely() {
    Rate.rate(
      {
        GooglePackageName: 'com.bodylovegroupllc.bodylove',
        preferredAndroidMarket: AndroidMarket.Google,
      },
      () => close(Result.DONE),
    )
  }

  return (
    <Modal
      onBackdropPress={() => close(Result.REMIND)}
      onBackButtonPress={() => close(Result.REMIND)}
      backdropOpacity={0.5}
      useNativeDriver={true}
      animationIn="fadeIn"
      animationOut="fadeOut"
      isVisible={visible}>
      <View style={styles.containerView}>
        <Text style={styles.title}>{flow === 0 ? 'Are you loving the\nFit Body App?' : "Yay! We're so happy hear!"}</Text>
        {flow === 1 ? <Text style={styles.subtitle}>Would you mind taking a minute to share{'\n'}your love in a review?</Text> : null}

        {flow === 0 ? (
          <View style={styles.popupContainer}>
            <View style={styles.buttonPositive}>
              <TouchableOpacity onPress={onYes}>
                <Text style={styles.textPositive}>YES!</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonNegative}>
              <TouchableOpacity onPress={() => close(Result.NO_ENJOY)}>
                <Text style={styles.textNegative}>NO</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {flow === 1 ? (
          <View style={styles.popupContainer}>
            <View style={styles.buttonPositive}>
              <TouchableOpacity onPress={onAbsolutely}>
                <Text style={styles.textPositive}>ABSOLUTELY!</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonNegative}>
              <TouchableOpacity onPress={() => close(Result.NO)}>
                <Text style={styles.textNegative}>NO THANKS</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <TouchableOpacity onPress={() => close(Result.REMIND)}>
          <Text style={styles.remindText}>REMIND ME LATER</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export const Result = Object.freeze({
  REMIND: Symbol('REMIND_ME'),
  YES: Symbol('YES'),
  NO_ENJOY: Symbol('NOENJOY'),
  NO: Symbol('NO'),
  DONE: Symbol('DONE'),
})

export default EnjoyModal
