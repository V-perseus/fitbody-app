import React, { useEffect, useState, memo, useCallback, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { ms, vs } from 'react-native-size-matters/extend'
import { Audio, AVPlaybackStatus } from 'expo-av'

import BottomUpPanel from '../../../../components/BottomUpPanel'
import { ButtonOpacity } from '../../../../components/Buttons/ButtonOpacity'

import SoundOnIcon from '../../../../../assets/images/svg/icon/40px/audio-on.svg'
import SoundOffIcon from '../../../../../assets/images/svg/icon/40px/audio-off.svg'
import CloseIcon from '../../../../../assets/images/svg/icon/24px/close.svg'
import globals from '../../../../config/globals'

interface IProperFormTipsProps {
  content: string
  audioUrl: string
  autoplayEnabled: boolean
  onOpenStateChange?: (open: boolean) => void
  open?: boolean
  disabled: boolean
}
function ProperFormTips({ content, audioUrl, autoplayEnabled, onOpenStateChange, open = false, disabled = false }: IProperFormTipsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(open)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [sound, setSound] = useState<Audio.Sound | null>(null)

  const handleStatusChange = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      setIsPlaying(false)
      sound?.unloadAsync()
    }
  }

  const play = async () => {
    if (isPlaying) {
      await stopAndUnload()
    }
    if (audioUrl) {
      const { sound: s } = await Audio.Sound.createAsync({ uri: audioUrl }, {}, handleStatusChange)
      setSound(s)
      setIsPlaying(true)
      await s.playAsync()
    }
  }

  const stop = async () => {
    try {
      setIsPlaying(false)
      await sound?.stopAsync()
    } catch (error) {}
  }

  const init = async () => {
    if (autoplayEnabled && audioUrl) {
      play()
    } else if (isPlaying) {
      stopAndUnload()
    }
  }

  const stopAndUnload = async () => {
    try {
      if (isPlaying) {
        await stop()
      }
      await sound?.unloadAsync()
    } catch (error) {}
  }

  useFocusEffect(
    useCallback(() => {
      // init()
    }, [audioUrl, autoplayEnabled]),
  )

  useFocusEffect(
    useCallback(() => {
      return sound
        ? () => {
            sound.unloadAsync()
          }
        : undefined
    }, [sound, audioUrl]),
  )

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  function handleAnimStart(val: boolean) {
    disabled ? null : onOpenStateChange?.(val)
  }

  function renderHeader() {
    return (
      <View style={styles.headerContainer}>
        {isOpen && (
          <View style={styles.headerButtonContainer}>
            {/* {isPlaying ? (
              <ButtonOpacity onPress={stop} testID="stop">
                <SoundOffIcon color={globals.styles.colors.colorBlack} />
              </ButtonOpacity>
            ) : (
              <ButtonOpacity onPress={play} testID="play">
                <SoundOnIcon color={globals.styles.colors.colorPink} />
              </ButtonOpacity>
            )} */}
          </View>
        )}
        <Text
          style={{
            fontFamily: globals.fonts.primary.boldStyle.fontFamily,
            fontSize: 18,
            flexGrow: 1,
            textAlign: 'center',
            marginTop: -5,
            color: disabled ? globals.styles.colors.colorGrayDark : globals.styles.colors.colorBlack,
          }}>
          Proper Form Tips
        </Text>
        {isOpen && (
          <View style={styles.headerButtonContainer}>
            <CloseIcon style={{ marginLeft: 'auto' }} color={globals.styles.colors.colorBlack} />
          </View>
        )}
      </View>
    )
  }

  function renderContent() {
    return (
      <View style={styles.contentContainer}>
        <View style={{ paddingHorizontal: 48 }}>
          <Text style={styles.tipText}>{content}</Text>
        </View>
      </View>
    )
  }

  return (
    <BottomUpPanel
      containerStyle={styles.panelContainer}
      isOpen={disabled ? false : isOpen}
      customHeader={renderHeader}
      content={renderContent}
      startHeight={vs(150)}
      topEnd={globals.window.height - ms(340)}
      onAnimationStart={handleAnimStart}
      contentContainerStyle={{ height: 156, borderWidth: 0 }}
      disabled={disabled}
      fadeScrollContent={true}
      showVerticalScrollIndicator={true}
      bounces={true}
    />
  )
}

export default memo(ProperFormTips)

const styles = StyleSheet.create({
  headerContainer: { flexDirection: 'row', paddingHorizontal: 16, height: 49, backgroundColor: globals.styles.colors.colorWhite },
  headerButtonContainer: { height: 48, width: 48 },
  panelContainer: {
    bottom: 20,
    zIndex: 0,
    height: globals.window.height - ms(440),
  },
  contentContainer: { marginTop: 5, marginBottom: 40 },
  tipText: { fontSize: 14, fontFamily: globals.fonts.primary.style.fontFamily, color: globals.styles.colors.colorBlack },
})
