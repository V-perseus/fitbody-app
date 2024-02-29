import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Text, View, TouchableWithoutFeedback, Keyboard, Image, StyleSheet, ScrollView, Pressable } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

// Components
import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'
import { GuidanceSearchResults } from '../components/GuidanceSearchResults'
import { GuidanceTileListItem } from '../components/GuidanceTile'
import { SearchBar } from '../../../components/SearchBar/SearchBar'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'
import { resolveLocalUrl } from '../../../services/helpers'

import { filterForSectionList, VIDEO_CATEGORIES } from '../helpers'
import { SvgUriLocal } from '../../workouts/components/SvgUriLocal'

// Assets
import globals from '../../../config/globals'

export const GuidanceCategories = ({ navigation }) => {
  const [filteredVideos, setFilteredVideos] = useState(null)
  const [search, setSearch] = useState('')

  const guidanceCategories = useSelector((state) => state.data.media.categories[VIDEO_CATEGORIES.GUIDANCE])
  const guidanceVideos = useSelector((state) => state.data.media.guidance)

  const rawVideos = [].concat.apply([], Object.values(guidanceVideos))
  const { navigate } = navigation

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>GUIDANCE</Text>,
      headerLeft: () => <HeaderButton onPress={navigation.goBack} />,
    })
  }, [navigation])

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredVideos(null)
      return
    }
    const filtered = filterForSectionList([...rawVideos], guidanceCategories, search)
    setFilteredVideos(filtered)
  }, [search])

  function renderItem({ item }) {
    const categoryName = (guidanceCategories?.find((c) => c.id === item.category_id) || {}).name
    return <GuidanceTileListItem key={item.id} item={item} navigation={navigation} category={categoryName} />
  }

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="dark-content" />

      {/* Search */}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
        <View style={styles.searchContainer}>
          <SearchBar onSearch={setSearch} placeholder="Search for video" />
        </View>
      </TouchableWithoutFeedback>

      {/* Video Type Container */}
      <View style={{ flex: 1 }}>
        {search.trim() ? (
          <GuidanceSearchResults videos={filteredVideos} navigation={navigation} sectioned renderItem={renderItem} />
        ) : (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            <LinearGradient
              colors={[globals.styles.colors.colorGrayLight, globals.styles.colors.colorWhite]}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40 }}
            />
            {/* Fitness */}
            {guidanceCategories.map((gc) => (
              <Pressable
                key={gc.id}
                onPress={() => {
                  Keyboard.dismiss()
                  navigate('GuidanceCategory', {
                    title: gc.name,
                    headerImage: gc.header_image_url,
                    categoryId: gc.id,
                    description: gc.description,
                  })
                }}
                style={({ pressed }) => styles.button(pressed)}>
                <Image source={{ uri: resolveLocalUrl(gc.header_image_url) }} style={styles.quadBackground} />
                <View style={styles.row}>
                  <View style={styles.spacer} />
                  <View style={styles.quadIconContainer}>
                    <SvgUriLocal uri={gc.icon_url} color={globals.styles.colors.colorWhite} />
                    <Text style={styles.quadTitle}>{gc.name}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
  container: {
    ...globals.styles.container,
    zIndex: 0,
  },
  searchContainer: { paddingBottom: 4, marginHorizontal: 24 },
  row: {
    flexDirection: 'row',
  },
  spacer: {
    flex: 1,
  },
  headerTitle: {
    ...globals.header.headerTitleStyle,
  },
  scrollView: {
    flex: 1,
    zIndex: 0,
    position: 'relative',
  },
  scrollViewContent: { paddingHorizontal: 24, paddingTop: 24 },
  button: (pressed) => ({
    justifyContent: 'center',
    width: '100%',
    height: 142,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: globals.styles.colors.colorWhite,
    shadowColor: globals.styles.colors.colorBlack,
    shadowOffset: {
      width: 0,
      height: 0, // pressed ? 2 : 7,
    },
    shadowOpacity: pressed ? 0.25 : 0.38,
    shadowRadius: pressed ? 3.84 : 6.51,
    elevation: pressed ? 5 : 12,
  }),
  quadBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  quadIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quadTitle: {
    color: globals.styles.colors.colorWhite,
    fontSize: 30,
    fontFamily: globals.fonts.secondary.style.fontFamily,
  },
})
