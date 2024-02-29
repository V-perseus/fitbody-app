import React, { Component } from 'react'
import { Text, TouchableOpacity, View, FlatList } from 'react-native'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'

// styles
import styles from './styles'
import globals from '../../../../config/globals'

// Components
import { MoodItem } from '../../../../components/MoodItem/MoodItem'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

// Services
import { moodsSelector } from '../../../../data/journal/selectors'
import { sortMoodByOrder } from '../../../../services/helpers'

class EditExtraMood extends Component {
  state = {
    mainMood: { id: 1 },
    extraMoods: [],
  }

  componentDidMount() {
    const params = this.props.route.params
    const mainMood = params && params.mainMood
    const extraMoods = params && params.extraMoods
    this.setState({ mainMood, extraMoods })
  }

  handleGoBack = () => {
    this.props.navigation.goBack()
  }

  handleTapItem = (index) => {
    const { moods } = this.props
    const { mainMood, extraMoods } = this.state
    const mood = { id: moods[index].id, order: this.getMoodOrder(extraMoods) }

    if (mood.id === mainMood.id) {
      return
    }

    const hasMood = extraMoods.map((m) => m.id).includes(mood.id)

    const patchedMoods = hasMood ? extraMoods.filter((m) => m.id !== mood.id) : [...extraMoods, mood]

    this.setState({ extraMoods: this.orderMoods(patchedMoods) })
  }

  orderMoods(moods) {
    return moods.sort(sortMoodByOrder).map((m, index) => ({ ...m, order: index + 1 }))
  }

  getMoodOrder(extraMoods) {
    const extraMoodsLen = extraMoods.length
    return extraMoodsLen === 0 ? 1 : extraMoods[extraMoodsLen - 1].order + 1
  }

  handleSave = () => {
    const params = this.props.route.params
    const onExtraMoodAdded = params.onExtraMoodAdded || {}
    const { extraMoods } = this.state

    this.handleGoBack()
    onExtraMoodAdded(extraMoods)
  }

  renderItem = ({ item, index }) => {
    const { mainMood, extraMoods } = this.state
    const selectedMoods = [mainMood, ...extraMoods]
    const opacity = selectedMoods.map((m) => m.id).includes(item.id) ? 1 : 0.5

    let textStyle
    let innerTextStyle
    if (mainMood.id === item.id) {
      textStyle = styles.mainMoodTileText
      innerTextStyle = styles.mainMoodInnerTileText
    } else if (extraMoods.map((m) => m.id).includes(item.id)) {
      textStyle = styles.extraMoodTileText
      innerTextStyle = styles.extraMoodInnerTileText
    } else {
      textStyle = styles.unselectTileText
      innerTextStyle = styles.unselectInnerTileText
    }

    return (
      <MoodItem
        onPress={() => this.handleTapItem(index)}
        opacity={opacity}
        name={item.name}
        iconKey={item.icon_key}
        textContainerStyle={textStyle}
        textStyle={innerTextStyle}
      />
    )
  }

  renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.titleLabel}>SELECT ADDITIONAL MOODS</Text>
        <HeaderButton onPress={this.handleGoBack} iconColor={globals.styles.colors.colorWhite} style={styles.back} />
      </View>
    )
  }

  renderFooter = () => <View style={{ height: 120 }} />

  keyExtractor = (item, index) => `extraMood-${index}`

  render() {
    const { moods } = this.props
    return (
      <LinearGradient style={{ flex: 1 }} colors={[globals.styles.colors.colorPink, globals.styles.colors.colorSkyBlue]}>
        <FlatList
          columnWrapperStyle={styles.columnWrapper}
          data={moods}
          renderItem={this.renderItem}
          numColumns={3}
          ListHeaderComponent={this.renderHeader()}
          ListFooterComponent={this.renderFooter()}
          keyExtractor={this.keyExtractor}
        />
        <LinearGradient
          colors={['#97b5f600', globals.styles.colors.colorTransparent30SkyBlue, globals.styles.colors.colorTransparent50SkyBlue]}
          style={{
            justifyContent: 'flex-end',
            paddingBottom: 5,
            position: 'absolute',
            height: 174,
            bottom: 0,
            width: globals.window.width,
          }}>
          <TouchableOpacity style={styles.saveButton} onPress={this.handleSave}>
            <Text style={styles.saveButtonText}>SAVE MOODS</Text>
          </TouchableOpacity>
        </LinearGradient>
      </LinearGradient>
    )
  }
}

export default connect((state) => ({
  moods: moodsSelector(state),
}))(EditExtraMood)
