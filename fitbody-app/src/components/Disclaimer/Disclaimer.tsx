import React from 'react'
import { Linking, Pressable, ScrollView, Text, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { ms } from 'react-native-size-matters/extend'
import HTML from 'react-native-render-html'

import Health from '../../../assets/images/svg/icon/40px/health.svg'
import globals from '../../config/globals'
import styles from './styles'
import { DisclaimerOptionsProps } from '../../config/routes/routeTypes'

interface IDisclaimerProps extends DisclaimerOptionsProps {}
const Disclaimer: React.FC<IDisclaimerProps> = ({ route, navigation }) => {
  const { title, body, acceptHandler, approvalRequired } = route.params

  function onAccept() {
    acceptHandler()
  }

  function declineHandler() {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <Animatable.View animation="fadeInUp">
          <View style={styles.modalContents}>
            <Health />
            <Text style={styles.modalTitle}>{title}</Text>
            <ScrollView style={styles.scrollView}>
              <HTML
                html={body}
                onLinkPress={(_, href) => Linking.openURL(href)}
                listsPrefixesRenderers={{
                  ul: () => {
                    return (
                      <Text
                        style={{ backgroundColor: globals.styles.colors.colorPink, width: 6, height: 6, marginTop: 6, marginRight: 8 }}
                      />
                    )
                  },
                }}
                tagsStyles={{
                  p: {
                    fontSize: ms(14),
                    marginVertical: 11,
                    textAlign: 'center',
                  },
                  a: {
                    textDecorationLine: 'none',
                  },
                  ul: {
                    paddingLeft: 0,
                    fontSize: ms(12),
                    marginBottom: 0,
                  },
                }}
              />
            </ScrollView>
            {approvalRequired ? (
              <View style={styles.buttonContainer}>
                <Pressable style={styles.activeButton} onPress={onAccept}>
                  <Text style={styles.activeLabel}>ACCEPT</Text>
                </Pressable>
                <Pressable style={styles.inactiveButton} onPress={declineHandler}>
                  <Text style={styles.inactiveLabel}>DECLINE</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <Pressable style={styles.activeButton} onPress={onAccept}>
                  <Text style={styles.activeLabel}>GOT IT!</Text>
                </Pressable>
              </View>
            )}
          </View>
        </Animatable.View>
      </View>
    </View>
  )
}

export default Disclaimer
