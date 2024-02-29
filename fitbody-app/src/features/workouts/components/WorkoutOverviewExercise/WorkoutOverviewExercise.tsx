import React, { memo, useMemo, useRef, useEffect, useState } from 'react'
import { Text, View, Image, StyleSheet, Platform, ActivityIndicator } from 'react-native'
import Video from 'react-native-video'
import { ResizeMode, Video as VideoIOS } from 'expo-av'
import DeviceInfo from 'react-native-device-info'
import * as Sentry from '@sentry/react-native'

// Components
import ExerciseInfoBox from '../ExerciseInfoBox'

// Services
import { resolveLocalUrl } from '../../../../services/helpers'

// styles
import styles from './styles'
import globals from '../../../../config/globals'

// Types
import { ICircuitExercise, IProgram, ITrainer } from '../../../../data/workout/types'

interface IWorkoutOverviewExerciseProps {
  last: boolean
  active?: boolean
  exercise: ICircuitExercise
  program: IProgram
  trainer: ITrainer
  unit: string
}
const WorkoutOverviewExercise: React.FC<IWorkoutOverviewExerciseProps> = memo((props) => {
  const [paused, setPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const containerStyle = useMemo(
    () => [styles.container, !props.last ? { borderBottomWidth: 1, borderBottomColor: globals.styles.colors.colorGray } : null],
    [props.last],
  )

  const imageUrl = useMemo(() => ({ uri: resolveLocalUrl(props.exercise.exercise.image_url) }), [props.exercise])
  const videoUrl = useMemo(() => ({ uri: resolveLocalUrl(props.exercise.exercise.video_url, false) }), [props.exercise])
  const videoUrlIOS = useMemo(() => ({ uri: resolveLocalUrl(props.exercise.exercise.video_url, true) }), [props.exercise])

  const videoIOSRef = useRef<VideoIOS>(null)

  useEffect(() => {
    if (props.active) {
      videoIOSRef && videoIOSRef.current?.playAsync()
      setPaused(false)
    } else {
      videoIOSRef && videoIOSRef.current?.pauseAsync()
      setPaused(true)
    }
  }, [props.active])

  // const Placeholder = () => <View style={{ height: 190, width: 190, backgroundColor: globals.styles.colors.colorGrayLight }} />

  // Rise and Move programs
  const restrictedXRProgramIds = [10, 12]

  return (
    <View style={containerStyle}>
      <Text style={styles.titleText}>{(props.exercise.exercise.title || '').toUpperCase()}</Text>
      <View style={styles.videoContainer}>
        {/*
          For older androids, iPhone XR with its inherent memory issues, or if this
          component is current offscreen in a carousel, we use an image placeholder
          to prevent large amounts of videos from causing memory issues.
        */}
        {(Platform.OS === 'android' && Platform.Version < 26) ||
        (DeviceInfo.getModel() === 'iPhone XR' && restrictedXRProgramIds.includes(props.program.id)) ||
        !props.active ? (
          <Image style={styles.image} source={imageUrl} />
        ) : props.exercise.exercise.video_url !== null ? (
          Platform.OS === 'ios' ? (
            <>
              <ActivityIndicator color={globals.styles.colors.colorPink} style={{ display: isLoading ? 'flex' : 'none' }} />
              <VideoIOS
                ref={videoIOSRef}
                source={videoUrlIOS}
                rate={1.0}
                isMuted={true}
                resizeMode={ResizeMode.COVER}
                onReadyForDisplay={() => setIsLoading(false)}
                // onError={(error) => Sentry.captureException(new Error(JSON.stringify(error)))}
                onError={(error) => {
                  console.log(error)
                }}
                shouldPlay={true}
                isLooping
                style={StyleSheet.absoluteFillObject}
              />
            </>
          ) : (
            <>
              <ActivityIndicator color={globals.styles.colors.colorPink} style={{ display: isLoading ? 'flex' : 'none' }} />
              <Video
                // poster={Placeholder}
                source={videoUrl}
                resizeMode={'cover'}
                hideShutterView={true}
                onLoad={() => setIsLoading(false)}
                rate={1.0}
                muted
                // onError={(error: any) => Sentry.captureException(new Error(JSON.stringify(error)))}
                onError={(error: any) => {
                  console.log(error)
                }}
                paused={paused}
                repeat
                style={{ width: 190, height: 190, backgroundColor: globals.styles.colors.colorWhite, display: isLoading ? 'none' : 'flex' }}
                useTextureView={false}
              />
            </>
          )
        ) : null}
      </View>
      <ExerciseInfoBox unit={props.unit} trainer={props.trainer} program={props.program} exercise={props.exercise} />
    </View>
  )
})

export default WorkoutOverviewExercise
