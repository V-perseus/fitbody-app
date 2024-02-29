import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import * as _ from 'lodash'
import { s } from 'react-native-size-matters/extend'

// Components
import styles from './styles'
import globals from '../../config/globals'
import { SvgUriLocal } from '../../features/workouts/components/SvgUriLocal'

import Star from '../../../assets/images/svg/icon/16px/star.svg'
import Class from '../../../assets/images/svg/icon/16px/class.svg'

class HistoryMonthDay extends Component {
  state = {
    active: this.props.initialSelection,
  }

  _handleClick = () => {
    if (!this.props.future) {
      this.setState({ active: !this.state.active }, () =>
        this.props.onSelect({ day: this.props.day, dayData: this.props.dayData || [], today: this.props.today }),
      )
    }
  }

  render() {
    const hasCompletedChallenge = this.props.dayData?.some((dd) => dd.challenge_id)
    const hasCompletedVideo = this.props.dayData?.some((dd) => dd.video_id)

    return (
      <TouchableOpacity
        onPress={this._handleClick}
        style={[
          styles.calendarDayContainer,
          this.props.active ? { backgroundColor: globals.styles.colors.colorTransparentWhite15 } : null,
          this.props.today ? { borderWidth: 1, margin: 0 } : null,
          ,
        ]}>
        <View style={[styles.pseudoContainer, styles.top]}>
          <Text style={[styles.dayLabel, this.props.future ? { color: globals.styles.colors.colorTransparentWhite75 } : null]}>
            {this.props.day ? this.props.day : ''}
          </Text>
        </View>
        {this.props.dayData && !this.props.future ? (
          <View style={[styles.pseudoContainer, styles.bottom, { flex: 1 }]}>
            {this.props.dayData && this.props.dayData.length > 0 ? (
              <>
                <View style={styles.iconRow}>
                  {_.uniqBy(this.props.dayData, (v) => v.category_icon_url?.substring(v.category_icon_url.lastIndexOf('/') + 1)).map(
                    (workout) => {
                      if (workout.is_challenge || workout.is_video) {
                        return null
                      }
                      return (
                        <SvgUriLocal
                          key={workout.id}
                          color={globals.styles.colors.colorWhite}
                          fillAll={true}
                          width={s(16)}
                          height={s(16)}
                          uri={workout.category_icon_url}
                          style={styles.categoryIcon}
                        />
                      )
                    },
                  )}
                </View>
                <View style={styles.iconRow}>
                  {hasCompletedChallenge && (
                    <Star
                      style={[styles.categoryIcon, { marginRight: hasCompletedVideo ? 2 : 0 }]}
                      width={s(16)}
                      height={s(16)}
                      color={globals.styles.colors.colorWhite}
                    />
                  )}
                  {hasCompletedVideo && (
                    <Class style={styles.categoryIcon} width={s(16)} height={s(16)} color={globals.styles.colors.colorWhite} />
                  )}
                </View>
              </>
            ) : (
              <View style={[styles.pseudoContainer, styles.bottom, { height: 15 }]} />
            )}
          </View>
        ) : null}
      </TouchableOpacity>
    )
  }
}

export default HistoryMonthDay
