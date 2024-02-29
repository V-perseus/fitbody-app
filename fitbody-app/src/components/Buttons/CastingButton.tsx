import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import GoogleCast, { useDevices, useCastDevice, CastContext, CastButton } from 'react-native-google-cast'
import Modal from 'react-native-modal'

import CastIcon from '../../../assets/images/svg/icon/24px/cast/cast.svg'
import CastActiveIcon from '../../../assets/images/svg/icon/24px/cast/cast-active.svg'
import CastDevice from '../../../assets/images/svg/icon/24px/cast/cast-device.svg'

import globals from '../../config/globals'

import { ButtonOpacity } from './ButtonOpacity'

interface ICastingButtonProps {
  size?: number
  color?: string
}
const CastingButton: React.FC<ICastingButtonProps> = ({ size = 28, color = globals.styles.colors.colorWhite }) => {
  const castDevice = useCastDevice()
  const devices = useDevices()
  const sessionManager = GoogleCast.getSessionManager()
  const discoveryManager = GoogleCast.getDiscoveryManager()

  const [showDevicesModal, setShowDevicesModal] = useState(false)

  useEffect(() => {
    discoveryManager.startDiscovery()
    return () => {
      discoveryManager.stopDiscovery()
    }
  }, [discoveryManager])

  // console.log('DEVICES', devices)

  async function handleCast(deviceId: string) {
    try {
      const active = deviceId === castDevice?.deviceId
      if (active) {
        await sessionManager.endCurrentSession()
      } else {
        await sessionManager.startSession(deviceId)
      }

      setShowDevicesModal(false)
    } catch (error) {
      setShowDevicesModal(false)
    }
  }

  return (
    <>
      {/*
        Having the CastButton hidden here initializes a bunch of magic as far as permissions, session creation, and auto device discovery
        however it has issues responding to press events when a child of another pressable.
      */}
      <CastButton style={{ display: 'none', opacity: 0, width: 0, height: 0, tintColor: 'transparent' }} />
      <ButtonOpacity
        onPress={() => {
          // setShowDevicesModal(true)
          CastContext.showCastDialog()
        }}
        style={{ width: size, height: size }}>
        {devices.find((device) => device.deviceId === castDevice?.deviceId) ? (
          <CastActiveIcon color={color} style={{ width: size, height: size }} />
        ) : (
          <CastIcon color={color} style={{ width: size, height: size }} />
        )}
      </ButtonOpacity>
      <Modal
        onBackdropPress={() => setShowDevicesModal(false)}
        onBackButtonPress={() => setShowDevicesModal(false)}
        backdropOpacity={0.5}
        useNativeDriver={true}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={showDevicesModal}>
        <View style={styles.containerView}>
          <Text style={styles.title}>Cast to</Text>
          <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.deviceList}>
            {devices?.length > 0 ? (
              devices.map((device) => (
                <Pressable key={device.deviceId} onPress={() => handleCast(device.deviceId)}>
                  <View style={styles.deviceListItem}>
                    <CastDevice color={globals.styles.colors.colorBlack} style={{ marginRight: 12 }} />
                    <Text style={styles.deviceListItemText}>{device.friendlyName}</Text>
                  </View>
                </Pressable>
              ))
            ) : (
              <Text style={styles.deviceListItem}>No devices found</Text>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  containerView: {
    display: 'flex',
    paddingTop: 0,
    padding: 24,
    maxHeight: globals.window.width * 0.7,
    width: globals.window.width * 0.8,
    backgroundColor: globals.styles.colors.colorWhite,
    borderRadius: 8,
    alignSelf: 'center',
  },
  title: {
    marginVertical: 10,
    fontSize: 18,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    letterSpacing: -0.43,
  },
  deviceList: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'flex-start',
    paddingTop: 12,
  },
  deviceListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  deviceListItemText: {},
})

export default CastingButton
