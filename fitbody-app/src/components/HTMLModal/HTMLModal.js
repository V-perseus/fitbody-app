import React from 'react'
import { TouchableOpacity, View, ScrollView, Text } from 'react-native'
import HTML from 'react-native-render-html'
import LinearGradient from 'react-native-linear-gradient'

// Assets
import globals from '../../config/globals'
import styles from './styles'
import CloseIcon from '../../../assets/images/svg/icon/24px/close.svg'

class HTMLModal extends React.Component {
  processMarkup(htmlContent) {
    if (!htmlContent) {
      return '<div></div>'
    }
    htmlContent = htmlContent.replace(new RegExp('↵', 'g'), '')
    htmlContent = htmlContent.replace(new RegExp('style="[^"]*"', 'g'), '')
    htmlContent = htmlContent.replace(new RegExp('style="[^"]*"', 'g'), '')
    htmlContent = htmlContent.trim()
    if (htmlContent.substr(0, 1) === '"') {
      htmlContent = htmlContent.substr(1)
    }
    if (htmlContent.substr(-1, 1) === '"') {
      htmlContent = htmlContent.substr(0, htmlContent.length - 1)
    }
    return htmlContent
  }

  render() {
    const tagStyles = {
      p: {
        display: 'flex',
        flexWrap: 'wrap',
        height: 'auto',
        marginBottom: 20,
      },
      body: {
        flexDirection: 'column',
        flex: 1,
      },
      li: {
        marginLeft: 0,
        paddingLeft: 0,
      },
      ul: {
        marginLeft: 0,
        paddingLeft: 0,
      },
      ol: {
        marginLeft: 0,
        paddingLeft: 0,
      },
    }

    return (
      <LinearGradient
        style={[globals.bgImage.style, styles.modal]}
        colors={[globals.styles.colors.colorLavender, globals.styles.colors.colorPurple]}>
        <View style={styles.internalModal}>
          <View style={styles.header}>
            <Text style={styles.title}>{this.props.title}</Text>
            <TouchableOpacity onPress={this.props.onClose} style={styles.closeWrapper}>
              <CloseIcon style={styles.closeIcon} color={globals.styles.colors.colorBlack} width={30} height={30} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            <HTML
              html={this.processMarkup(this.props.content)}
              styles={styles.html}
              staticContentMaxWidth={globals.window.width * 0.8}
              imagesMaxWidth={globals.window.width * 0.8}
              tagsStyles={tagStyles}
            />
          </ScrollView>
        </View>
      </LinearGradient>
    )
  }
}
export default HTMLModal
