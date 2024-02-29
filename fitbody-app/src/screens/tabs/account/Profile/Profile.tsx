import React, { useLayoutEffect } from 'react'
import { Text, View } from 'react-native'
import { NavigationProp } from '@react-navigation/native'

// Components
// import SegueModal from '../../../../components/SegueModal/SegueModal'
import UserProfileDetails from '../../../../components/UserProfileDetails'
import UserProfileInfo from '../../../../components/UserProfileInfo'
import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

// Assets
import styles from './styles'
import globals from '../../../../config/globals'
import EditIcon from '../../../../../assets/images/svg/icon/24px/edit.svg'

// Types
import { AccountStackParamList } from '../../../../config/routes/routeTypes'

interface IProfileProps {
  navigation: NavigationProp<AccountStackParamList, 'ProfileView'>
}
const Profile: React.FC<IProfileProps> = ({ navigation }) => {
  // const [recommendedProductLink, setRecommendedProductLink] = useState('')
  // const [showModal, setShowModal] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} iconColor={globals.styles.colors.colorWhite} />,
      headerTitle: () => <Text style={styles.headerTitle}>MY PROFILE</Text>,
      headerRight: () => (
        <HeaderButton
          onPress={() => {
            navigation.navigate('ProfileEdit')
          }}>
          <EditIcon color={globals.styles.colors.colorWhite} />
        </HeaderButton>
      ),
    })
  }, [navigation])

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" />
      <UserProfileInfo />
      <UserProfileDetails />
      {/* <SegueModal
        modalText={'Open link in browser?'}
        noButtonText={'CANCEL'}
        yesButtonText={'VISIT'}
        url={recommendedProductLink}
        showModal={showModal}
        setShowModal={setShowModal}
      /> */}
    </View>
  )
}

export default Profile
