import React, { useEffect, useRef, useState } from 'react'
import {
  // Animated,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import { AVPlaybackStatus, Video } from 'expo-av'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import CastContext, {
  CastButton,
  // CastState,
  MediaPlayerState,
  MediaStreamType,
  useCastDevice,
  useDevices,
  // useCastSession,
  // useCastState,
  useMediaStatus,
  useRemoteMediaClient,
  // useStreamPosition,
} from 'react-native-google-cast'
import { Slider } from 'react-native-awesome-slider'
import RNAnimated, { cancelAnimation, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'

// Utils
import { ControlStates, ErrorSeverity, PlaybackStates } from './constants'
import { ErrorMessage, TouchableButton, deepMerge, styles, formatTimeToMins, formatTime, secondToTime } from './utils'
import { Props, defaultProps } from './props'

// Hooks
import { useStateSafe } from '../../../../services/hooks/useStateSafe'
import { useInit } from '../../../../services/hooks/useInit'
import { useSegmentLogger } from '../../../../services/hooks/useSegmentLogger'
import { setErrorMessage } from '../../../../services/error'

// Icons
import PauseIcon from '../../../../../assets/images/svg/icon/56px/circle/pause-filled.svg'
import PlayIcon from '../../../../../assets/images/svg/icon/56px/circle/play-filled.svg'
import Forward15Icon from '../../../../../assets/images/svg/icon/40px/forward-15.svg'
import Back15Icon from '../../../../../assets/images/svg/icon/40px/back-15.svg'
import FullscreenIcon from '../../../../../assets/images/svg/icon/24px/fullscreen.svg'
import ExitFullscreenIcon from '../../../../../assets/images/svg/icon/24px/exit-fullscreen.svg'
import CloseIcon from '../../../../../assets/images/svg/icon/24px/close.svg'
import CastIcon from '../../../../../assets/images/svg/icon/24px/cast/cast.svg'
import CastActiveIcon from '../../../../../assets/images/svg/icon/24px/cast/cast-active.svg'

// Styles
import globals from '../../../../config/globals'

// Components
import { TapController } from './TapController'
// import { useSafeAreaInsets } from 'react-native-safe-area-context'

const COMPLETE_AT = 0.8 // the percentage at which to record a video completion
// const VIDEO_DEFAULT_HEIGHT = width * (9 / 16)

const VideoPlayer = (tempProps: Props) => {
  const props = deepMerge(defaultProps, tempProps) as Props

  // hooks
  const { width, height } = useWindowDimensions()
  const client = useRemoteMediaClient()
  const mediaStatus = useMediaStatus()
  const devices = useDevices()
  const castDevice = useCastDevice()
  // const castState = useCastState()
  // const castSession = useCastSession()
  // const streamPosition = useStreamPosition()
  const { logCastStarted } = useSegmentLogger()

  // State
  // const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTimeRemaining, setShowTimeRemaining] = useState(true)
  // const [hasLoggedCompletion, setHasLoggedCompletion] = useState(false)
  const [hasCompleted, setHasCompleted] = useStateSafe(false)
  const [paused, setPaused] = useState(false)
  const [currentTime, setCurrentTime] = useStateSafe(0)
  // const [loading, setIsLoading] = useState(false)
  // const [controlsState, setControlsState] = useStateSafe(props.defaultControlsVisible ? ControlStates.Visible : ControlStates.Hidden)
  const [playbackInstanceInfo, setPlaybackInstanceInfo] = useStateSafe({
    state: props.videoProps.source ? PlaybackStates.Loading : PlaybackStates.Error,
  })

  const initialShow = props.defaultControlsVisible
  const isIos = Platform.OS === 'ios'
  const header = props.header
  const completionBody = props.completionBody
  const videoDurationAsSeconds = props.videoMetadata.duration
  const controlTimeout = 3000
  const controlAnimateConfig = {
    duration: 300,
  }

  // Re-animated Values
  const controlViewOpacity = useSharedValue(initialShow ? 1 : 0)
  const isLoadEnd = useSharedValue(false)
  const cache = useSharedValue(0)
  const progress = useSharedValue(0)
  const MIN = useSharedValue(0)
  const MAX = useSharedValue(1)
  const isScrubbing = useSharedValue(false)
  // const isFullScreen = useSharedValue(false)
  // const videoScale = useSharedValue(1)
  // const videoTransY = useSharedValue(0)
  // const panIsVertical = useSharedValue(false)
  // const videoHeight = useSharedValue(width)

  // AnimatedStyles

  // const defaultVideoStyle = useAnimatedStyle(() => {
  //   const fullVideoHeight = height - insets.left - insets.right
  //   return {
  //     transform: [
  //       {
  //         scale: videoScale.value,
  //       },
  //       {
  //         translateY: videoTransY.value,
  //       },
  //     ],
  //     height: videoHeight.value,
  //     width: withTiming(isFullScreen.value ? fullVideoHeight : width, {
  //       duration: 60,
  //     }),
  //   }
  // }, [videoHeight, videoScale, videoTransY, insets])

  // const videoStyle = props.customAnimationStyle ? props.customAnimationStyle : defaultVideoStyle

  const controlViewStyles = useAnimatedStyle(() => {
    return {
      opacity: controlViewOpacity.value,
    }
  })

  // refs
  const playbackInstance = useRef<Video>(null)
  const player = useRef({ duration: 0 })
  const hasLoggedCompletion = useRef(false)

  // We need to extract ref, because of misstypes in <Slider />
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ref: sliderRef, ...sliderProps } = props.slider
  const screenRatio = props.style.width! / props.style.height!

  let videoHeight = props.style.height
  let videoWidth = videoHeight! * screenRatio

  if (videoWidth > props.style.width!) {
    videoWidth = props.style.width!
    videoHeight = videoWidth / screenRatio
  }

  useInit(() => {
    if (!props.videoProps.source) {
      console.error('[VideoPlayer] `Source` is required in `videoProps`. ' + 'Check https://docs.expo.io/versions/latest/sdk/video/#usage')
      setErrorMessage('`Source` is required in `videoProps`')
      setPlaybackInstanceInfo((p) => ({ ...p, state: PlaybackStates.Error }))
    } else {
      setPlaybackInstanceInfo((p) => ({ ...p, state: PlaybackStates.Playing }))
    }
  }, [props.videoProps.source])

  /** ******************************************************
   * Worklets
   * These need to adhere to scope and be ordered appropriately.
   ****************************************************** */

  /**
   * Set a timeout when the controls are shown
   * that hides them after a length of time.
   */
  const setControlTimeout = () => {
    'worklet'
    controlViewOpacity.value = withDelay(controlTimeout, withTiming(0))
  }

  /**
   * Clear the hide controls timeout.
   */
  const clearControlTimeout = () => {
    'worklet'
    cancelAnimation(controlViewOpacity)
  }

  /**
   * Reset the timer completely
   */
  const resetControlTimeout = () => {
    'worklet'
    clearControlTimeout()
    setControlTimeout()
  }

  /**
   * Animation to show controls
   * permanently at video end.
   */
  const showControlAnimationPermanently = () => {
    'worklet'
    controlViewOpacity.value = withTiming(1, controlAnimateConfig)
    setTimeout(() => {
      clearControlTimeout()
    }, controlAnimateConfig.duration)
  }
  /**
   * Animation to show controls
   * fade in.
   */
  const showControlAnimation = () => {
    'worklet'
    controlViewOpacity.value = withTiming(1, controlAnimateConfig)
    setControlTimeout()
  }
  /**
   * Animation to show controls
   * fade out.
   */
  const hideControlAnimation = () => {
    'worklet'
    controlViewOpacity.value = withTiming(0, controlAnimateConfig)
  }

  /**
   * check on tap icon
   * @returns bool
   */
  const checkTapTakesEffect = () => {
    'worklet'
    // if (props.disableControl) {
    //   return false;
    // }
    resetControlTimeout()
    if (controlViewOpacity.value === 0) {
      showControlAnimation()
      return false
    }
    return true
  }

  /**
   * On toggle play
   * @returns
   */
  const togglePlayOnJS = () => {
    if (isLoadEnd.value) {
      onReplyVideo()
      isLoadEnd.value = false
    }
    // onTapPause?.(!paused);
    paused ? play() : pause()
  }

  function onPauseTapHandler() {
    'worklet'
    const status = checkTapTakesEffect()
    resetControlTimeout()
    if (!status) {
      if (controlViewOpacity.value === 0) {
        showControlAnimation()
      }
      return
    }
    runOnJS(togglePlayOnJS)()
  }

  function handleCompletionBodyPress() {
    'worklet'
    const status = checkTapTakesEffect()
    resetControlTimeout()
    if (!status) {
      return
    }
    if (props.onCompletionBodyPress) {
      runOnJS(props.onCompletionBodyPress)()
    }
  }

  const showCastDialog = () => {
    CastContext.showCastDialog()
  }

  function handleCastButtonPress() {
    'worklet'
    const status = checkTapTakesEffect()
    resetControlTimeout()
    if (!status) {
      if (controlViewOpacity.value === 0) {
        showControlAnimation()
      }
      return
    }
    runOnJS(showCastDialog)()
  }

  /**
   * Seek to a time in the video.
   *
   * @param {float} time time to seek to in seconds
   */
  const seekTo = async (time: number = 0) => {
    setCurrentTime(time)

    if (client) {
      client.seek({ position: time, resumeState: 'play', relative: false })
    } else {
      await playbackInstance.current?.setStatusAsync({
        positionMillis: time * 1000,
        shouldPlay: !paused,
      })
      resetControlTimeout()
    }
    isScrubbing.value = false
  }

  /**
   * Seek back to a time in the video incrementally.
   */
  function seekBackByStep() {
    'worklet'
    const status = checkTapTakesEffect()
    resetControlTimeout()
    if (!status) {
      if (controlViewOpacity.value === 0) {
        showControlAnimation()
      }
      return
    }
    runOnJS(seekTo)(currentTime - 15)
  }

  /**
   * Seek forward to a time in the video incrementally.
   */
  function seekForwardByStep() {
    'worklet'
    const status = checkTapTakesEffect()
    resetControlTimeout()
    if (!status) {
      if (controlViewOpacity.value === 0) {
        showControlAnimation()
      }
      return
    }
    runOnJS(seekTo)(currentTime + 15)
  }

  /**
   * Toggle between showing time remaining or
   * video duration in the timer control
   */
  const toggleTimerOnJS = () => {
    setShowTimeRemaining(!showTimeRemaining)
  }

  function toggleTimer() {
    'worklet'
    const status = checkTapTakesEffect()
    if (!status) {
      return
    }
    runOnJS(toggleTimerOnJS)()
  }

  function updatePlaybackCallback(status: AVPlaybackStatus) {
    props.playbackCallback(status)

    if (status.isLoaded) {
      if (!isScrubbing.value) {
        progress.value = status.positionMillis / 1000
        setCurrentTime(status.positionMillis / 1000)
      }
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        state:
          status.positionMillis >= status.durationMillis! - 1000
            ? PlaybackStates.Ended
            : status.isBuffering
            ? PlaybackStates.Buffering
            : status.isPlaying
            ? PlaybackStates.Playing
            : PlaybackStates.Paused,
      })
      // Submit the video as a completion at the COMPLETE_AT percentage mark
      if (status.positionMillis / 1000 > videoDurationAsSeconds * COMPLETE_AT && !hasLoggedCompletion.current) {
        props.onSubmitCompletion(status.positionMillis / 1000)
        hasLoggedCompletion.current = true
      }

      if (status.didJustFinish) {
        // theres a bug with iOS playing m3u8 files where the audio
        // track will replay after video completion. So unload it for now
        if (isIos) {
          playbackInstance.current?.unloadAsync()
          playbackInstance.current?.loadAsync(props.videoProps.source!)
        }
        showControlAnimationPermanently()
        setHasCompleted(true)
        props.onDidJustFinish()
      }
    } else {
      if (status.isLoaded === false && status.error) {
        const errorMsg = `Encountered a fatal error during playback: ${status.error}`
        setErrorMessage({ error: errorMsg })
        props.errorCallback({ type: ErrorSeverity.Fatal, message: errorMsg, obj: {} })
      }
    }
  }

  /**
   * Calculate the time to show in the timer area
   * based on if they want to see time remaining
   * or duration. Formatted to look as 00:00.
   */
  const calculateTime = () => {
    return showTimeRemaining
      ? `${formatTimeToMins(currentTime)}`
      : `-${formatTime({
          time: player.current.duration - currentTime,
          duration: player.current.duration,
        })}`
  }

  /**
   * on replay video
   */
  const onReplyVideo = () => {
    seekTo(0)
    setCurrentTime(0)
    progress.value = 0
  }

  /**
   * play the video
   */
  const play = () => {
    if (client) {
      client.play()
    } else {
      playbackInstance.current?.playAsync()
    }
    setPaused(false)
  }

  /**
   * pause the video
   */
  const pause = () => {
    if (client) {
      client.pause()
    } else {
      playbackInstance.current?.pauseAsync()
    }
    setPaused(true)
  }

  async function handleSlidingStart() {
    clearControlTimeout()
    isScrubbing.value = true
    cache.value = progress.value
  }

  /**
   * Cast player callback.
   *
   * @param {float} seconds decimal between 0 and video duration in seconds
   */
  async function handleSlidingComplete(seconds: number) {
    // isScrubbing.value = false
    if (hasCompleted) {
      setHasCompleted(false)
    }
    cache.value = 0
    try {
      seekTo(seconds)
    } catch (error) {
      console.log('CAUGHT', error)
    }
  }

  /* ****************************************************
            Controls for casting
  ***************************************************** */

  const onCastMediaPlaybackEnded = () => {
    showControlAnimationPermanently()
    setHasCompleted(true)
    props.onDidJustFinish()
  }

  const onCastMediaPlaybackStarted = async () => {}

  /**
   * Cast player callback.
   *
   * @param {float} castProgress time in seconds
   * @param {duration} duration total playable time in seconds
   */
  const onCastMediaProgress = async (castProgress: number, duration: number) => {
    if (!isScrubbing.value) {
      progress.value = castProgress
      setCurrentTime(castProgress)
    }
    setPlaybackInstanceInfo({
      ...playbackInstanceInfo,
      state:
        castProgress >= duration
          ? PlaybackStates.Ended
          : mediaStatus?.playerState === MediaPlayerState.BUFFERING
          ? PlaybackStates.Buffering
          : PlaybackStates.Playing,
    })

    // Submit the video as a completion at the COMPLETE_AT percentage mark
    // console.log('HAS COMPLETED', castProgress, player.current.duration * COMPLETE_AT, hasLoggedCompletion.current)
    if (castProgress > player.current.duration * COMPLETE_AT && !hasLoggedCompletion.current) {
      props.onSubmitCompletion(castProgress)
      hasLoggedCompletion.current = true
    }
  }

  const loadMedia = async () => {
    try {
      if (mediaStatus?.playerState === MediaPlayerState.PLAYING || mediaStatus?.playerState === MediaPlayerState.PAUSED) {
        // if we cast a video, background the app and come back, we want to prevent the casted video from reloading
        return
      }
      // if we connect to cast while expo video is playing, set expo video back to start
      // await playbackInstance?.setPositionAsync(0)
      await client?.loadMedia({
        mediaInfo: {
          contentUrl: props.videoMetadata.video_data.HLS_GROUP[0],
          // contentUrl: 'https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8',
          contentType: 'application/x-mpegURL',
          // contentType: 'video/mp4',
          metadata: {
            // shows as thumbnail on casted screen
            images: [
              {
                url: props.videoMetadata.thumbnail,
                height: 360,
                width: 640,
              },
            ],
            title: props.videoMetadata.name, // shows on casted screen as title
            subtitle: props.videoMetadata.description || '',
            studio: 'Fit Body On Demand', // shows on casted screen as a subtitle
            type: 'movie',
          },
          streamDuration: props.videoMetadata.duration, // video.duration is in 'hh:mm:ss', needs to be in seconds
          streamType: MediaStreamType.LIVE,
        },
        startTime: currentTime || 0, // seconds
      })
      logCastStarted()
    } catch (error) {
      console.log('loadMedia error', error)
    }
  }

  /**
   * When load starts we display a loading icon
   * and show the controls.
   */
  const onLoadStart = () => {
    // setIsLoading(true)
  }

  const onLoad = (data: AVPlaybackStatus) => {
    if (data.isLoaded) {
      const seconds = (data?.durationMillis || 0) / 1000
      player.current.duration = seconds
      MAX.value = seconds
      // setIsLoading(false)
      setControlTimeout()
    }
  }

  useEffect(() => {
    if (client !== null) {
      // pause expo player if cast is initiated while expo player is playing
      playbackInstance.current?.pauseAsync()
      playbackInstance.current?.setPositionAsync(0)
      // set casting video callbacks
      client.onMediaPlaybackEnded(onCastMediaPlaybackEnded)
      client.onMediaPlaybackStarted(onCastMediaPlaybackStarted)
      client.onMediaProgressUpdated(onCastMediaProgress)
      // begin stream
      loadMedia()
    }
  }, [client])

  const singleTapHandler = Gesture.Tap().onEnd((_event, success) => {
    // if (disableControl) {
    //   return;
    // }
    if (success) {
      if (controlViewOpacity.value === 0) {
        controlViewOpacity.value = withTiming(1, controlAnimateConfig)
        setControlTimeout()
      } else {
        controlViewOpacity.value = withTiming(0, controlAnimateConfig)
      }
    }
  })

  const onTapSlider = () => {
    // if (disableControl) {
    //   return;
    // }
    if (controlViewOpacity.value === 0) {
      showControlAnimation()
    }
  }

  const taps = Gesture.Exclusive(/* doubleTapHandle, */ singleTapHandler)
  const gesture = Gesture.Race(/* onPanGesture, */ taps)

  if (playbackInstanceInfo.state === PlaybackStates.Loading) {
    return (
      <RNAnimated.View
        style={[
          {
            backgroundColor: props.style.controlsBackgroundColor,
            justifyContent: 'center',
            height: videoHeight,
          },
          // videoStyle,
        ]}>
        {props.icon.loading || <ActivityIndicator {...props.activityIndicator} />}
      </RNAnimated.View>
    )
  }

  return (
    <>
      <GestureDetector gesture={gesture}>
        <RNAnimated.View
          style={[
            {
              alignItems: 'center',
              elevation: 10,
              justifyContent: 'center',
              zIndex: 10,
              height: videoHeight,
              width: videoWidth,
            },
            // videoStyle,
          ]}>
          <Video
            {...props.videoProps}
            style={styles.video}
            ref={playbackInstance}
            onLoadStart={onLoadStart}
            onLoad={onLoad}
            onPlaybackStatusUpdate={updatePlaybackCallback}
          />

          <RNAnimated.View style={[styles.controlView, controlViewStyles]}>
            {/* Player controls */}
            <RNAnimated.View
              style={[StyleSheet.absoluteFillObject, { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 999 }]}>
              {/* Top bar */}
              <View style={styles.topInfoWrapper}>
                {header ? (
                  header
                ) : (
                  <View style={styles.toolbar}>
                    <View style={styles.toolbarInner}>
                      <Text numberOfLines={2} style={[styles.videoName, width > height ? { maxWidth: width } : { maxWidth: 240 }]}>
                        {props.videoMetadata.name}
                      </Text>
                      <View style={styles.toolbarRight}>
                        <View style={{ marginRight: 24 }}>
                          {/*
                            CastButton needs to be rendered but not required
                            to be visible in order to call CastContext.showCastDialog()
                          */}
                          <CastButton style={{ display: 'none', opacity: 0, width: 0, height: 0, tintColor: 'transparent' }} />
                          <TapController onPress={handleCastButtonPress} style={{ width: 28, height: 28 }}>
                            {devices.find((device) => device.deviceId === castDevice?.deviceId) ? (
                              <CastActiveIcon color={globals.styles.colors.colorWhite} style={{ width: 28, height: 28 }} />
                            ) : (
                              <CastIcon color={globals.styles.colors.colorWhite} style={{ width: 28, height: 28 }} />
                            )}
                          </TapController>
                        </View>
                        <TapController onPress={handleCompletionBodyPress}>
                          <CloseIcon color={globals.styles.colors.colorWhite} width={28} height={28} />
                        </TapController>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              {(playbackInstanceInfo.state === PlaybackStates.Ended || hasCompleted) && completionBody ? (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  {/* {completionBody} */}
                  <View style={{ flex: 1, alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={styles.classComplete}>CLASS COMPLETED</Text>
                    <Text style={styles.classCompleteSubtext}>This class has been added to your Fit Body calendar.</Text>
                    <TapController onPress={handleCompletionBodyPress} style={styles.closeButton}>
                      <Text style={styles.closeButtonText}>CLOSE</Text>
                    </TapController>
                  </View>
                </View>
              ) : (
                <>
                  {playbackInstanceInfo.state === PlaybackStates.Buffering && (
                    <View
                      style={[
                        StyleSheet.absoluteFillObject,
                        {
                          zIndex: 20,
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ]}>
                      <View
                        style={{
                          backgroundColor: props.style.controlsBackgroundColor,
                          opacity: 0.6,
                          width: 56,
                          maxHeight: 56,
                          borderRadius: 50,
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <ActivityIndicator {...props.activityIndicator} />
                      </View>
                    </View>
                  )}
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
                    <TapController onPress={seekBackByStep}>
                      <Back15Icon color={globals.styles.colors.colorWhite} width={40} height={40} />
                    </TapController>
                    <TapController onPress={onPauseTapHandler} style={{ paddingHorizontal: 60 }}>
                      {paused ? (
                        <PlayIcon color={globals.styles.colors.colorWhite} height={56} width={56} />
                      ) : (
                        <PauseIcon color={globals.styles.colors.colorWhite} height={56} width={56} />
                      )}
                    </TapController>
                    <TapController onPress={seekForwardByStep}>
                      <Forward15Icon color={globals.styles.colors.colorWhite} width={40} height={40} />
                    </TapController>
                  </View>
                </>
              )}
            </RNAnimated.View>

            {/* Slider section */}
            <View style={styles.bottomInfoWrapper}>
              {props.timeVisible && (
                <TapController onPress={toggleTimer}>
                  <Text style={[props.textStyle, styles.timeLeft]}>{calculateTime()}</Text>
                </TapController>
              )}
              {props.slider.visible && (
                <View
                  style={{
                    width: width - 168,
                    // height: 50,
                    marginHorizontal: 12,
                  }}>
                  <Slider
                    theme={{
                      // disableMinTrackTintColor: '#fff',
                      maximumTrackTintColor: globals.styles.colors.colorTransparentWhite30,
                      minimumTrackTintColor: globals.styles.colors.colorWhite,
                      cacheTrackTintColor: 'red',
                      bubbleBackgroundColor: globals.styles.colors.colorTransparentWhite15,
                    }}
                    containerStyle={{
                      borderRadius: width / 2,
                    }}
                    progress={progress}
                    minimumValue={MIN}
                    maximumValue={MAX}
                    thumbWidth={32}
                    cache={cache}
                    isScrubbing={isScrubbing}
                    onTap={onTapSlider}
                    onSlidingStart={handleSlidingStart}
                    onSlidingComplete={handleSlidingComplete}
                    bubble={secondToTime}
                    bubbleTranslateY={-50}
                  />
                </View>
              )}
              {props.timeVisible && <Text style={[props.textStyle, styles.timeRight]}>{formatTimeToMins(player.current.duration)}</Text>}
              {props.fullscreen.visible && (
                <TouchableButton
                  onPress={() =>
                    props.fullscreen.inFullscreen ? props.fullscreen.exitFullscreen!() : props.fullscreen.enterFullscreen!()
                  }>
                  <View>
                    {props.icon.fullscreen}
                    {props.icon.exitFullscreen}
                    {((!props.icon.fullscreen && props.fullscreen.inFullscreen) ||
                      (!props.icon.exitFullscreen && !props.fullscreen.inFullscreen)) && (
                      <>
                        {props.fullscreen.inFullscreen ? (
                          <ExitFullscreenIcon color={globals.styles.colors.colorWhite} height={24} width={24} />
                        ) : (
                          <FullscreenIcon color={globals.styles.colors.colorWhite} height={24} width={24} />
                        )}
                      </>
                    )}
                  </View>
                </TouchableButton>
              )}
            </View>
          </RNAnimated.View>
        </RNAnimated.View>
      </GestureDetector>
    </>
  )
}

VideoPlayer.defaultProps = defaultProps

export default VideoPlayer
