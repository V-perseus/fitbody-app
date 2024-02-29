import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import moment from 'moment'

// Components
import LeftEmptyArrow from '../../../assets/images/svg/icon/24px/circle/cheveron-left.svg'
import RightEmptyArrow from '../../../assets/images/svg/icon/24px/circle/cheveron-right.svg'

// Assets
import styles from './styles'
import globals from '../../config/globals'

class HistoryWeekHeader extends Component {
  render() {
    const { week } = this.props

    const canMoveForward = moment().isAfter(week[1])
    const canMoveBack = moment(this.props.startDate).isBefore(week[0])

    return (
      <View style={{ width: '100%', backgroundColor: globals.styles.colors.colorWhite }}>
        <LinearGradient colors={[globals.styles.colors.colorPink, globals.styles.colors.colorLavender]} style={styles.container}>
          {/* Left Arrow */}
          <TouchableOpacity onPress={this.props.onPastWeek} disabled={!canMoveBack}>
            <LeftEmptyArrow
              style={[styles.iconMargin, { opacity: canMoveBack ? 1 : 0.7 }]}
              color={globals.styles.colors.colorWhite}
              height={26}
              width={26}
            />
          </TouchableOpacity>
          {/* Label */}
          <View style={styles.weekContainer}>
            <Text style={styles.monthLabel}>{`${week[0].format('MMM D').toUpperCase()} - ${week[1].format('MMM D').toUpperCase()}`}</Text>
          </View>
          {/* Right Arrow */}
          <TouchableOpacity onPress={this.props.onNextWeek} disabled={!canMoveForward}>
            <RightEmptyArrow
              style={[styles.iconMargin, { opacity: canMoveForward ? 1 : 0.7 }]}
              color={globals.styles.colors.colorWhite}
              height={26}
              width={26}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    )
  }
}

export default connect(
  // mapStateToProps
  (state) => ({
    startDate: state.data.user.created_at,
  }),
  // mapDispatchToProps
  null,
)(HistoryWeekHeader)
