import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { View, StatusBar, StyleSheet, useWindowDimensions } from 'react-native'
import Orientation from 'react-native-orientation-locker'
import { ResizeMode, Video as ExpoVideo } from 'expo-av'
import { useRemoteMediaClient } from 'react-native-google-cast'
import moment from 'moment'
import KeepAwake from 'react-native-keep-awake'
import { NavigationProp, RouteProp } from '@react-navigation/native'

// Services
import { displayLoadingModal, hideLoadingModal } from '../../../services/loading'
import { submitCompletion } from '../../../data/workout'

// Components
import VideoPlayer from './Video/index'

// Assets
import globals from '../../../config/globals'
import { createCompletion, VIDEO_CATEGORIES } from '../helpers'

// Hooks
import { useAppSelector } from '../../../store/hooks'
import { useStateSafe } from '../../../services/hooks/useStateSafe'
import { useSegmentLogger } from '../../../services/hooks/useSegmentLogger'

// Types
import { MainStackParamList, ModalsStackParamList } from '../../../config/routes/routeTypes'

interface IVideoScreenProps {
  navigation: NavigationProp<MainStackParamList>
  route: RouteProp<ModalsStackParamList, 'Video'>
}
export const Video: React.FC<IVideoScreenProps> = ({ navigation, route }) => {
  // Hooks
  const dispatch = useDispatch()
  const { width, height } = useWindowDimensions()
  const client = useRemoteMediaClient()
  const { logVideoCompleted, completionShown } = useSegmentLogger()

  // Params
  const video = route.params?.video
  const completionCallback = route.params?.onComplete ?? null
  const type = route.params?.type
  const category = route.params?.category ?? ''
  const skipCompletionLogging = route.params?.skipCompletionLogging ?? null

  // State
  const completions = useAppSelector((state) => state.data.workouts.completions)
  const [hasCompleted, setHasCompleted] = useStateSafe(false)

  // Refs
  const videoPlayerRef = useRef<ExpoVideo | null>(null)

  const hasPreviouslyCompleted = [...completions]
    ?.reverse()
    .find((c) => c.is_video && c.date === moment().format('YYYY-MM-DD') && c.video_id === video.id)

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  const onLoadStart = () => {
    dispatch(displayLoadingModal)
  }

  // called after onLoad
  const onReadyForDisplay = async () => {
    Orientation.lockToLandscapeLeft()
    dispatch(hideLoadingModal)
  }

  const handleSubmitCompletion = (currentPostion: number) => {
    if ((!hasPreviouslyCompleted || hasPreviouslyCompleted.hidden) && !skipCompletionLogging) {
      // console.log('LOG COMPLETION FOR', video, 'at', currentPostion)
      const completionData = createCompletion(video, currentPostion)
      submitCompletion(completionData)
    }
  }

  const closePlayer = async () => {
    try {
      Orientation.lockToPortrait()
      if (client) {
        client.stop()
      }
      setTimeout(() => {
        // prevent the screen transition from happening before the overlay has faded out
        if (completionCallback && hasCompleted) {
          completionCallback()
          // segment event for when an on-demand video was watched to > COMPLETE_AT percentage
          completionShown(video, type, category)
        }
        navigation.goBack()
      }, 200)
    } catch (error) {
      console.log('CLOSE ERROR', error)
    }
  }

  const handleLogCompletion = () => {
    setHasCompleted(true)
    logVideoCompleted(video, type, category)
  }

  if (video) {
    return (
      <View style={styles.container}>
        <KeepAwake />
        <StatusBar hidden />

        <VideoPlayer
          autoHidePlayer={false}
          activityIndicator={{
            color: globals.styles.colors.colorPink,
          }}
          videoProps={{
            shouldPlay: true,
            isLooping: false,
            resizeMode: ResizeMode.CONTAIN,
            ref: videoPlayerRef,
            progressUpdateIntervalMillis: 1000,
            onReadyForDisplay,
            onLoadStart: onLoadStart,
            onError: (err) => {
              console.log(err)
              dispatch(hideLoadingModal)
            },
            source: {
              uri: video.video_data.HLS_GROUP[0],
              // uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            },
          }}
          videoMetadata={video}
          onDidJustFinish={handleLogCompletion}
          onSubmitCompletion={handleSubmitCompletion}
          onCompletionBodyPress={closePlayer}
          slider={{
            minimumTrackTintColor: globals.styles.colors.colorWhite,
          }}
          style={{
            width: width,
            height: height,
          }}
          fullscreen={{
            visible: false,
          }}
          completionBody={type === VIDEO_CATEGORIES.ON_DEMAND}
        />
      </View>
    )
  } else {
    return <View style={{ ...globals.window, backgroundColor: globals.styles.colors.colorBlackDark }} />
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: globals.styles.colors.colorBlackDark,
  },
})
