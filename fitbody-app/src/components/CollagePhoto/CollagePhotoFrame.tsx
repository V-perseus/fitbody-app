import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import ImagePicker from 'react-native-image-crop-picker'

// Assets
import globals from '../../config/globals'
import styles from './styles'

//Components
import FitBody from '../../../assets/images/logo/fitbody.svg'

import { setErrorMessage } from '../../services/error'

interface ICollagePhotoFrameProps {
  beforeImage: string
  afterImage?: string
}
const CollagePhotoFrame: React.FC<ICollagePhotoFrameProps> = ({ beforeImage, afterImage }) => {
  const [images, setImages] = useState<ICollagePhotoFrameProps>({
    afterImage: undefined,
    beforeImage: '',
  })

  useEffect(() => {
    setImages((prevState) => ({
      ...prevState,
      afterImage,
    }))
  }, [afterImage])

  useEffect(() => {
    setImages((prevState) => ({
      ...prevState,
      beforeImage,
    }))
  }, [beforeImage])

  const cropPhoto = async (url: string, key: string) => {
    try {
      if (Platform.OS === 'ios') {
        const image = await ImagePicker.openCropper({
          path: url,
          width: globals.window.height * 0.75,
          height: globals.window.height,
          includeBase64: true,
          cropperToolbarTitle: 'Hey babe! Adjust your photo to be just perfect!',
          writeTempFile: false, // only needed to read from this file and more performant when including base64
          mediaType: 'photo',
        })
        setImages((prevState) => ({
          ...prevState,
          [key]: image.path,
        }))
      }
    } catch (error: any) {
      console.log('PICKER ERROR', error)
      if (!error.message.includes('User cancelled')) {
        setErrorMessage({ error: error.message || 'Something went wrong.' })
      }
    }
  }

  return (
    <View style={styles.collageFrame}>
      <View style={styles.collageImages}>
        <View style={styles.collageImage}>
          <TouchableOpacity onPress={() => cropPhoto(images.beforeImage, 'beforeImage')}>
            <Image style={styles.beforeImage} source={{ uri: images.beforeImage }} testID="before_img" />
          </TouchableOpacity>
        </View>
        <View style={styles.collageImage}>
          <TouchableOpacity onPress={images.afterImage ? () => cropPhoto(images.afterImage!, 'afterImage') : () => {}}>
            <Image style={styles.beforeImage} source={{ uri: images.afterImage }} />
          </TouchableOpacity>
        </View>
      </View>
      <LinearGradient style={styles.collageFooter} colors={[globals.styles.colors.colorLove, globals.styles.colors.colorLove]}>
        <View style={styles.collageFooterItem}>
          <Text style={styles.collageFooterText}>Before</Text>
        </View>
        <View style={styles.collageFooterItem}>
          <Text style={styles.collageFooterText}>After</Text>
        </View>
        <View style={{ position: 'absolute' }}>
          <FitBody color={globals.styles.colors.colorWhite} width={87} />
        </View>
      </LinearGradient>
    </View>
  )
}

export default CollagePhotoFrame
