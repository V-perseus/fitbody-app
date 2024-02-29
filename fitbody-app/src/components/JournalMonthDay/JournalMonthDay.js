import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

// Components
import styles from './styles'
import globals from '../../config/globals'
import { MoodsIconMap } from '../../config/svgs/dynamic/moodsMap'

class HistoryMonthDay extends Component {
  state = {
    active: this.props.initialSelection,
  }

  _handleClick = () => {
    if (this.props.onSelect && !this.props.future) {
      this.setState({ active: !this.state.active }, () =>
        this.props.onSelect({ day: this.props.day, dayData: this.props.dayData, today: this.props.today }),
      )
    }
  }

  render() {
    const SvgIcon = this.props.mood && MoodsIconMap[this.props.mood.icon_key]
    return (
      <TouchableOpacity
        onPress={this._handleClick}
        style={[
          styles.calendarDayContainer,
          this.props.active ? { backgroundColor: globals.styles.colors.colorTransparentWhite15 } : null,
          this.props.today ? { borderWidth: 1, margin: 0 } : null,
        ]}>
        <View style={[styles.pseudoContainer, styles.top]}>
          <Text style={[styles.dayLabel, this.props.future ? { color: globals.styles.colors.colorTransparentWhite75 } : null]}>
            {this.props.day ? this.props.day : ''}
          </Text>
        </View>
        {this.props.mood ? (
          <View style={[styles.pseudoContainer, styles.bottom]}>
            <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
              <SvgIcon width={25} height={25} color={globals.styles.colors.colorWhite} />
              {!!this.props.period && (
                <View
                  style={{
                    marginTop: 5,
                    height: 5,
                    width: 5,
                    borderRadius: 2.5,
                    backgroundColor: globals.styles.colors.colorWhite,
                    opacity: 0.5,
                  }}
                />
              )}
            </View>
          </View>
        ) : (
          <View style={[styles.pseudoContainer, styles.bottom, { height: 15 }]} />
        )}
      </TouchableOpacity>
    )
  }
}

export default HistoryMonthDay
