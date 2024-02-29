import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { Text, ScrollView, TouchableWithoutFeedback, View, Keyboard, StyleSheet, ImageBackground } from 'react-native'
import Orientation from 'react-native-orientation-locker'

// Components
import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'
import { GuidanceTileListItem } from '../components/GuidanceTile'
import { GuidanceSearchResults } from '../components/GuidanceSearchResults'
import { SearchBar } from '../../../components/SearchBar/SearchBar'
import { ButtonOpacity } from '../../../components/Buttons/ButtonOpacity'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'

import { resolveLocalUrl } from '../../../services/helpers'
import { VIDEO_CATEGORIES } from '../helpers'
import { videoCompletionsSelector } from '../../../data/workout/selectors'

// Assets
import CogIcon from '../../../../assets/images/svg/icon/24px/navigation/cog.svg'
import InfoIcon from '../../../../assets/images/svg/icon/24px/info.svg'
import globals from '../../../config/globals'

export const GuidanceCategory = ({ navigation, route }) => {
  const title = route.params?.title ?? ''
  const headerImageUrl = route.params?.headerImage ?? ''
  const categoryId = route.params?.categoryId ?? null
  const description = route.params?.description ?? ''

  const [filteredVideos, setFilteredVideos] = useState(null)
  const [search, setSearch] = useState('')

  const videos = useSelector((state) => state.data.media.guidance[title])
  const mediaCategories = useSelector((state) => state.data.media.categories)
  const videoCompletions = useSelector(videoCompletionsSelector)

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      title: '',
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} iconColor={globals.styles.colors.colorWhite} />,
      headerRight: () => (
        <ButtonOpacity
          style={styles.headerRight}
          onPress={() => navigation.navigate('Modals', { screen: 'VideoSettings', params: { categoryId } })}>
          <CogIcon color={globals.styles.colors.colorWhite} />
        </ButtonOpacity>
      ),
    })
  }, [navigation, categoryId])

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        Orientation.lockToPortrait()
      }, 500)
    }, []),
  )

  /**
   * Perform a string search on the Video titles
   */
  function handleSearchChange(term) {
    setSearch(term)
    const filtered = videos.filter((video) => {
      return video.name.toLowerCase().search(term.toLowerCase()) > -1
    })
    setFilteredVideos(filtered)
  }

  function showInfoModal() {
    navigation.navigate('Modals', {
      screen: 'ConfirmationDialog',
      params: {
        showCloseButton: true,
        yesLabel: 'GOT IT!',
        noLabel: '',
        hideNoButton: true,
        yesHandler: () => {},
        title: `About ${title}`,
        body: description,
      },
    })
  }

  function renderItem({ item, idx }) {
    const category = mediaCategories[VIDEO_CATEGORIES.GUIDANCE]?.find((c) => c.id === item.category_id) || {}
    return (
      <GuidanceTileListItem
        key={item.id}
        item={item}
        index={idx}
        navigation={navigation}
        categoryName={category.name}
        complete={[...videoCompletions].reverse().find((c) => c.video_id === item.id)}
      />
    )
  }

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" />
      <ImageBackground source={{ uri: resolveLocalUrl(headerImageUrl) }} resizeMode="cover" style={styles.headerImage}>
        <Text style={styles.headerText}>GUIDANCE</Text>
        <Text style={styles.headerSubtext}>{title}</Text>
      </ImageBackground>

      <View style={styles.panel}>
        {/* Search */}
        <View style={styles.panelInner}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
            <View style={styles.searchContainer}>
              <SearchBar onSearch={handleSearchChange} containerStyle={{ flex: 1, marginRight: 16 }} placeholder="Search for video" />
              <ButtonOpacity onPress={showInfoModal}>
                <InfoIcon color={globals.styles.colors.colorBlack} />
              </ButtonOpacity>
            </View>
          </TouchableWithoutFeedback>
          {/* Body */}
          {search.trim() ? (
            <GuidanceSearchResults videos={filteredVideos} navigation={navigation} renderItem={renderItem} />
          ) : (
            <ScrollView style={styles.scrollView}>{videos?.map((video) => renderItem({ item: video }))}</ScrollView>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  headerLeft: {
    padding: 8,
    paddingLeft: 16,
    position: 'absolute',
    left: 0,
  },
  headerRight: {
    padding: 8,
    paddingRight: 16,
    position: 'absolute',
    right: 0,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 175,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
  },
  headerSubtext: {
    marginTop: -5,
    color: globals.styles.colors.colorWhite,
    fontSize: 35,
    fontFamily: globals.fonts.secondary.style.fontFamily,
  },
  panel: {
    flex: 1,
    width: '100%',
    marginTop: 155,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  panelInner: {
    flex: 1,
    paddingTop: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
})
