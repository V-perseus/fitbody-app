import React, { Component } from 'react'
import { Text, TouchableOpacity, View, TextInput } from 'react-native'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import * as _ from 'lodash'

// styles
import styles from './styles'
import globals from '../../../../config/globals'

// Components
import CloseIcon from '../../../../../assets/images/svg/icon/24px/close.svg'
import { ActivityItem } from '../../../../components/ActivityItem/ActivityItem'
import MoodCarousel from '../../../../components/MoodCarousel'
import ExtraMoodOverview from '../../../../components/ExtraMoodOverview/ExtraMoodOverview'
import { ButtonOpacity } from '../../../../components/Buttons/ButtonOpacity'

// Services
import { journalSelector, moodSelector, activitiesSelector, activitySelector } from '../../../../data/journal/selectors'
import { sortMoodByOrder } from '../../../../services/helpers'
import { createJournal, updateJournal } from '../../../../data/journal'

class EditJournal extends Component {
  state = {
    mainMood: { id: 1 },
    extraMoods: [],
    myActivities: [],
    sthDidToday: '',
    sthDoTmrw: '',
    sthProudToday: '',
    otherNote: '',
  }

  async componentDidMount() {
    const { journal } = this.props

    this.setState(this.composeStateFromProps(journal))
  }

  componentDidUpdate(prevProps) {
    const { journal } = this.props
    if (!_.isEqual(prevProps.journal, journal)) {
      this.setState(this.composeStateFromProps(journal))
    }
  }

  composeStateFromProps = (journal) => {
    if (!journal) {
      return {
        mainMood: { id: 1 },
      }
    }

    const { main_mood_id, accomplished_today, accomplish_tmrw, proud_of_today, additional_thoughts, mood_items, journal_activity_ids } =
      journal
    return {
      mainMood: { id: main_mood_id ? main_mood_id : 1 },
      sthDidToday: accomplished_today,
      sthDoTmrw: accomplish_tmrw,
      sthProudToday: proud_of_today,
      otherNote: additional_thoughts,
      extraMoods: [...mood_items].sort(sortMoodByOrder),
      myActivities: journal_activity_ids,
    }
  }

  handleGoBack = () => {
    this.props.navigation.goBack()
  }

  handleTapItem = (index) => {
    const { activities } = this.props
    const { myActivities } = this.state
    const { id: activityIndex } = activities[index] || {}

    if (myActivities.includes(activityIndex)) {
      this.setState({ myActivities: myActivities.filter((avty) => avty !== activityIndex) })
    } else {
      this.setState({ myActivities: [activityIndex, ...myActivities] })
    }
  }

  handleChangeMainMood = (moodId) => {
    let patchState = { mainMood: { id: moodId } }
    if (this.state.extraMoods.map((m) => m.id).includes(moodId)) {
      patchState = { ...patchState, extraMoods: this.state.extraMoods.filter((x) => x.id !== moodId) }
    }
    this.setState(patchState)
  }

  handleChangeSthDidToday = (text) => {
    this.setState({ sthDidToday: text })
  }

  handleChangeSthDoTmrw = (text) => {
    this.setState({ sthDoTmrw: text })
  }

  handleChangeSthProudToday = (text) => {
    this.setState({ sthProudToday: text })
  }

  handleChangeOtherNote = (text) => {
    this.setState({ otherNote: text })
  }

  handleSave = () => {
    const { journal } = this.props
    const { mainMood, extraMoods, sthDidToday, sthDoTmrw, sthProudToday, otherNote, myActivities } = this.state

    const payload = {
      accomplished_today: sthDidToday,
      accomplish_tmrw: sthDoTmrw,
      additional_thoughts: otherNote,
      proud_of_today: sthProudToday,
      entry_date: this.props.date,
      moods: [
        { id: mainMood.id, primary: true, order: 0 },
        ...extraMoods.map((mood) => ({ id: mood.id, primary: false, order: mood.order })),
      ],
      has_period: myActivities.includes(15),
      journal_activities: myActivities,
    }

    console.log('payload', payload)

    if (journal) {
      updateJournal({ journalId: journal.id, data: payload, onSuccess: this.handleGoBack })
    } else {
      createJournal({ data: payload, onSuccess: this.handleGoBack })
    }
  }

  keyExtractor = (item, index) => `activity-${index}`

  renderItem = ({ item, index }) => {
    if (_.isEmpty(item)) {
      return null
    }

    const { myActivities } = this.state

    let iconContainerStyle
    let textStyle
    let fillColor

    if (myActivities.includes(item.id)) {
      textStyle = [styles.tileText, styles.selectedActivityText]
      iconContainerStyle = styles.selectedIconContainer
      fillColor = globals.styles.colors.colorWhite
    } else {
      textStyle = [styles.tileText, styles.unselectedActivityText]
      iconContainerStyle = [styles.iconContainer, styles.unselectedIconContainer]
      fillColor = globals.styles.colors.colorGrayDark
    }

    return (
      <ActivityItem
        name={item.name}
        iconKey={item.icon_key}
        onPress={() => this.handleTapItem(index)}
        iconColor={fillColor}
        containerStyle={styles.tile}
        iconContainerStyle={iconContainerStyle}
        textStyle={textStyle}
        index={index}
      />
    )
  }

  handleAddExtraMood = () => {
    const { mainMood, extraMoods } = this.state
    this.props.navigation.navigate('EditExtraMood', { mainMood, extraMoods, onExtraMoodAdded: this.handleExtraMoodAdded })
  }

  handleExtraMoodAdded = (extraMoods) => {
    this.setState({ extraMoods })
  }

  renderHeader = () => {
    const { getMoodFromId } = this.props
    const { mainMood, extraMoods } = this.state
    const mainMoodObj = getMoodFromId(mainMood.id || 1)

    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.titleLabel}>{moment(this.props.date).format('dddd, MMMM D').toUpperCase()}</Text>
        <ButtonOpacity onPress={this.handleGoBack} style={styles.close}>
          <CloseIcon color={globals.styles.colors.colorWhite} />
        </ButtonOpacity>
        <MoodCarousel onChangeMood={this.handleChangeMainMood} mainMood={mainMood.id} />
        <Text style={styles.feelLabel}>TODAY I FEEL:</Text>
        <View style={styles.activityContainer}>
          <View style={styles.activity}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: globals.styles.colors.colorGray }}>
              <View style={styles.mainMoodLabelContainer}>
                <Text style={styles.mainMoodLabel}>{mainMoodObj.name.toUpperCase()}</Text>
              </View>
              <ExtraMoodOverview extraMoods={extraMoods} onAdd={this.handleAddExtraMood} editable />
            </View>
            <Text style={styles.activityTitle}>TODAY I:</Text>
          </View>
        </View>
      </View>
    )
  }

  renderFooter = () => {
    const { sthDidToday, sthDoTmrw, sthProudToday, otherNote } = this.state
    const sharedProps = {
      style: styles.input,
      underlineColorAndroid: 'transparent',
      multiline: true,
    }
    return (
      <View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOMETHING I ACCOMPLISHED TODAY:</Text>
          <TextInput
            returnKeyType="done"
            blurOnSubmit={true}
            value={sthDidToday}
            onChangeText={this.handleChangeSthDidToday}
            placeholder="Hit a personal record, tracked my macros..."
            {...sharedProps}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOMETHING I WANT TO DO TOMORROW:</Text>
          <TextInput
            blurOnSubmit={true}
            returnKeyType="done"
            value={sthDoTmrw}
            onChangeText={this.handleChangeSthDoTmrw}
            {...sharedProps}
            placeholder="Meal prep, drink more water, get more sleep..."
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOMETHING I’M PROUD OF TODAY:</Text>
          <TextInput
            returnKeyType="done"
            blurOnSubmit={true}
            value={sthProudToday}
            onChangeText={this.handleChangeSthProudToday}
            placeholder="I felt confident and empowered, I stood up for myself..."
            {...sharedProps}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ADDITIONAL THOUGHTS</Text>
          <TextInput
            value={otherNote}
            blurOnSubmit={true}
            onChangeText={this.handleChangeOtherNote}
            placeholder="..."
            returnKeyType="done"
            {...sharedProps}
          />
        </View>
        <View style={styles.section} />
      </View>
    )
  }

  render() {
    const { activities } = this.props
    return (
      <LinearGradient style={{ flex: 1 }} colors={globals.styles.gradients.SCREEN}>
        <KeyboardAwareFlatList
          columnWrapperStyle={styles.activityColumnWrapper}
          data={activities}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderHeader()}
          ListFooterComponent={this.renderFooter()}
          numColumns={4}
          keyExtractor={this.keyExtractor}
          enableOnAndroid
        />
        <LinearGradient
          colors={['#ffffff00', '#ffffffff', '#ffffffff']}
          style={{
            justifyContent: 'flex-end',
            paddingBottom: 20,
            position: 'absolute',
            height: 174,
            bottom: 0,
            width: globals.window.width,
            paddingHorizontal: 31,
          }}>
          <TouchableOpacity style={styles.saveButton} onPress={this.handleSave}>
            <Text style={styles.saveButtonText}>SAVE JOURNAL ENTRY</Text>
          </TouchableOpacity>
        </LinearGradient>
      </LinearGradient>
    )
  }
}

export default connect((state, ownProps) => {
  let date = ownProps.route.params ? ownProps.route.params.date : null
  if (!date) {
    date = moment().format('YYYY-MM-DD')
  }
  return {
    date,
    journal: journalSelector(state)(date),
    getMoodFromId: moodSelector(state),
    getActivityFromId: activitySelector(state),
    activities: activitiesSelector(state),
  }
})(EditJournal)
