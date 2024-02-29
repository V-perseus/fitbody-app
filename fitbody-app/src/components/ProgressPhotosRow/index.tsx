import React from 'react'
import { Text, View } from 'react-native'
import moment from 'moment'

// components
import PhotoItem from '../Workout/Progress/PhotoItem'

// styles
import styles from './style'

// types
import { PhotoRowPhotosType } from '../../screens/tabs/account/CollagePhoto/CollagePhoto'
import { IProgressPhoto, ProgressPhotoViewTypes } from '../../data/progress_photos/types'

interface IProgressPhotosRow {
  createdDate?: string
  onPressEvent?: (photo: IProgressPhoto | undefined, slot: number, photos?: PhotoRowPhotosType, date?: string) => void
  data?: PhotoRowPhotosType | undefined
}
function ProgressPhotosRow({ createdDate, onPressEvent, data }: IProgressPhotosRow) {
  return (
    <View style={styles.container}>
      {createdDate && <Text style={styles.date}>{moment(createdDate).format('MMM D, YYYY')}</Text>}
      <View style={styles.photoContainer}>
        <PhotoItem
          mode="cover"
          handlePress={() => onPressEvent?.(data?.FRONT, 0, data, createdDate)}
          picture={data?.FRONT ? data.FRONT.photo_url : ''}
          type={ProgressPhotoViewTypes.FRONT}
          photoStyle={styles.image}
          placeholderStyle={styles.placeHolderImg}
        />
        <PhotoItem
          mode="cover"
          handlePress={() => onPressEvent?.(data?.SIDE, 1, data, createdDate)}
          picture={data?.SIDE ? data.SIDE.photo_url : ''}
          type={ProgressPhotoViewTypes.SIDE}
          photoStyle={styles.middleImage}
          placeholderStyle={styles.placeHolderImg}
        />
        <PhotoItem
          mode="cover"
          handlePress={() => onPressEvent?.(data?.BACK, 2, data, createdDate)}
          picture={data?.BACK ? data.BACK.photo_url : ''}
          type={ProgressPhotoViewTypes.BACK}
          photoStyle={styles.image}
          placeholderStyle={styles.placeHolderImg}
        />
      </View>
    </View>
  )
}

export default ProgressPhotosRow
