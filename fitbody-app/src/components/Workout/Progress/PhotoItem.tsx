import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  ImageResizeMode,
  TextStyle,
  ViewStyle,
  ImageStyle,
  ImageSourcePropType,
} from 'react-native'

import Images from '../../../config/images'
import globals from '../../../config/globals'
import PlusIcon from '../../../../assets/images/svg/icon/40px/more.svg'
import { ProgressPhotoViewTypes } from '../../../data/progress_photos/types'

interface IPhotoItemProps {
  picture: string | null
  type: ProgressPhotoViewTypes
  handlePress?: () => void
  mode?: ImageResizeMode
  placeholderStyle?: ImageStyle
  canUpload?: boolean
  description?: string
  textStyle?: TextStyle
  photoStyle?: ViewStyle
}
const PhotoItem: React.FC<IPhotoItemProps> = ({
  picture,
  type,
  handlePress,
  mode,
  placeholderStyle,
  canUpload,
  description,
  textStyle,
  photoStyle,
}) => {
  let placeHolderImg: ImageSourcePropType | null
  const uri = picture
  switch (type) {
    case ProgressPhotoViewTypes.FRONT:
      placeHolderImg = Images.bodyFront
      break
    case ProgressPhotoViewTypes.BACK:
      placeHolderImg = Images.bodyBack
      break
    case ProgressPhotoViewTypes.SIDE:
      placeHolderImg = Images.bodySide
      break
    default:
      placeHolderImg = null
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.photoView, photoStyle]} onPress={handlePress ? handlePress : undefined}>
        {uri ? <Image source={{ uri: uri }} style={styles.image} resizeMode={mode || 'contain'} /> : null}
        {!uri && !!placeHolderImg ? (
          <Image source={placeHolderImg} style={[styles.placeHolderImg, placeholderStyle]} resizeMode="contain" />
        ) : null}
        {canUpload && !uri ? (
          <View style={styles.plusContainer}>
            <View style={styles.grayPlusButton}>
              <PlusIcon width={24} height={24} color={globals.styles.colors.colorWhite} />
            </View>
          </View>
        ) : null}
      </TouchableOpacity>
      {description && <Text style={[styles.descriptionLabel, textStyle]}>{description.toUpperCase()}</Text>}
    </View>
  )
}

export default PhotoItem

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoView: {
    width: globals.window.width * 0.9,
    height: '100%',
    borderColor: globals.styles.colors.colorWhite,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionLabel: {
    color: globals.styles.colors.colorWhite,
    fontSize: 15.3,
    letterSpacing: -0.3,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
  },
  placeHolderImg: {
    width: '100%',
    flex: 1,
    margin: 10,
  },
  plusContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 25,
    width: '100%',
  },
  grayPlusButton: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    marginHorizontal: 10,
    marginBottom: 20,
  },
})
