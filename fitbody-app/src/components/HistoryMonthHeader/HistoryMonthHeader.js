import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'

// Components
import LeftEmptyArrow from '../../../assets/images/svg/icon/24px/circle/cheveron-left.svg'
import RightEmptyArrow from '../../../assets/images/svg/icon/24px/circle/cheveron-right.svg'

// Assets
import styles from './styles'

import { setErrorMessage } from '../../services/error'
import globals from '../../config/globals'
import { ButtonOpacity } from '../Buttons/ButtonOpacity'

class HistoryMonthHeader extends Component {
  render() {
    const { date } = this.props

    const canMoveForward = moment().isAfter(moment(date.month).endOf('month'))
    const canMoveBack = moment(this.props.startDate).isBefore(moment(date.month).startOf('month'))

    return (
      <View>
        <View style={styles.container}>
          <ButtonOpacity
            onPress={() =>
              canMoveBack
                ? this.props.onPastMonth()
                : setErrorMessage({
                    error: "Hey babe! You're already on the first month of your Fit Body journey!",
                  })
            }>
            <LeftEmptyArrow color={globals.styles.colors.colorWhite} style={{ opacity: canMoveBack ? 1 : 0.7 }} height={26} width={26} />
          </ButtonOpacity>
          <Text style={styles.monthLabel}>{date.monthString}</Text>
          <ButtonOpacity onPress={this.props.onNextMonth} disabled={!canMoveForward}>
            <RightEmptyArrow
              color={globals.styles.colors.colorWhite}
              style={{ opacity: canMoveForward ? 1 : 0.7 }}
              height={26}
              width={26}
            />
          </ButtonOpacity>
        </View>
        <View style={styles.dayContainer}>
          <View style={styles.dayView}>
            <Text style={styles.dayLabel}>SUN</Text>
          </View>
          <View style={styles.dayView}>
            <Text style={styles.dayLabel}>MON</Text>
          </View>
          <View style={styles.dayView}>
            <Text style={styles.dayLabel}>TUE</Text>
          </View>
          <View style={styles.dayView}>
            <Text style={styles.dayLabel}>WED</Text>
          </View>
          <View style={styles.dayView}>
            <Text style={styles.dayLabel}>THU</Text>
          </View>
          <View style={styles.dayView}>
            <Text style={styles.dayLabel}>FRI</Text>
          </View>
          <View style={styles.dayView}>
            <Text style={styles.dayLabel}>SAT</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default connect(
  // mapStateToProps
  (state) => ({
    startDate: state.data.user.created_at,
    date: state.services.date,
  }),
)(HistoryMonthHeader)
