import React from 'react'
import { View, Text, SectionList, StyleSheet, ScrollView } from 'react-native'

// Components
import { NoResults } from './NoResults'

// styles
import globals from '../../../config/globals'

export const GuidanceSearchResults = ({ videos, sectioned, renderItem }) => {
  const capitalize = (s) => {
    if (typeof s !== 'string') {
      return ''
    }
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  function renderSectionHeader({ section: { title } }) {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{capitalize(title)}</Text>
      </View>
    )
  }

  return (
    <View style={styles.searchResultsContainer}>
      <Text style={styles.screenTitle}>SEARCH RESULTS</Text>
      <View style={styles.searchResults}>
        {!videos || videos.length < 1 ? (
          <NoResults />
        ) : sectioned ? (
          <SectionList
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            sections={videos}
          />
        ) : (
          <ScrollView style={styles.scrollView}>{videos?.map((video) => renderItem({ item: video }))}</ScrollView>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  searchResultsContainer: {
    flex: 1,
  },
  screenTitle: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    fontSize: 25,
    fontFamily: globals.fonts.secondary.style.fontFamily,
  },
  searchResults: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    height: 32,
    backgroundColor: globals.styles.colors.colorGrayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
})
