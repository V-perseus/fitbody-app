import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Text, View, StatusBar, FlatList } from 'react-native'
import ViewShot from 'react-native-view-shot'
import LinearGradient from 'react-native-linear-gradient'
import Share from 'react-native-share'
import RNFS from 'react-native-fs'
import * as _ from 'lodash'

// styles
import globals from '../../../../config/globals'
import styles from './styles'
import ShareIcon from '../../../../../assets/images/svg/icon/24px/share.svg'

// Components
// import ProgressPhotosItem from '../../../../components/ProgressPhotosItem/ProgressPhotosItem'
import ProgressPhotosRow from '../../../../components/ProgressPhotosRow'
import CollagePhotoFrame from '../../../../components/CollagePhoto/CollagePhotoFrame'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

import { progressPhotosDaysSelector } from '../../../../data/progress_photos/selectors'

// types
import { IProgressPhoto, ProgressPhotoViewTypes } from '../../../../data/progress_photos/types'
import { CollagePhotoScreenNavigationProps } from '../../../../config/routes/routeTypes'

export type PhotoRowPhotosType = Record<ProgressPhotoViewTypes, IProgressPhoto>
export interface IPhotoRowType {
  day: string
  photos: PhotoRowPhotosType
}

interface ICollagePhotoProps extends CollagePhotoScreenNavigationProps {}
const CollagePhoto: React.FC<ICollagePhotoProps> = ({ navigation, route }) => {
  const [afterImage, setAfterImage] = useState<string | undefined>(undefined)

  const progressDays = useSelector(progressPhotosDaysSelector)

  const viewShot = useRef<ViewShot>(null)

  /**
   * Navigation props
   */
  useEffect(() => {
    const { goBack } = navigation
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
      headerTitle: () => <Text style={styles.navLabel}>COLLAGE</Text>,
      headerLeft: () => <HeaderButton onPress={() => goBack()} />,
      headerRight: () => (
        <HeaderButton onPress={shareCollage}>
          <ShareIcon color={globals.styles.colors.colorBlack} />
        </HeaderButton>
      ),
    })
  }, [navigation])

  function collagePhoto(picture: IProgressPhoto | undefined) {
    if (picture) {
      setAfterImage(picture.photo_url || undefined)
    }
  }

  function _renderItem({ item }: { item: IPhotoRowType }) {
    return (
      <ProgressPhotosRow
        createdDate={item.day}
        data={item.photos}
        onPressEvent={(photos: IProgressPhoto | undefined) => collagePhoto(photos)}
      />
    )
  }

  function _keyExtractor(item: IPhotoRowType) {
    return item.day
  }

  const shareCollage = () => {
    viewShot.current?.capture?.().then((uri) => {
      RNFS.readFile(uri, 'base64').then((res) => {
        const base64uri = 'data:image/png;base64,' + res
        Share.open({
          title: 'Fitbody Collage',
          message: 'Check out my Fit Body App Progress!',
          type: 'image/png',
          url: base64uri,
        })
          .then((r) => {
            console.log(r)
          })
          .catch((err) => {
            err && console.log(err)
          })
      })
    })
  }

  const extractedRows = Object.keys(progressDays).map((key) => {
    return { day: key, photos: progressDays[key] }
  })
  const rows: IPhotoRowType[] = _.orderBy(extractedRows, (row) => row.day, ['desc'])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ViewShot ref={viewShot} style={{ marginHorizontal: 24, height: globals.window.width - 48 }}>
        <CollagePhotoFrame beforeImage={route.params?.picture} afterImage={afterImage} />
      </ViewShot>

      <View style={{ flex: 1, marginTop: 24, backgroundColor: globals.styles.colors.colorWhite }}>
        <View style={styles.photoContainer}>
          {rows && rows.length > 0 && <FlatList data={rows} extraData={rows} keyExtractor={_keyExtractor} renderItem={_renderItem} />}
        </View>
      </View>
      <LinearGradient
        pointerEvents="box-none"
        style={{ top: globals.window.width - 48 + 8 + 24, position: 'absolute', height: 113, width: '100%', borderWidth: 0 }}
        colors={['#0000002c', '#00000000']}
      />
    </View>
  )
}

export default CollagePhoto
