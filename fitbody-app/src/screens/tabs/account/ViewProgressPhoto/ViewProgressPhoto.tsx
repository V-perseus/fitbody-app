/* *******************************************
    This component looks like it had all the functionality to handle deleting an image but was never hooked up
    completely. Said functionality has been commented out.
********************************************** */

import React, { useLayoutEffect } from 'react'
import Carousel from 'react-native-snap-carousel'
import { Text, View, TouchableOpacity } from 'react-native'
// import Modal from 'react-native-modal'
import moment from 'moment'

// styles
import styles from './styles'
import globals from '../../../../config/globals'

// Components
import PhotoItem from '../../../../components/Workout/Progress/PhotoItem'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'
import { ViewProgressPhotoScreenNavigationProps } from '../../../../config/routes/routeTypes'
import { IProgressPhoto, ProgressPhotoViewTypes } from '../../../../data/progress_photos/types'

//actions
// import { deleteProgressPhotos, getProgressPhotos } from '../../../../data/progress_photos/actions'

// const SLIDER_1_FIRST_ITEM = 0

const sides = [ProgressPhotoViewTypes.FRONT, ProgressPhotoViewTypes.SIDE, ProgressPhotoViewTypes.BACK]
const sliderWidth = globals.window.width
const itemWidth = globals.window.width * 0.9

interface IViewProgressPhotoProps extends ViewProgressPhotoScreenNavigationProps {}
const ViewProgressPhotos: React.FC<IViewProgressPhotoProps> = ({ navigation, route }) => {
  // const [sliderActiveSlide, setSliderActiveSlide] = useState(sides.indexOf(navigation.getParam('view_type')) || SLIDER_1_FIRST_ITEM)
  // const [isModalVisible, setIsModalVisible] = useState(false)

  // useEffect(() => {
  //   navigation.setParams({ handleOpenDeleteModal })
  // }, [])
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

  function renderItem({ item }: { item: Partial<IProgressPhoto> }) {
    return <PhotoItem picture={item.photo_url!} type={item.view_type!} />
  }

  // function deletePhotos() {
  //   const photos = navigation.getParam('progressPhotos')
  //   const photo = photos[sliderActiveSlide]
  //   const photoId = photo.id
  //   deleteProgressPhotos(photoId)
  //   setIsModalVisible(false)
  // }

  function collageModal() {
    const { navigate } = navigation
    navigate('CollagePhoto', {
      picture: route.params?.picture ?? '',
      // photoId: route.params?.photoId,
      // progressPhotos: route.params?.progressPhotos,
    })
  }

  // function handleOpenDeleteModal() {
  //   setIsModalVisible(true)
  // }

  const photos = route.params?.progressPhotos
  const date = route.params?.date
  const view_type = route.params?.view_type
  let selected_photo = view_type ? sides.indexOf(view_type) : 0

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{moment(date).format('MMM DD, YYYY')}</Text>
      <Carousel
        data={photos}
        renderItem={renderItem}
        removeClippedSubviews={false}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        hasParallaxImages={true}
        firstItem={selected_photo}
        inactiveSlideOpacity={0}
        enableMomentum={false}
        containerCustomStyle={styles.slider}
        loop={false}
        loopClonesPerSide={1}
        // onSnapToItem={setSliderActiveSlide}
      />
      <View>
        <TouchableOpacity style={styles.shareButton} onPress={collageModal}>
          <Text style={styles.shareButtonLabel}>COMPARE + SHARE</Text>
        </TouchableOpacity>
      </View>

      {/* <Modal isVisible={isModalVisible}>
        <View style={styles.deletePopUp}>
          <TouchableOpacity style={styles.close} onPress={() => setIsModalVisible(false)}>
            <Icon name="ModalClose" width="20" height="20" viewBox="0 0 20 20" />
          </TouchableOpacity>
          <View style={styles.popUpBody}>
            <Text style={styles.popUpTitle}>Delete Photo</Text>
            <Text style={styles.popUpContent}>Are you sure you want to</Text>
            <Text style={styles.popUpContent}> delete this photo?</Text>
            <TouchableOpacity onPress={deletePhotos} style={styles.icons}>
              <LinearGradient style={styles.buttonContainer} colors={globals.styles.workouts.gradients.SHRED}>
                <Text style={styles.buttonLabel}> DELETE PHOTOS </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
    </View>
  )
}

export default ViewProgressPhotos
