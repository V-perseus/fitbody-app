import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { subscribe } from 'redux-subscriber'
import ReactTimeout from 'react-timeout'
import Modal from 'react-native-modal'

// Services & Data
import * as errorActionCreators from '../../services/error/actions'
import * as modalActionCreators from '../../services/modal/actions'
import * as loadingActionCreators from '../../services/loading/actions'

// Assets
import styles from './styles'
import LoadingGif from '../../../assets/gif/loading.gif'
import { GlobalModalProviderIcons } from '../../config/svgs/dynamic/globalModalProviderIcons'

class GlobalModalProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      whichModal: null,
      error: null,
      errorIcon: null,
      iconColor: null,
      duration: 3000,
    }
  }

  /**
   * On mount watch for the services
   */
  componentDidMount() {
    subscribe('services', (state) => {
      let error = state.services.error.isVisible
      let loading = false
      let errorString = state.services.error.error
      let errorIcon = state.services.error.errorIcon
      let iconColor = state.services.error.iconColor
      let duration = state.services.error.duration

      // SHOW LOADING
      if (loading && !error && !this.state.isVisible) {
        this.setState({ isVisible: true, whichModal: 'loading' })
      }
      // HIDE LOADING
      else if (!loading && !error && this.state.isVisible) {
        this.setState({ isVisible: false })
      }
      // SHOW ERROR
      else if (!loading && error && !this.state.isVisible) {
        this.setState({
          isVisible: true,
          whichModal: 'error',
          error: errorString,
          errorIcon: errorIcon,
          iconColor: iconColor,
          duration,
        })
        this.props.setTimeout(this.handleErrorModalTimeout, duration)
      }
      // HIDE ERROR
      else if (!loading && !error && this.state.isVisible) {
        this.setState({ isVisible: false, error: null })
      }
    })
  }

  /**
   * Hide the modal after duration
   */
  handleErrorModalTimeout = () => {
    this.props.actions.error.clear()
  }

  render() {
    const { error, iconColor, errorIcon, whichModal, isVisible } = this.state
    const SvgIcon = GlobalModalProviderIcons?.[errorIcon]
    return (
      <Modal
        avoidKeyboard={true}
        backdropOpacity={0.5}
        useNativeDriver={true}
        disableAnimation={whichModal === 'loading'}
        animationIn={whichModal === 'error' ? 'slideInDown' : 'fadeIn'}
        animationOut={whichModal === 'error' ? 'slideOutUp' : 'fadeOut'}
        animationInTiming={whichModal === 'error' ? 600 : null}
        animationOutTiming={whichModal === 'error' ? 600 : null}
        isVisible={isVisible}
        style={whichModal === 'loading' ? styles.loadingModal : styles.errorModal}
        onModalHide={this.props.actions.loading.dismiss}>
        <View style={whichModal === 'loading' ? styles.loadingView : styles.errorView}>
          {whichModal === 'loading' ? (
            <Image source={LoadingGif} style={styles.gifSize} resizeMode="contain" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32 }}>
              {SvgIcon && <SvgIcon color={iconColor} />}
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </Modal>
    )
  }
}

export default connect(
  // mapStateToProps
  (state) => ({
    services: {
      error: state.services.error,
      modal: state.services.modal,
      loading: state.services.loading,
    },
  }),
  // matchDispatchToProps
  (dispatch) => ({
    actions: {
      error: bindActionCreators(errorActionCreators, dispatch),
      modal: bindActionCreators(modalActionCreators, dispatch),
      loading: bindActionCreators(loadingActionCreators, dispatch),
    },
  }),
)(ReactTimeout(GlobalModalProvider))
