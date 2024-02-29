import React, { useLayoutEffect, useRef } from 'react'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
  TextInput,
  Alert,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import BarcodeMask from 'react-native-barcode-mask'

// styles
import styles from './styles'
import globals from '../../../../config/globals'

// Components
import BarcodeIcon from '../../../../../assets/images/svg/icon/24px/barcode.svg'
import CloseIcon from '../../../../../assets/images/svg/icon/24px/close.svg'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

import * as zebra from '../../../../services/helpers/zebra'

import api from '../../../../services/api'
import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'

interface IBarcodeScanProps {
  navigation: any
}
export default function BarcodeScan({ navigation }: IBarcodeScanProps) {
  const [scanned, setScanned] = React.useState(false)
  const [barcode, setBarcode] = React.useState('')

  const cameraRef = useRef<RNCamera>(null)
  /**
   * Navigation
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          <Text style={globals.header.headerTitleStyle}>BARCODE</Text>
          <Text style={styles.headerSubtitleStyle}>for US and Canadian products only</Text>
        </View>
      ),
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
    })
  }, [navigation])

  const handleAddFood = async (id: string) => {
    const data = await api.eating.ingredientDetails({ id })
    if (data.error) {
      setScanned(false)
      cameraRef.current?.resumePreview()

      Alert.alert('Invalid Barcode', "Sorry, we couldn't find a match for this barcode", [
        {
          text: 'Dismiss',
          onPress: () => {},
        },
      ])
    } else {
      const ingredient = data
      setScanned(false)
      cameraRef.current?.resumePreview()
      navigation.navigate('FoodMacros', { ingredient })
    }
  }

  const handleQRCode = () => {
    setScanned(false)
    cameraRef.current?.resumePreview()
  }

  function handleBarcodeRead(result: BarCodeReadEvent) {
    if (!scanned) {
      cameraRef.current?.pausePreview()
      setScanned(true)

      console.log('RESULT', result.type)
      try {
        const parsed = zebra.parse(result.data)
        console.log('PARSED', parsed)

        if (parsed.type === zebra.TYPE_QR) {
          // ignore qr codes
          handleQRCode()
          return
        }
        if (parsed.type === zebra.TYPE_UPCA) {
          handleAddFood(parsed.code)
        } else if (parsed.type === zebra.TYPE_EAN8 || parsed.type === zebra.TYPE_EAN13 || parsed.type === zebra.TYPE_UPCE) {
          const upca = parsed.toUPCA()
          handleAddFood(upca.code)
        }
      } catch (e) {
        console.log('WHAT E', e)
        Alert.alert('Invalid Barcode', "Sorry, we couldn't find a match for this barcode", [
          {
            text: 'Dismiss',
            onPress: () => {
              setScanned(false)
              cameraRef.current?.resumePreview()
            },
          },
        ])
      }
    }
  }

  function handleManualBarcodeSubmit({ nativeEvent: { text } }: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
    try {
      const parsed = zebra.parse(text)
      if (parsed.type === zebra.TYPE_UPCA) {
        handleAddFood(parsed.code)
      } else if (parsed.type === zebra.TYPE_EAN8 || parsed.type === zebra.TYPE_EAN13 || parsed.type === zebra.TYPE_UPCE) {
        const upca = parsed.toUPCA()
        handleAddFood(upca.code)
      }
    } catch (e) {
      Alert.alert('Invalid Barcode', "Sorry, we couldn't find a match for this barcode", [
        {
          text: 'Dismiss',
          onPress: () => {
            setScanned(false)
            cameraRef.current?.resumePreview()
          },
        },
      ])
    }
  }

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="dark-content" />
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onBarCodeRead={handleBarcodeRead}

        // onGoogleVisionBarcodesDetected={({ barcodes }) => {
        //   console.log(barcodes)
        // }}
      >
        <BarcodeMask
          width={250}
          height={250}
          // showAnimatedLine={!this.state.scanned}
          animatedLineColor={globals.styles.colors.colorPink}
          animatedLineHeight={10}
          edgeBorderWidth={2}
          backgroundColor={'rgba(0, 0, 0, 0.3)'}
        />
      </RNCamera>
      <KeyboardAvoidingView style={styles.inputView} behavior="position" keyboardVerticalOffset={40}>
        <View style={styles.barcodeInput}>
          <BarcodeIcon color={globals.styles.colors.colorBlack} width={25} height={25} />
          <TextInput
            style={styles.manualInput}
            placeholder="Manually Enter Barcode"
            placeholderTextColor={globals.styles.colors.colorGrayDark}
            value={barcode}
            keyboardType="numeric"
            returnKeyType="done"
            onChangeText={setBarcode}
            onSubmitEditing={handleManualBarcodeSubmit}
          />
          {barcode !== '' && (
            <TouchableOpacity onPress={() => setBarcode('')}>
              <CloseIcon color={globals.styles.colors.colorBlack} width={25} height={25} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}
