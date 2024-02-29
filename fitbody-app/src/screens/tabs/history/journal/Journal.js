import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import moment from 'moment'
import * as _ from 'lodash'
import { ScrollView, Text, TouchableOpacity, View, Platform } from 'react-native'
import { NavigationEvents, withNavigationFocus } from '@react-navigation/compat'
import LinearGradient from 'react-native-linear-gradient'

// Components
import HistoryMonthDay from '../../../../components/JournalMonthDay'
import HistoryMonthHeader from '../../../../components/HistoryMonthHeader'
// import HistoryDay from '../../../../components/HistoryDay'
import BottomUpPanel from '../../../../components/BottomUpPanel'
import JournalOverview from '../../../../components/JournalOverview'
// import ExtraMoodOverview from '../../../../components/ExtraMoodOverview'
import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'
import EditIcon from '../../../../../assets/images/svg/icon/24px/edit.svg'

// styles
import styles from './style'
import globals from '../../../../config/globals'

// Actions
import { journalSelector, moodSelector } from '../../../../data/journal/selectors'
import * as dateActionCreators from '../../../../services/dates'
import NavigationService from '../../../../services/NavigationService'
import { getJournals, getMoods, getActivities } from '../../../../data/journal'

const JournalOverviewHeader = (props) => {
  return (
    <View style={addPanelStyles.journalContainer}>
      <View style={addPanelStyles.titleContainer}>
        <Text style={addPanelStyles.titleLabel}>{moment(props.journal.entry_date).format('dddd, MMMM D').toUpperCase()}</Text>
        <TouchableOpacity
          style={journalPreviewStyles.edit}
          onPress={() => {
            NavigationService.navigate('EditJournal', { date: props.journal.entry_date })
          }}>
          <EditIcon color={globals.styles.colors.colorBlack} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const AddPanel = (props) => {
  return (
    <View style={addPanelStyles.container}>
      <View style={addPanelStyles.titleContainer}>
        <Text style={addPanelStyles.titleLabel}>{props.date ? moment(props.date).format('dddd, MMMM D').toUpperCase() : ''}</Text>
      </View>
      <View style={{ alignItems: 'center', paddingTop: 30 }}>
        <TouchableOpacity
          onPress={() => {
            NavigationService.navigate('EditJournal', { date: props.date })
          }}>
          <View style={addPanelStyles.addButton}>
            <Text style={addPanelStyles.addButtonText}>ADD JOURNAL ENTRY</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

class Journal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //   // history: [...Array(moment().daysInMonth()-1).keys()].reduce((prev, cur) => prev[moment().startOf('month').add(cur, 'days').format('YYYY-MM-DD')] = { workouts: [], challenges: [] }, {}),
    }
    this._onDidFocus = this._onDidFocus.bind(this)
  }

  componentWillMount() {
    const params = this.props.route.params

    if (params && params.date) {
      this.setState({
        selection: { ...this.state.selection, userPicked: true, date: moment(params.date) },
      })
      dateActionCreators.getMonth(moment(params.date).format())
    }
    this.getMonthData()
  }

  onPressWeekToggle = () => {
    this.props.navigation.replace('Week', { date: this.state.selection.date.format('YYYY-MM-DD') })
  }

  /**
   * Watch for changing month
   */
  componentDidUpdate(prevProps) {
    if (!moment(prevProps.data.date.month).isSame(this.props.data.date.month, 'month')) {
      // console.log('refreshing month data!')
      this.getMonthData()
    }
  }

  getCurrentWorkoutGoal() {
    return this.props.data.user.workout_goal
  }

  loadJournalData = () => {
    getMoods()
    getActivities()
  }

  /**
   * Get the month data
   */
  _getMonthData() {
    if (!_.get(this.props, 'data.date.month', false)) {
      return
    }

    this.loadJournalData()
    getJournals({
      start: moment(this.props.data.date.month).startOf('month').format('YYYY-MM-DD'),
      end: moment(this.props.data.date.month).endOf('month').format('YYYY-MM-DD'),
    })

    let isThisMonth = moment().isSame(moment(this.props.data.date.month), 'month')

    let dayIndex = moment().date()

    let isStartMonth = moment(this.props.data.user.created_at).isSame(moment(this.props.data.date.month), 'month')
    let startDayIndex = moment(this.props.data.user.created_at).date()

    let selectedDay = moment(this.props.data.date.month).date()

    if (!(this.state.selection || {}).userPicked) {
      if (isThisMonth) {
        selectedDay = dayIndex
      } else if (isStartMonth) {
        selectedDay = startDayIndex
      }
    }

    let selection = {
      userPicked: (this.state.selection || {}).userPicked,
      date: moment(this.props.data.date.month)
        .startOf('month')
        .add(selectedDay - 1, 'days'),
      day: selectedDay,
      today: isThisMonth && selectedDay === dayIndex,
    }

    this.setState({ selection })
  }

  getMonthData = _.debounce(this._getMonthData, 2000, {
    leading: true,
  })

  /**
   * Get the next month
   */
  _getNextMonth = () => {
    dateActionCreators.getNextMonth(moment(this.props.data.date.month).startOf('month').format())
  }

  /**
   * Get the previous month
   */
  _getPastMonth = () => {
    dateActionCreators.getPreviousMonth(moment(this.props.data.date.month).startOf('month').format())
  }

  _selectDay = (selection) => {
    dateActionCreators.getMonth(
      moment(this.props.data.date.month)
        .startOf('month')
        .add(selection.day - 1, 'days')
        .format(),
    )
    this.setState({
      selection: {
        ...selection,
        userPicked: true,
        date: moment(this.props.data.date.month)
          .startOf('month')
          .add(selection.day - 1, 'days'),
      },
    })
  }

  /**
   * Build out the days needed in the calendar view
   */
  buildMonthCalendar = () => {
    const days = []

    let isThisMonth = moment().isSame(moment(this.props.data.date.month), 'month')
    let dayIndex = moment().date()

    let isStartMonth = moment(this.props.data.user.created_at).isSame(moment(this.props.data.date.month), 'month')
    let startDayIndex = moment(this.props.data.user.created_at).date()

    for (let i = 0; i < this.props.data.date.startOffset; i++) {
      days.push(<HistoryMonthDay key={`start-${i}`} />)
    }

    for (let i = 1; i <= this.props.data.date.daysInMonth; i++) {
      const journal = this.props.journal(
        moment(this.props.data.date.month)
          .startOf('month')
          .add(i - 1, 'days')
          .format('YYYY-MM-DD'),
      )
      const mood = journal ? this.props.mood(journal.main_mood_id) : null

      days.push(
        <HistoryMonthDay
          onSelect={this._selectDay}
          active={this.state.selection && this.state.selection.day == i}
          key={`${i}`}
          today={isThisMonth && i === dayIndex}
          future={(isThisMonth && i > dayIndex) || (isStartMonth && i < startDayIndex)}
          day={i}
          mood={mood}
          period={journal?.journal_activity_ids?.includes(15)}
        />,
      )
    }

    for (let i = 0; i <= this.props.data.date.endOffset; i++) {
      days.push(<HistoryMonthDay key={`end-${i}`} />)
    }
    return days
  }

  _onDidFocus() {
    this.getMonthData()
  }
  render() {
    if (!this.props.isFocused) {
      return <NavigationEvents onDidFocus={() => this._onDidFocus()} />
    }

    const date = this.state.selection
      ? moment(this.state.selection.date)
          .startOf('month')
          .add(this.state.selection.day - 1, 'days')
          .format('YYYY-MM-DD')
      : null

    const height = globals.window.height

    // TODO remove these nested scrollviews
    return (
      <View style={{ backgroundColor: globals.styles.colors.colorSkyBlue, flex: 1 }}>
        <ScrollView style={{ marginBottom: Platform.select({ ios: 170, android: 166 }) }}>
          <LinearGradient style={styles.backgroundImage} colors={[globals.styles.colors.colorPink, globals.styles.colors.colorSkyBlue]}>
            <FocusAwareStatusBar barStyle="dark-content" />
            <NavigationEvents onDidFocus={() => this._onDidFocus()} />
            <HistoryMonthHeader onNextMonth={this._getNextMonth} onPastMonth={this._getPastMonth} />
            <ScrollView style={styles.daysContainer} contentContainerStyle={styles.daysScroll}>
              {this.buildMonthCalendar()}
            </ScrollView>
          </LinearGradient>
          {/* <LinearGradient
            style={[styles.backgroundImage, { marginLeft: 13, width: globals.window.width - 26, height: 17, marginTop: -6 }]}
            colors={['#7bc1ff99', '#7bc1ff99']}
          >
          </LinearGradient>
          <LinearGradient
            style={[styles.backgroundImage, { marginLeft: 33, width: globals.window.width - 66, height: 22, marginTop: -11 }]}
            colors={['#7bc1ff4C', '#7bc1ff4C']}
          >
          </LinearGradient> */}

          {/* {this.state.selection && this.state.selection.dayData && <HistoryDay context="Month" style={{marginTop: 19}} date={this.state.selection ? moment(this.props.data.date.month).startOf('month').add(this.state.selection.day - 1, 'days') : null} dayData={this.state.selection ? this.state.selection.dayData : null} /> } */}
        </ScrollView>
        {this.state.selection && this.state.selection.date && !!this.props.journal(this.state.selection.date.format('YYYY-MM-DD')) ? (
          <BottomUpPanel
            isOpen={false}
            header={() => <JournalOverviewHeader journal={this.props.journal(this.state.selection.date.format('YYYY-MM-DD'))} />}
            content={() => (
              <JournalOverview
                date={this.state.selection && this.state.selection.date ? this.state.selection.date.format('YYYY-MM-DD') : null}
              />
            )}
            startHeight={Platform.select({ ios: 204, android: 200 })}
            topEnd={240}
            contentContainerStyle={{ flex: 1 }}
          />
        ) : (
          <AddPanel date={this.state.selection && this.state.selection.date ? this.state.selection.date.format('YYYY-MM-DD') : null} />
        )}
      </View>
    )
  }
}

const enhance = compose(
  connect(
    // mapStateToProps
    (state) => {
      return {
        data: {
          user: state.data.user,
          date: state.services.date,
        },
        journal: journalSelector(state),
        mood: moodSelector(state),
        journals: state.data.journal.journals,
      }
    },
  ),
  withNavigationFocus,
)

export default enhance(Journal)

const journalPreviewStyles = {
  activityTitle: {
    borderTopWidth: 1,
    borderColor: '#eaeaea',
    fontFamily: globals.fonts.secondary.style.fontFamily,
    textAlign: 'left',
    fontSize: 23,
    color: globals.styles.colors.colorBlack,
    paddingLeft: 31,
    paddingTop: 22,
  },
  edit: {
    width: 65,
    height: 25,
    position: 'absolute',
    right: 15,
    paddingTop: 2,
    alignItems: 'center',
  },
}

const addPanelStyles = {
  addButton: {
    width: globals.window.width * 0.9,
    height: 55,
    borderRadius: 35,
    justifyContent: 'center',
    backgroundColor: globals.styles.colors.colorPink,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: globals.styles.colors.colorPink,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  addButtonText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.39,
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
  },
  titleLabel: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    textAlign: 'center',
    fontSize: 24,
    color: globals.styles.colors.colorBlack,
  },
  journalContainer: {
    alignSelf: 'stretch',
    backgroundColor: globals.styles.colors.colorWhite,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    shadowOffset: { width: 0, height: 10 },
    shadowColor: globals.styles.colors.colorGrayDark,
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 21,
  },
  container: {
    // borderWidth:2,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: globals.styles.colors.colorWhite,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    shadowOffset: { width: 0, height: 10 },
    shadowColor: globals.styles.colors.colorGrayDark,
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 21,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 22,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: globals.styles.colors.colorGray,
  },
}
