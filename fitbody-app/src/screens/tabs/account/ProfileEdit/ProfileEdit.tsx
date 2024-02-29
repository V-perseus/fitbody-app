import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavigationProp } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse, Asset } from 'react-native-image-picker'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import ImageResizer from 'react-native-image-resizer'
import { Image, StatusBar, Text, TextInput, TouchableOpacity, View, Platform, PermissionsAndroid } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import RNFS from 'react-native-fs'

// API
import api from '../../../../services/api'

// Services & Data
import { updateUser } from '../../../../data/user'
import { userSelector } from '../../../../data/user/selectors'
import { displayLoadingModal, hideLoadingModal } from '../../../../services/loading'

// Assets
import globals from '../../../../config/globals'
import styles from './styles'
import PlusIcon from '../../../../../assets/images/svg/icon/24px/add.svg'
import CameraIcon from '../../../../../assets/images/svg/icon/24px/camera.svg'

// Components
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'
import { ButtonOpacity } from '../../../../components/Buttons/ButtonOpacity'

// Types
import { AccountStackParamList } from '../../../../config/routes/routeTypes'
import { IUser } from '../../../../data/user/types'

interface IProfileEditProps {
  navigation: NavigationProp<AccountStackParamList, 'ProfileEdit'>
}
const ProfileEdit: React.FC<IProfileEditProps> = connectActionSheet(({ navigation, showActionSheetWithOptions }) => {
  const user = useSelector(userSelector)

  /**
   * Local state
   */
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('')
  const [profile, setProfile] = useState('')
  const [profileData, setProfileData] = useState<null | Asset>(null)
  const [month, setMonth] = useState<null | string>(null)
  const [day, setDay] = useState<null | string>(null)
  const [year, setYear] = useState<null | string>(null)
  const [resource, setResource] = useState(0) // 0: From gallery, 1: From Camera

  /**
   * Navigation props
   */
  useLayoutEffect(() => {
    /**
     * Get Original Image in Android Version
     */
    const getRotateImage = (): Promise<string> => {
      // typedef for Asset seems to be missing originalRotation property. Documentation suggests is exists
      const rotateAngle = resource === 1 ? 0 : (profileData as any)?.originalRotation // yes it does for android only
      if (profileData && profileData.uri) {
        return new Promise((resolve, reject) => {
          ImageResizer.createResizedImage(profileData.uri!, globals.window.width, globals.window.height, 'JPEG', 100, rotateAngle)
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
              // console.log(err);
              reject(err)
            })
        })
      }
      return Promise.reject('No image url provided')
    }

    /**
     * Save the user's profile information
     */
    const saveUserData = async () => {
      displayLoadingModal()
      const data: Partial<IUser> = {
        id: user.id,
        name,
        date_of_birth: `${year}-${month}-${day}`,
        city,
        state,
        zip,
        country,
        profile_picture: profile,
      }
      if (profileData) {
        // If image is taken from Camera , Rotate image
        try {
          const img = await getRotateImage()
          data.profile_picture = img
        } catch (err) {
          // console.log(err);
          hideLoadingModal()
        }
      }

      api.users
        .updateUserProfile(data)
        .then((resp) => {
          updateUser(resp.user)
          hideLoadingModal()
          navigation.goBack()
        })
        .catch(() => {
          hideLoadingModal()
        })
    }
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>MY PROFILE</Text>,
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
      headerRight: () => (
        <ButtonOpacity onPress={saveUserData} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </ButtonOpacity>
      ),
    })
  }, [navigation, city, country, day, month, name, profile, profileData, state, user.id, year, zip, resource])

  /**
   * Make the data editable when page loads
   */
  useEffect(() => {
    const birthday = user.date_of_birth ? user.date_of_birth.toString().split('-') : ['', '', '']
    setYear(birthday[0])
    setMonth(birthday[1])
    setDay(birthday[2])
    setName(user.name || '')
    setEmail(user.email || '')
    setCity(user.city || '')
    setState(user.state || '')
    setZip(user.zip || '')
    setCountry(user.country || '')
    setProfile(user.profile_picture_url || '')
  }, [])

  /**
   * Upload a new user photo
   */
  function uploadPhoto() {
    const imagePickerOptions: CameraOptions = {
      cameraType: 'front',
      mediaType: 'photo',
      includeBase64: false,
    }

    showActionSheetWithOptions(
      {
        message: 'Edit Profile Photo',
        options: ['Take Photo', 'Choose from Library', 'Cancel'],
        cancelButtonIndex: 2,
      },
      (index) => {
        // handle camera images
        if (index === 0) {
          if (Platform.OS === 'android') {
            // @DEV react-native-image-picker does not require Manifest.permission.CAMERA, if your app declares as using
            // this permission in manifest then you have to obtain the permission before using launchCamera
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then((granted) => {
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                launchCamera(imagePickerOptions, (response) => {
                  handleImagePickerResponse(response, index)
                })
              }
            })
          } else {
            launchCamera(imagePickerOptions, (response) => {
              handleImagePickerResponse(response, index)
            })
          }
        }

        // handle library images
        if (index === 1) {
          launchImageLibrary(imagePickerOptions, (response) => {
            handleImagePickerResponse(response, index)
          })
        }
      },
    )
  }

  function handleImagePickerResponse(response: ImagePickerResponse, src: number) {
    if (response.didCancel) {
      console.log('User cancelled Image Picker')
    } else if (response.errorMessage) {
      console.log('ImagePicker Error: ', response.errorMessage)
    } else if (response.errorCode) {
      console.log('ImagePicker Failed with code: ', response.errorCode)
    } else if (response.assets && response.assets?.length > 0) {
      const photo = response.assets[0]
      setProfile(photo.uri || '')
      setProfileData(photo)
      setResource(src)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView style={styles.view} showsVerticalScrollIndicator={false} enableOnAndroid={true}>
        <StatusBar barStyle="dark-content" />
        {/* Profile Image */}
        <TouchableOpacity onPress={uploadPhoto} style={{ alignItems: 'center' }}>
          <View style={styles.headshotButton}>
            {profile ? (
              <Image
                style={styles.headshot}
                source={{
                  uri: profile,
                }}
              />
            ) : (
              <PlusIcon width={40} height={40} color={globals.styles.colors.colorBlack} />
            )}
            <View style={styles.cameraButton}>
              <CameraIcon width={20} height={20} color={globals.styles.colors.colorWhite} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Full Name */}
        <Text style={styles.text}>NAME</Text>
        <TextInput
          style={styles.textFields}
          autoCorrect={false}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          secureTextEntry={false}
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
          returnKeyType="next"
        />

        {/* DATE OF BIRTH */}
        <Text style={styles.text}>DATE OF BIRTH</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextInput
            style={[styles.textFields, { width: '28%', textAlign: 'center' }]}
            autoCorrect={false}
            placeholder="MM"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={month || ''}
            onChangeText={setMonth}
            autoCapitalize="none"
            returnKeyType="next"
            keyboardType="number-pad"
          />
          <TextInput
            style={[styles.textFields, { width: '28%', textAlign: 'center' }]}
            autoCorrect={false}
            placeholder="DD"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={day || ''}
            onChangeText={setDay}
            autoCapitalize="none"
            returnKeyType="next"
            keyboardType="number-pad"
          />
          <TextInput
            style={[styles.textFields, { width: '28%', textAlign: 'center' }]}
            autoCorrect={false}
            placeholder="YYYY"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={year || ''}
            onChangeText={setYear}
            autoCapitalize="none"
            returnKeyType="next"
            keyboardType="number-pad"
          />
        </View>

        {/* EMAIL */}
        <Text style={styles.text}>EMAIL</Text>
        <TextInput
          style={[styles.textFields, { color: globals.styles.colors.colorBlack }]}
          autoCorrect={false}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          secureTextEntry={false}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          editable={false}
        />

        {/* CITY */}
        <Text style={styles.text}>CITY</Text>
        <TextInput
          style={styles.textFields}
          autoCorrect={false}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={city}
          onChangeText={setCity}
          autoCapitalize="none"
          returnKeyType="next"
        />

        {/* STATE */}
        <Text style={styles.text}>STATE</Text>
        <TextInput
          style={styles.textFields}
          autoCorrect={false}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={state}
          onChangeText={setState}
          autoCapitalize="none"
          returnKeyType="next"
        />

        {/* ZIP */}
        <Text style={styles.text}>ZIP</Text>
        <TextInput
          style={styles.textFields}
          autoCorrect={false}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={zip}
          onChangeText={setZip}
          autoCapitalize="none"
          returnKeyType="next"
        />

        {/* COUNTRY */}
        <Text style={styles.text}>COUNTRY</Text>
        <TextInput
          style={styles.textFields}
          autoCorrect={false}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={country}
          onChangeText={setCountry}
          autoCapitalize="none"
          returnKeyType="next"
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
})

export default ProfileEdit
