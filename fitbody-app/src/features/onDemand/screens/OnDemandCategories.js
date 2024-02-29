import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { StyleSheet, Pressable, Text, View, TouchableWithoutFeedback, Keyboard, ScrollView, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

// components
import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'
import { GuidanceSearchResults } from '../components/GuidanceSearchResults'
import { OnDemandListItem } from '../components/OnDemandTile'
import { SearchBar } from '../../../components/SearchBar/SearchBar'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'

// assets
import globals from '../../../config/globals'

// services
import { filterForSectionList } from '../helpers'
import { setErrorMessage } from '../../../services/error'
import { resolveLocalUrl } from '../../../services/helpers'

export const OnDemandCategories = ({ navigation }) => {
  const [filteredVideos, setFilteredVideos] = useState(null)
  const [search, setSearch] = useState('')

  const onDemandCategories = useSelector((state) => state.data.media.categories['On Demand'])
  const onDemandVideos = useSelector((state) => state.data.media.onDemand)
  const rawVideos = [].concat.apply([], Object.values(onDemandVideos))
  const sortedCategories = [...onDemandCategories].sort((a, b) => a.sort_order - b.sort_order)

  const { navigate } = navigation

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>ON DEMAND</Text>,
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
    })
  }, [navigation])

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredVideos(null)
      return
    }
    const filtered = filterForSectionList(rawVideos, onDemandCategories, search)
    setFilteredVideos(filtered)
  }, [search])

  function onComplete() {
    setErrorMessage({ error: 'This class has been added to your Fit Body Calendar. Great job!', errorIcon: 'CalendarHeartRed' })
  }

  function renderItem({ item, idx }) {
    const categoryName = (sortedCategories?.find((c) => c.id === item.category_id) || {}).name
    return <OnDemandListItem key={item.id} item={item} idx={idx} navigation={navigation} onComplete={onComplete} category={categoryName} />
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

      <View style={{ flex: 1 }}>
        {search.trim() ? (
          <GuidanceSearchResults videos={filteredVideos} navigation={navigation} sectioned renderItem={renderItem} />
        ) : (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            <LinearGradient
              colors={[globals.styles.colors.colorGrayLight, globals.styles.colors.colorWhite]}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40 }}
            />
            {sortedCategories.map((c) => {
              return (
                <Pressable
                  key={c.id}
                  onPress={() => {
                    Keyboard.dismiss()
                    navigate('OnDemandCategory', {
                      title: c.name,
                      headerImage: c.header_image_url,
                      categoryId: c.id,
                      description: c.description,
                    })
                  }}
                  style={({ pressed }) => styles.button(pressed)}>
                  <Image source={{ uri: resolveLocalUrl(c.image_url) }} style={styles.background} />
                  <View style={styles.col}>
                    <Text style={styles.title}>{c.name}</Text>
                    <View style={styles.classesView}>
                      <Text style={styles.classesViewText}>{c.class_description}</Text>
                    </View>
                  </View>
                </Pressable>
              )
            })}
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
  col: {
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowOpacity: pressed ? 0.25 : 0.48,
    shadowRadius: pressed ? 3.84 : 7.51,
    elevation: pressed ? 4 : 15,
  }),
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  title: {
    color: globals.styles.colors.colorWhite,
    fontSize: 45,
    fontFamily: globals.fonts.secondary.style.fontFamily,
  },
  classesView: {
    backgroundColor: globals.styles.colors.colorLove,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classesViewText: {
    color: globals.styles.colors.colorWhite,
    fontSize: 20,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    height: 22,
  },
})
