import React, { useLayoutEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Types
import { AccountDeletionScreenUseNavigationProp } from '../../../../config/routes/routeTypes'

// Components
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'
import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'
import { ButtonSquare } from '../../../../components/Buttons/ButtonSquare'

// Styles
import globals from '../../../../config/globals'

// Data
import api from '../../../../services/api'
import { setErrorMessage } from '../../../../services/error'
import { checkAndRedirect } from '../../../../config/utilities'

interface IAccountDeletionProps {
  navigation: AccountDeletionScreenUseNavigationProp
}
const AccountDeletion: React.FC<IAccountDeletionProps> = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>DATA DELETION REQUEST</Text>,
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
    })
  })

  async function handleDeleteRequest() {
    try {
      const resp = await api.users.requestAccountDelete()
      if (resp.sent) {
        navigation.navigate('Modals', {
          screen: 'ConfirmationDialog',
          params: {
            showCloseButton: true,
            yesLabel: 'GOT IT!',
            hideNoButton: true,
            iconType: 'check',
            yesHandler: handleBack,
            title: 'Account Deletion Request Submitted!',
            body: 'We have received your request for your account and data to be deleted. Further action may be required, so please be on the lookout for a follow-up email from us in 1-2 business days.',
          },
        })
      } else {
        setErrorMessage({ error: 'There was an error submitting your request. Please try again later.' })
      }
    } catch (error) {
      // Will get handled by global error handler
    }
  }

  function handleBack() {
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <FocusAwareStatusBar barStyle="dark-content" />
      <View style={styles.view}>
        <Text style={styles.leaderText}>
          This action will delete your workout history and personal data inside the app.{' '}
          <Text style={{ fontWeight: 'bold' }}>This action will not cancel your membership. </Text>
          In order to cancel your membership, please see our FAQ or email us at{' '}
          <Text style={{ fontWeight: 'bold' }} onPress={() => checkAndRedirect('nutrition@fitbodyapp.com')}>
            hello@fitbodyapp.com.
          </Text>
        </Text>
        <Text style={[styles.leaderText, { marginBottom: 28 }]}>
          If you would like to proceed with deleting your personal data, confirm below. Please note that this action cannot be undone and
          you will immediately lose access to the Fit Body App and all your workout progress and history.
        </Text>
        <ButtonSquare
          onPress={handleDeleteRequest}
          text="YES, DELETE MY PERSONAL DATA"
          style={styles.deleteButton}
          textStyle={styles.deleteButtonText}
        />
        <ButtonSquare onPress={handleBack} text="NO THANKS" style={styles.cancelButton} textStyle={styles.cancelButtonText} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
    alignItems: 'center',
    backgroundColor: globals.styles.colors.colorWhite,
  },
  view: {
    ...globals.styles.view,
    flex: 1,
    backgroundColor: globals.styles.colors.colorWhite,
    alignItems: 'center',
    marginHorizontal: 25,
  },
  headerTitle: {
    ...globals.header.headerTitleStyle,
  },
  leaderText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: globals.styles.fonts.primary.style.fontFamily,
    color: globals.styles.colors.colorBlack,
    marginVertical: 12,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: globals.styles.colors.colorBlack,
    width: globals.window.width - 50,
    height: 56,
    marginBottom: 24,
  },
  deleteButtonText: {
    color: globals.styles.colors.colorBlack,
    fontFamily: globals.styles.fonts.primary.boldStyle.fontFamily,
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: globals.styles.colors.colorPink,
    width: globals.window.width - 50,
    height: 56,
  },
  cancelButtonText: {
    fontFamily: globals.styles.fonts.primary.boldStyle.fontFamily,
    fontSize: 14,
  },
})

export default AccountDeletion
