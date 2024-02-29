/**
 * This exposes the native AudioDucking module as a JS module.
 */
import { NativeModules } from 'react-native'

const { AudioDucking } = NativeModules

interface IAudioDucking {
  duckAudio(): Promise<void>
  removeAudioDucking(): Promise<void>
}

export default AudioDucking as IAudioDucking
