import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StatusBar, Text, View, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import * as _ from 'lodash'

// styles
import styles from './styles'
import globals from '../../../../config/globals'

// Services
import { getProgressPhotos } from '../../../../data/progress_photos'
import { progressPhotosDaysSelector } from '../../../../data/progress_photos/selectors'

// Components
import PinkButton from '../../../../components/PinkButton'
import ProgressPhotosRow from '../../../../components/ProgressPhotosRow'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'
import { IPhotoRowType, PhotoRowPhotosType } from '../CollagePhoto/CollagePhoto'

// types
import { IProgressPhoto, ProgressPhotoViewTypes } from '../../../../data/progress_photos/types'
import { NavigationProp } from '@react-navigation/native'
import { AccountStackParamList } from '../../../../config/routes/routeTypes'

interface IProgressPhotosProps {
  navigation: NavigationProp<AccountStackParamList>
}
const ProgressPhotos: React.FC<IProgressPhotosProps> = ({ navigation }) => {
  const progressDays = useSelector(progressPhotosDaysSelector)

  const [rows, setRows] = useState<IPhotoRowType[]>([])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerStyle: {
        backgroundColor: globals.styles.colors.colorWhite,
        shadowColor: 'transparent',
        elevation: 0, // for Android
        shadowOffset: {
          width: 0,
          height: 0, // for iOS
        },
      },
      headerTitle: () => <Text style={styles.navLabel}>PROGRESS PHOTO</Text>,
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
    })
  }, [navigation])

  useEffect(() => {
    getProgressPhotos()
  }, [])

  useEffect(() => {
    const extractedRows: IPhotoRowType[] = Object.keys(progressDays).map((key) => ({ day: key, photos: progressDays[key] }))
    const rowsData = _.orderBy(extractedRows, (row) => row.day, ['desc'])
    setRows(rowsData)
  }, [progressDays])

  function addPhotos() {
    navigation.navigate('Progress')
  }

  function selectPhoto(photo: IProgressPhoto | undefined, side: number, photos?: PhotoRowPhotosType, date?: string) {
    const temp: Partial<IProgressPhoto>[] = [
      photos?.FRONT.id ? photos.FRONT : { view_type: ProgressPhotoViewTypes.FRONT, photo_url: null },
      photos?.SIDE.id ? photos.SIDE : { view_type: ProgressPhotoViewTypes.SIDE, photo_url: null },
      photos?.BACK.id ? photos.BACK : { view_type: ProgressPhotoViewTypes.BACK, photo_url: null },
    ]
    if (!photo || photo == null || photo.photo_url == null) {
      navigation.navigate('Progress', { selectedDate: date!, viewType: side })
    } else {
      navigation.navigate('ViewProgressPhoto', {
        picture: photo ? photo.photo_url : null,
        view_type: photo.view_type!,
        // photoId: photos?.photoID, // TODO there is no photoID, is this actually being used or not
        progressPhotos: temp,
        date: date,
      })
    }
  }

  function renderItem({ item }: { item: IPhotoRowType }) {
    return <ProgressPhotosRow createdDate={item.day} data={item.photos} onPressEvent={selectPhoto} />
  }

  function keyExtractor(item: IPhotoRowType) {
    return item.day
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.photoContainer}>
        {rows && rows.length > 0 ? (
          <FlatList data={rows} extraData={rows} keyExtractor={keyExtractor} renderItem={renderItem} />
        ) : (
          <ProgressPhotosRow />
        )}
        <PinkButton title={'ADD PHOTOS'} handlePress={addPhotos} />
      </View>
    </View>
  )
}

export default ProgressPhotos
