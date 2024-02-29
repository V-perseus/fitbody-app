import React, { useState, useLayoutEffect } from 'react'
import { ScrollView, Text, TouchableOpacity, View, Platform, StatusBar, SafeAreaView, PermissionsAndroid } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import Carousel from 'react-native-snap-carousel'
import moment from 'moment'
import { Asset, CameraOptions, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { v4 as uuidv4 } from 'uuid'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useHeaderHeight } from '@react-navigation/elements'
import RNFS from 'react-native-fs'
import ImageResizer from 'react-native-image-resizer'
import { NavigationProp, RouteProp } from '@react-navigation/native'

// styles
import styles from './styles'
import globals from '../../../../config/globals'

// Services
import { sendProgressPhotos } from '../../../../data/progress_photos'
import { progressPhotosSelector } from '../../../../data/progress_photos/selectors'
import { displayLoadingModal, hideLoadingModal } from '../../../../services/loading'
import { userSelector } from '../../../../data/user/selectors'
import { useAppSelector } from '../../../../store/hooks'
import { useInit } from '../../../../services/hooks/useInit'

// Components
import Confirmation from '../../../../components/Confirmation/Confirmation'
import PhotoItem from '../../../../components/Workout/Progress/PhotoItem'
import OptionButton from '../../../../components/FoodQuestions/OptionButton'
import DatePickerModal from '../../../../components/DatePickerModal'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

// Assets
import CalendarIcon from '../../../../../assets/images/svg/icon/24px/month.svg'
import {
  ProgressPhotoDays,
  ISendProgessPhotosPayload,
  ProgressPhotoViewTypes,
  ProgressPhotoPlaceholder,
} from '../../../../data/progress_photos/types'

// Types
import { AccountStackParamList } from '../../../../config/routes/routeTypes'

interface IProgressProps {
  navigation: NavigationProp<AccountStackParamList, 'Progress'>
  route: RouteProp<AccountStackParamList, 'Progress'>
}
const Progress: React.FC<IProgressProps> = connectActionSheet(({ navigation, route, showActionSheetWithOptions }) => {
  const tabsHeight = useBottomTabBarHeight()
  const headerHeight = useHeaderHeight()

  const user = useAppSelector(userSelector)
  const progress_photos = useAppSelector(progressPhotosSelector)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [photos, setPhotos] = useState<ProgressPhotoPlaceholder[]>([])
  const [selectedDate, setSelectedDate] = useState(route.params?.selectedDate ? moment(route.params.selectedDate) : null)
  const [dataToSend, setDataToSend] = useState<{} | ISendProgessPhotosPayload>({})
  const [wantsToSave, setWantsToSave] = useState(false)
  const [wantsToChangeDate, setWantsToChangeDate] = useState(false)
  const [saveChoice, setSaveChoice] = useState<number | null>(null)
  const [dateChangeChoice, setDateChangeChoice] = useState<number | null>(null)

  const initialSlide = route.params?.viewType ?? 0
  const sliderWidth = globals.window.width
  const active = true
  const carouselItemHeight = globals.window.height - 135 - 55 - 10 - 150 - headerHeight - tabsHeight

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: () => (
        <View>
          <Text style={styles.navLabel}>PROGRESS PHOTOS</Text>
        </View>
      ),
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} iconColor={globals.styles.colors.colorWhite} />,
    })
  }, [navigation])

  const getPhotos = (pdate?: string | Date) => {
    const { days }: { days: ProgressPhotoDays } = progress_photos
    const date = pdate != null ? moment(pdate).format('YYYY-MM-DD') : selectedDate != null ? selectedDate.format('YYYY-MM-DD') : null

    const todaysPhotos = date ? days[date] : null

    const photoPlaceholders: ProgressPhotoPlaceholder[] = [
      {
        key: ProgressPhotoViewTypes.FRONT,
        view_type: ProgressPhotoViewTypes.FRONT,
        photo_url: todaysPhotos && todaysPhotos.FRONT ? todaysPhotos.FRONT.photo_url : null,
      },
      {
        key: ProgressPhotoViewTypes.SIDE,
        view_type: ProgressPhotoViewTypes.SIDE,
        photo_url: todaysPhotos && todaysPhotos.SIDE ? todaysPhotos.SIDE.photo_url : null,
      },
      {
        key: ProgressPhotoViewTypes.BACK,
        view_type: ProgressPhotoViewTypes.BACK,
        photo_url: todaysPhotos && todaysPhotos.BACK ? todaysPhotos.BACK.photo_url : null,
      },
    ]
    setPhotos(photoPlaceholders)
  }

  useInit(getPhotos)

  const savePicture = async (photo: Asset, type: ProgressPhotoViewTypes) => {
    const { workout_goal: workoutGoal } = user
    if (!workoutGoal) {
      return {}
    }
    const { current_week: currentWeek } = user.meta?.programs[workoutGoal.toLowerCase()]
    const localFile = Platform.OS === 'android' ? photo.uri! : photo.uri!.replace('file://', '')
    const uri = await resizeImage(photo.uri!)
    let body = { ...dataToSend } as ISendProgessPhotosPayload

    if (Object.keys(body).length === 0) {
      body = {
        week_id: String(currentWeek),
        date: selectedDate!.format('YYYY-MM-DD'),
        program: workoutGoal,
        photos: [
          {
            type,
            guid: uuidv4(),
            photo_url: localFile,
            image: uri,
          },
        ],
      }
    } else {
      const existingIndex = body.photos.findIndex((f) => f.type === type)
      if (existingIndex === -1) {
        body.photos.push({
          type,
          guid: uuidv4(),
          photo_url: localFile,
          image: uri,
        })
      } else {
        body.photos[existingIndex].photo_url = localFile
        body.photos[existingIndex].image = uri
      }
    }

    return body
  }

  async function handleImagePickerResponse(response: ImagePickerResponse, order: ProgressPhotoViewTypes) {
    try {
      displayLoadingModal()
      if (response.didCancel) {
        console.log('User cancelled camera')
        hideLoadingModal()
      } else if (response.errorMessage) {
        console.log('Camera Error: ', response.errorMessage)
        hideLoadingModal()
      } else if (response.errorCode) {
        console.log('Camera Failed with code: ', response.errorCode)
        hideLoadingModal()
      } else if (response.assets && response.assets.length > 0) {
        const photo = response.assets[0]
        const localFile = Platform.OS === 'android' ? photo.uri : photo.uri!.replace('file://', '')
        const photosCopy = photos.slice()
        const index = photosCopy.findIndex((item) => item.view_type === order)
        photosCopy[index].photo_url = localFile ? localFile : null
        const newData = await savePicture(photo, order)

        setPhotos(photosCopy)
        setDataToSend(newData)
        hideLoadingModal()
      } else {
        hideLoadingModal()
      }
    } catch (error) {
      hideLoadingModal()
    }
  }

  const resizeImage = async (uri: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      ImageResizer.createResizedImage(uri, globals.window.width, globals.window.height, 'JPEG', 100, undefined)
        .then((response) => {
          RNFS.readFile(response.uri, 'base64')
            .then((res) => {
              const img = `data:image/jpeg;base64,${res}`
              resolve(img)
            })
            .catch((error) => {
              // console.log(error);
              reject(error)
            })
        })
        .catch((err) => {
          console.log(err)
          resolve(uri)
          // reject(err)
        })
    })
  }
  const imagePickerOptions: CameraOptions = {
    mediaType: 'photo',
    includeBase64: false,
    quality: 0.6,
  }

  const selectPhoto = (order: ProgressPhotoViewTypes) => () => {
    showActionSheetWithOptions(
      {
        message: 'Choose  Photo',
        options: ['Choose from Library', 'Choose from Camera', 'Cancel'],
        cancelButtonIndex: 2,
      },
      (index) => {
        if (index === 2) {
          // action sheet closed by user
          return
        }
        if (index === 1) {
          if (Platform.OS === 'android') {
            // @DEV react-native-image-picker does not require Manifest.permission.CAMERA, if your app declares as using
            // this permission in manifest then you have to obtain the permission before using launchCamera
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then((granted) => {
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                launchCamera(imagePickerOptions, (response) => handleImagePickerResponse(response, order))
              }
            })
          } else {
            launchCamera(imagePickerOptions, (response) => handleImagePickerResponse(response, order))
          }
        }
        if (index === 0) {
          launchImageLibrary(imagePickerOptions, (response) => handleImagePickerResponse(response, order))
        }
      },
    )
  }

  function handleDateChange(date: Date) {
    setIsModalOpen(false)
    setDataToSend({})
    setSelectedDate(moment(date))
    getPhotos(date)
  }

  function handleSubmit() {
    setWantsToSave(false)
    setSaveChoice(0)
  }

  async function continueSubmit() {
    if (Object.keys(dataToSend).length === 0) {
      navigation.goBack()
    } else if (saveChoice === 0) {
      setSaveChoice(null)
      sendProgressPhotos(dataToSend as ISendProgessPhotosPayload)
      navigation.goBack()
    }
  }

  function requestSubmit() {
    setWantsToSave(true)
  }

  function cancelSubmit() {
    setWantsToSave(false)
    setSaveChoice(1)
  }

  function requestDateChange() {
    if (Object.keys(dataToSend).length === 0) {
      setIsModalOpen(true)
    } else {
      setWantsToChangeDate(true)
    }
  }

  function continueDateChange() {
    setWantsToChangeDate(false)
    setDateChangeChoice(0)
  }

  function cancelDateChange() {
    setWantsToChangeDate(false)
    setDateChangeChoice(1)
  }

  function dateChangeConfirmationHidden() {
    if (dateChangeChoice === 0) {
      setDateChangeChoice(null)
      setIsModalOpen(true)
    }
  }

  function renderItem({ item }: { item: ProgressPhotoPlaceholder }) {
    return (
      <PhotoItem
        photoStyle={{
          borderWidth: item.photo_url == null ? 1 : 0,
          backgroundColor: item.photo_url == null ? globals.styles.colors.colorTransparentWhite50 : 'rgba(255,255,255,0)',
          height: carouselItemHeight,
          width: (carouselItemHeight / 4) * 3,
        }}
        canUpload={selectedDate !== null}
        description={item.view_type}
        handlePress={selectedDate !== null ? selectPhoto(item.view_type) : () => {}}
        picture={item.photo_url || ''}
        type={item.view_type}
      />
    )
  }

  return (
    <LinearGradient
      colors={[globals.styles.colors.colorPink, globals.styles.colors.colorPink, globals.styles.colors.colorLavender]}
      style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, alignItems: 'center', marginTop: headerHeight }}>
        <ScrollView contentContainerStyle={styles.scrollView} contentInsetAdjustmentBehavior="automatic">
          <Text style={styles.title}>ADD NEW PROGRESS PHOTOS</Text>
          <Text style={styles.description}>
            Track your progress! First pick a date,{'\n'}then choose a photo from the{'\n'}front, side and back so you can compare{'\n'}all
            your hard work through the weeks!
          </Text>
          <TouchableOpacity onPress={requestDateChange}>
            <View style={styles.datePickerButtonView}>
              <Text style={styles.date}>{selectedDate != null ? selectedDate.format('MMMM DD, YYYY').toUpperCase() : 'PICK A DATE'}</Text>
              <CalendarIcon color={globals.styles.colors.colorWhite} />
            </View>
          </TouchableOpacity>
          {selectedDate && (
            <Carousel
              containerCustomStyle={{ marginBottom: tabsHeight }}
              removeClippedSubviews={false}
              data={photos}
              renderItem={renderItem}
              sliderWidth={sliderWidth}
              itemWidth={sliderWidth * 0.75}
              firstItem={initialSlide}
              inactiveSlideOpacity={1}
              inactiveSlideScale={0.9}
            />
          )}
          <DatePickerModal onDateChange={handleDateChange} onClose={() => setIsModalOpen(false)} visible={isModalOpen} />

          <Confirmation
            style={{ position: 'absolute', bottom: 0 }}
            onHide={dateChangeConfirmationHidden}
            handleYes={continueDateChange}
            handleNo={cancelDateChange}
            question="Hey babe! Your photos will not be uploaded if you pick a different date!"
            yesText="Continue"
            noText="Cancel"
            visible={wantsToChangeDate === true}
          />

          <Confirmation
            style={{ position: 'absolute', bottom: 0 }}
            onHide={continueSubmit}
            handleYes={handleSubmit}
            handleNo={cancelSubmit}
            question="Hey babe! Your photos will be uploaded to your account."
            yesText="Continue"
            noText="Cancel"
            visible={wantsToSave === true}
          />
        </ScrollView>
      </SafeAreaView>
      <OptionButton
        active={dataToSend != null}
        title="CONTINUE"
        handlePress={dataToSend ? requestSubmit : () => {}}
        textStyle={{ color: active ? globals.styles.colors.colorLavender : globals.styles.colors.colorWhite }}
        style={{ position: 'absolute', bottom: 20, borderColor: 'transparent' }}
      />
    </LinearGradient>
  )
})

export default Progress
