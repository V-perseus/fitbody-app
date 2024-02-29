import { Linking } from 'react-native'

export const openEmail = (emailAddress: string) => {
  return openLink(`mailto:${emailAddress}`)
}

export const openPhone = (phoneNumber: number) => {
  return openLink(`tel:${phoneNumber}`)
}

export const openLink = async (url: string) => {
  const supported = await Linking.canOpenURL(url)
  if (supported) {
    return Linking.openURL(url)
      .then(() => true)
      .catch(() => false)
  }
  return false
}

/**
 * check for a valid email
 */
export const checkValidEmail = (email: string) => /(.+)@(.+){2,}\.(.+){2,}/.test(email)

export const checkAndRedirect = (link: string) => {
  checkValidEmail(link) ? openEmail(link) : openLink(link)
}
