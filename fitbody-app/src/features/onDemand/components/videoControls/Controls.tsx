import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'

import { PLAYER_STATES } from './playerStates'
import PauseIcon from '../../../../../assets/images/svg/icon/56px/circle/pause-filled.svg'
import PlayIcon from '../../../../../assets/images/svg/icon/56px/circle/play-filled.svg'
import Forward15Icon from '../../../../../assets/images/svg/icon/40px/forward-15.svg'
import Back15Icon from '../../../../../assets/images/svg/icon/40px/back-15.svg'
import globals from '../../../../config/globals'

interface IControlsProps {
  playerState: number
  onReplay: () => void
  onPause: () => void
  seekBack: () => void
  seekForward: () => void
}
export const Controls = ({ playerState, onReplay, onPause, seekBack, seekForward }: IControlsProps) => {
  const pressAction = playerState === PLAYER_STATES.ENDED ? onReplay : onPause

  return (
    <View style={styles.controlsRow}>
      <View style={styles.rowCenter}>
        <Pressable style={{ marginRight: 20 }} onPress={seekBack}>
          <Back15Icon color={globals.styles.colors.colorWhite} width={40} height={40} />
        </Pressable>
        <Pressable onPress={pressAction}>
          {playerState === PLAYER_STATES.PAUSED || playerState === PLAYER_STATES.ENDED ? (
            <PlayIcon color={globals.styles.colors.colorWhite} height={56} width={56} />
          ) : (
            <PauseIcon color={globals.styles.colors.colorWhite} height={56} width={56} />
          )}
        </Pressable>
        <Pressable style={{ marginLeft: 20 }} onPress={seekForward}>
          <Forward15Icon color={globals.styles.colors.colorWhite} width={40} height={40} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  controlsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
