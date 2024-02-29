import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ContentLoader, { Rect } from 'react-content-loader/native'

import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'

import globals from '../../../config/globals'
import CircleChevronLeft from '../../../../assets/images/svg/icon/24px/circle/cheveron-left.svg'
import CircleChevronRight from '../../../../assets/images/svg/icon/24px/circle/cheveron-right.svg'

export const CategoriesLoader = () => {
  return (
    <>
      <FocusAwareStatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>LOADING...</Text>
        </View>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderInner}>
            <CircleChevronLeft width={24} height={24} color={globals.styles.colors.colorBlack} />
            <ContentLoader
              speed={2}
              width={200}
              height={30}
              viewBox="0 0 200 30"
              backgroundColor={globals.styles.colors.colorGray}
              foregroundColor={globals.styles.colors.colorGrayLight}
              // {...props}
            >
              <Rect x="48" y="0" rx="3" ry="3" width="100" height="30" />
            </ContentLoader>
            <CircleChevronRight width={24} height={24} color={globals.styles.colors.colorBlack} />
          </View>
          <View style={styles.cardBody}>
            <View style={styles.card}>
              <ContentLoader
                speed={2}
                width={globals.window.width * 0.9}
                height={250}
                viewBox={`0 0 ${globals.window.width * 0.9} 250`}
                backgroundColor={globals.styles.colors.colorGray}
                foregroundColor={globals.styles.colors.colorGrayLight}
                style={styles.cardLoader}>
                <Rect x="0" y="0" rx="3" ry="0" width={globals.window.width} height="175" />
                <Rect x="20" y="192" rx="3" ry="3" width="100" height="19" fill={globals.styles.colors.colorGrayDark} />
                <Rect x="20" y="222" rx="3" ry="3" width="75" height="12" />
                <Rect x={globals.window.width - 160} y="195" rx="3" ry="3" width="100" height="35" />
              </ContentLoader>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: globals.styles.colors.colorLove,
    width: '100%',
    height: '100%',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 90,
    width: '100%',
  },
  headerText: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: globals.styles.colors.colorWhite,
    fontSize: 51,
  },
  cardHeader: {
    flex: 1,
    zIndex: 1,
    marginTop: 212,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  cardHeaderInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomColor: globals.styles.colors.colorGray,
    borderBottomWidth: 2,
    height: 68,
  },
  cardBody: {
    marginTop: 20,
    borderRadius: 7.7,
    marginHorizontal: 24,
    backgroundColor: globals.styles.colors.colorWhite,
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  card: {
    height: 250,
    overflow: 'hidden',
    borderRadius: 7.7,
  },
  cardLoader: { width: '100%' },
})
