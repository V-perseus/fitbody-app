import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react'
import { Text, StatusBar, View, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import RNFS from 'react-native-fs'

// Assets
import styles from './styles'
import globals from '../../../../config/globals'

// Components
import DownloadsIcon from '../../../../../assets/images/svg/icon/40px/circle/downloaded.svg'
import CloseCircle from '../../../../../assets/images/svg/icon/16px/circle/close-circle.svg'
import { ButtonOpacity } from '../../../../components/Buttons/ButtonOpacity'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

// Services
import { clearChallengeMonth, clearDownloads } from '../../../../data/workout'
import { useAppSelector } from '../../../../store/hooks'
import { IProgram, ITrainer } from '../../../../data/workout/types'

// Types
import { DownloadsScreenNavigationProps } from '../../../../config/routes/routeTypes'

type DownloadFileData = {
  program: IProgram
  trainer: ITrainer
  size: number
}

type ChallengeDownloadFileData = {
  title: string
  color: string
  size: number
}

interface IDownloadsProps {
  navigation: DownloadsScreenNavigationProps
}
const Downloads: React.FC<IDownloadsProps> = ({ navigation }) => {
  const progs = useAppSelector((state) => state.data.workouts.programs)
  const programs = useMemo(() => Object.values(progs), [progs])

  const trainersObj = useAppSelector((state) => state.data.workouts.trainers)
  const trainers = useMemo(() => Object.values(trainersObj), [trainersObj])

  const cpS = useAppSelector((state) => state.data.user.workout_goal)
  const currentProgram = useMemo(() => (programs ? programs.find((p) => p.slug === cpS) : null), [programs, cpS])

  const [downloads, setDownloads] = useState<DownloadFileData[]>([])
  const [challengeDownload, setChallengeDownload] = useState<ChallengeDownloadFileData>()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>DOWNLOADS</Text>,
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
    })
  }, [navigation])

  useEffect(() => {
    const enumerate = async () => {
      const pathC = `${RNFS.DocumentDirectoryPath}/assets/challenges`
      const foldersC = await RNFS.readDir(pathC)
      const size = foldersC?.filter((f) => f.isFile()).reduce((total, curr) => total + parseInt(curr.size, 10), 0) / (1024 * 1024)
      if (size) {
        setChallengeDownload({
          title: '5 MINUTE CARDIO BURN',
          color: globals.styles.colors.colorBlack,
          size,
        })
      }
    }
    enumerate()
  }, [])

  useEffect(() => {
    const enumerate = async () => {
      try {
        const path = `${RNFS.DocumentDirectoryPath}/assets/workouts`
        const folders = await RNFS.readDir(path)

        const result = await Promise.all(
          folders
            .filter((f) => f.isDirectory())
            .map(async (ff) => {
              const files = await RNFS.readDir(ff.path)
              // console.log('name', ff.name)
              const size = files.reduce((tot, cur) => tot + parseInt(cur.size, 10), 0)
              return {
                program: programs.find((p) => p.id === parseInt(ff.name, 10))!,
                trainer: trainers.find((t) => t.programs.includes(parseInt(ff.name, 10)))!,
                size: parseFloat(String(size / 1000000)),
              }
            }),
        )
        // console.log('RES', result)

        setDownloads(
          result.sort((a, b) => a.program.sort_order - b.program.sort_order).sort((a, b) => a.trainer.sort_order - b.trainer.sort_order),
        )
      } catch (error) {
        // most likely the directory doesn't exist yet when running RNFS.readDir. just catch the rejection and do nothing
        // as this can happen if a user hadn't downloded any workouts before visiting this screen
      }
    }

    enumerate()
  }, [programs, trainers])

  const clearProgram = (id: number) => () => {
    const path = `${RNFS.DocumentDirectoryPath}/assets/workouts/${id}`
    RNFS.unlink(path)
    setDownloads((d) => d.filter((p) => p.program.id !== id))
    clearDownloads({ programId: id })
  }

  function handleDownloadItemPress(item: DownloadFileData) {
    if (item.program.id !== currentProgram?.id) {
      navigation.navigate('Modals', {
        screen: 'ConfirmationDialog',
        params: {
          yesLabel: 'CLEAR',
          noLabel: 'NEVER MIND',
          yesHandler: clearProgram(item.program.id),
          title: 'Are you sure?',
          body: 'You are about to clear all downloads for this program. This will not clear any workout history.',
        },
      })
    }
  }

  const clearChallengeProgram = () => () => {
    // this simply triggers a redownload of all monthly challenge/cardio burn data
    const path = `${RNFS.DocumentDirectoryPath}/assets/challenges`
    RNFS.unlink(path)
    clearChallengeMonth()
    setChallengeDownload(undefined)
  }

  function handleChallengeDownloadItemPress() {
    navigation.navigate('Modals', {
      screen: 'ConfirmationDialog',
      params: {
        yesLabel: 'CLEAR',
        noLabel: 'NEVER MIND',
        yesHandler: clearChallengeProgram(),
        title: 'Are you sure?',
        body: 'You are about to restore all downloads for this months 5 Minute Cardio Burn. This will not clear any workout history.',
      },
    })
  }

  function renderItem({ item, index }: { item: DownloadFileData; index: number }) {
    return (
      <View key={index} style={styles.downloadItemContainer}>
        <Text style={{ color: item.trainer.color, fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 20 }}>
          {item.program.title}
        </Text>
        {/* <SvgUri uri={resolveLocalUrl(item.program.logo_small_url)} color={item.trainer.color} /> */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
              fontSize: 12,
              color: globals.styles.colors.colorGrayDark,
              marginRight: 16,
            }}>
            {Math.round(item.size)} MB
          </Text>
          <ButtonOpacity onPress={() => handleDownloadItemPress(item)} testID={item.program.title}>
            <View>
              <DownloadsIcon
                color={item.program.id === currentProgram?.id ? globals.styles.colors.colorGray : globals.styles.colors.colorSkyBlue}
                style={{ margin: 2 }}
              />
              <CloseCircle
                color={item.program.id === currentProgram?.id ? globals.styles.colors.colorGrayDark : globals.styles.colors.colorBlackDark}
                style={{ position: 'absolute', top: 0, right: 0 }}
              />
            </View>
          </ButtonOpacity>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.view, { flex: 0 }]}>
        <StatusBar barStyle="dark-content" />
        {/* <View style={{ flexDirection: 'row', margin: 24, alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: ms(14) }}>Automatically Download Over Wifi Only</Text>
          <Switch
            thumbColor={'#fff'}
            disabled={isPaused && indent !== 0}
            value={indent === 0 ? !isEnabled : isEnabled}
            onValueChange={(v) => toggleSetting(setting, indent === 0 ? !v : v)}
            trackColor={{ true: '#ff6c8f' }}
          />
        </View> */}
        <View style={{ marginHorizontal: 24, marginBottom: 22 }}>
          {/* <Text style={{ fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 12 }}>
            When toggled on, your workouts will only be downloaded automatically when connected to Wi-Fi.{'\n\n'}When toggled off, your
            workouts will download automatically using cellular data.
          </Text> */}
          <Text style={{ fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 12 }}>
            {'\n'}
            Please note you cannot delete data for the workout program you currently have open.
          </Text>
        </View>
        <View style={{ backgroundColor: globals.styles.colors.colorGrayLight, alignSelf: 'stretch', alignItems: 'center', padding: 5 }}>
          <Text
            style={{ fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, color: globals.styles.colors.colorBlack, fontSize: 14 }}>
            Downloads
          </Text>
        </View>
        <FlatList data={downloads} keyExtractor={(item, index) => `download_${index}`} renderItem={renderItem} />
        {challengeDownload && (
          <View style={styles.downloadItemContainer}>
            <Text style={{ color: challengeDownload.color, fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 20 }}>
              {challengeDownload.title}
            </Text>
            {/* <SvgUri uri={resolveLocalUrl(item.program.logo_small_url)} color={item.trainer.color} /> */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
                  fontSize: 12,
                  color: globals.styles.colors.colorGrayDark,
                  marginRight: 16,
                }}>
                {Math.round(challengeDownload.size)} MB
              </Text>
              <ButtonOpacity onPress={handleChallengeDownloadItemPress} testID={challengeDownload.title}>
                <View>
                  <DownloadsIcon color={globals.styles.colors.colorSkyBlue} style={{ margin: 2 }} />
                  <CloseCircle color={globals.styles.colors.colorBlackDark} style={{ position: 'absolute', top: 0, right: 0 }} />
                </View>
              </ButtonOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default Downloads
