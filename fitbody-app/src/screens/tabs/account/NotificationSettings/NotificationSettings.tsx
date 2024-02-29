import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Platform, Switch, StatusBar, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import moment from 'moment'
import { NavigationProp } from '@react-navigation/native'

// Components
import TimePickerModal from '../../../../components/TimePickerModal'
import { TimeListItem } from './TimeListItem'

// Styles and Assets
import globals from '../../../../config/globals'
import TimeIcon from '../../../../../assets/images/svg/icon/24px/time.svg'
import ChevronRight from '../../../../../assets/images/svg/icon/16px/cheveron/right.svg'

// Services and Data
import api from '../../../../services/api'

// Types
import { AccountStackParamList } from '../../../../config/routes/routeTypes'
import { INotificationSetting, IUpdateNotificationSettingPayload } from '../../../../data/notification/types'

type SettingTimes = Record<string, string[]>

interface INotificationSettingsProps {
  navigation: NavigationProp<AccountStackParamList, 'NotificationSettings'>
}
const NotificationSettings: React.FC<INotificationSettingsProps> = ({ navigation }) => {
  const [settings, setSettings] = useState<INotificationSetting[]>([])
  const [settingsLookup, setSettingsLookup] = useState<Record<string, INotificationSetting>>({})
  const [values, setValues] = useState<Record<string, boolean>>({})
  const [times, setTimes] = useState<SettingTimes>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [activeSetting, setActiveSetting] = useState<number | null>(null)

  const save = (s: Record<string, INotificationSetting>, v: Record<string, boolean>, t: SettingTimes) => {
    const persist: IUpdateNotificationSettingPayload = {}

    for (let k of Object.keys(s)) {
      const newk = k.split('_')[1]
      if (v[k] !== undefined && v[k] !== s[k].settings.enabled) {
        persist[newk] = {
          enabled: v[k],
        }
      }

      if (s[k].type === 'timeSelector') {
        if (persist[newk] === undefined && t[k] !== undefined) {
          persist[newk] = { enabled: s[k].settings.enabled }
        }

        if (persist[newk] !== undefined) {
          persist[newk].times = t[k] !== undefined ? t[k] : s[k].settings.times
        }
      }
    }

    api.notifications.saveSettings({ settings: persist }).then(() => navigation.goBack())
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={globals.header.headerTitleStyle}>NOTIFICATIONS</Text>,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={globals.header.icons}>
          <View style={styles.headerButton}>
            <Text style={styles.headerButtonText}>CANCEL</Text>
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => save(settingsLookup, values, times)} style={globals.header.icons}>
          <View style={styles.headerButton}>
            <Text style={styles.headerButtonText}>SAVE</Text>
          </View>
        </TouchableOpacity>
      ),
    })
  }, [navigation, values, times, settingsLookup])

  useEffect(() => {
    api.notifications
      .settings()
      .then((d) => {
        setSettings(d.notificationTypes)
        const flattened = flattenSettings(d.notificationTypes[0], {})
        setSettingsLookup(flattened)
      })
      .catch(() => {
        // console.log(error)
      })
  }, [])

  const flattenSettings = (setting: INotificationSetting, o: Record<string, INotificationSetting>) => {
    o[`setting_${setting.id}`] = setting

    for (const child of setting.children || []) {
      flattenSettings(child, o)
    }
    return o
  }

  const toggleSetting = (setting: INotificationSetting, newValue: boolean) => {
    let newObject = { ...values, [`setting_${setting.id}`]: newValue }
    if (setting.cascading_mode === 'inherit' && setting.id !== 1) {
      setting.children.forEach((child) => {
        newObject = { ...newObject, [`setting_${child.id}`]: newValue }
      })
    }

    setValues(newObject)
  }

  const addTimeToSetting = (setting: INotificationSetting) => {
    setActiveSetting(setting.id)
    if (times[`setting_${setting.id}`] === undefined) {
      setTimes({ ...times, [`setting_${setting.id}`]: setting.settings.times! })
    }
    setModalOpen(true)
  }

  const addTime = (time: string) => {
    let newObject = {
      ...times,
      [`setting_${activeSetting}`]: [...new Set([...(times[`setting_${activeSetting}`] || []), time])].sort((a, b) => {
        return moment(a, 'hh:mm a').isBefore(moment(b, 'hh:mm a')) ? -1 : 1
      }),
    }

    setModalOpen(false)
    setTimes(newObject)
  }

  const removeTime = (setting: INotificationSetting, index: number) => {
    let existing: string[] | undefined
    if (times[`setting_${setting.id}`] === undefined) {
      existing = setting.settings.times
    } else {
      existing = times[`setting_${setting.id}`]
    }

    if (existing !== undefined) {
      existing.splice(index, 1)
      const newObj = { ...times, [`setting_${setting.id}`]: existing }

      setTimes(newObj)
    }
  }

  const renderSettingOrGroup = (setting: INotificationSetting, parentValue: boolean, indent = 0) => {
    const isPaused = settings[0].settings.enabled === false || values.setting_1 === false ? true : false

    const isEnabled = values[`setting_${setting.id}`] !== undefined ? values[`setting_${setting.id}`] : setting.settings.enabled

    const isGroup = (setting.children && setting.children.length > 0 && indent > 0) || (indent == 1 && setting.type === 'timeSelector')

    return (
      <View
        key={setting.id}
        style={{ flex: 1, borderTopWidth: isGroup ? 7 : 0, borderTopColor: `rgba(250,141,213,${isPaused ? 0.5 : 1})` }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 50,
            paddingHorizontal: 33,
            justifyContent: 'space-between',
            flex: 1,
            borderBottomWidth: isGroup && setting.type !== 'timeSelector' ? 2 : 0,
            borderBottomColor: globals.styles.colors.colorGray,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              opacity: isPaused ? 0.5 : 1,
              fontSize: isGroup ? 16 : 14,
              color: isGroup ? globals.styles.colors.colorPink : globals.styles.colors.colorBlack,
            }}>
            {isGroup ? setting.title.toUpperCase() : setting.title}
          </Text>
          {(setting.type === 'toggle' || setting.type === 'timeSelector') && (
            <Switch
              testID={setting.title}
              thumbColor={globals.styles.colors.colorWhite}
              disabled={isPaused && indent !== 0}
              value={indent === 0 ? !isEnabled : isEnabled}
              onValueChange={(v) => toggleSetting(setting, indent === 0 ? !v : v)}
              trackColor={{ true: globals.styles.colors.colorLove, false: globals.styles.colors.colorGrayLight }}
            />
          )}
        </View>
        {setting.type === 'timeSelector' && (
          <View style={{ paddingHorizontal: 33, flex: 1 }}>
            <View
              style={{
                borderBottomWidth: 1,
                alignItems: 'center',
                marginBottom: 15,
                borderBottomColor: `rgba(229, 229, 299, ${isEnabled ? '1' : '0.5'})`,
              }}>
              <View style={{ marginBottom: -9, paddingHorizontal: 10, backgroundColor: globals.styles.colors.colorWhite }}>
                <Text style={{ color: globals.styles.colors.colorGrayDark, opacity: isEnabled ? 1 : 0.5 }}>Remind me at these times:</Text>
              </View>
            </View>
            {(times[`setting_${setting.id}`] !== undefined ? times[`setting_${setting.id}`] : setting.settings.times || []).map((t, i) => (
              <TimeListItem key={`${setting.id}_${i}`} time={t} onPress={isEnabled ? () => removeTime(setting, i) : () => {}} />
            ))}
            <TouchableOpacity onPress={isEnabled ? () => addTimeToSetting(setting) : () => {}}>
              <View style={styles.addTimeButton}>
                <View style={styles.rowCenter}>
                  <TimeIcon color={isEnabled && !isPaused ? globals.styles.colors.colorGrayDark : globals.styles.colors.colorGray} />
                  <Text
                    style={{
                      marginLeft: 15,
                      fontWeight: '600',
                      color: isEnabled && !isPaused ? globals.styles.colors.colorGrayDark : globals.styles.colors.colorGray,
                    }}>
                    Add Time
                  </Text>
                </View>
                <ChevronRight color={isEnabled && !isPaused ? globals.styles.colors.colorGrayDark : globals.styles.colors.colorGray} />
              </View>
            </TouchableOpacity>
          </View>
        )}
        {setting.children.map((element) =>
          renderSettingOrGroup(
            element,
            parentValue === false ? false : setting.cascading_mode === 'disable' ? isEnabled : true,
            indent + 1,
          ),
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={[globals.styles.container, { backgroundColor: globals.styles.colors.colorWhite }]}>
      <ScrollView style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 50 : 50 + (StatusBar.currentHeight || 0) }}>
        {settings[0] ? renderSettingOrGroup(settings[0], true) : null}
      </ScrollView>
      <TimePickerModal testID="add_time_modal" onChange={(time) => addTime(time)} onClose={() => setModalOpen(false)} visible={modalOpen} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginBottom: 7,
    backgroundColor: globals.styles.colors.colorGrayLight,
  },
  headerButton: {
    borderRadius: 12,
    backgroundColor: globals.styles.colors.colorWhite,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: globals.styles.colors.colorBlack,
    width: 60,
  },
  headerButtonText: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    paddingVertical: 3,
    fontSize: 11,
    textAlign: 'center',
    color: globals.styles.colors.colorBlack,
  },
})

export default NotificationSettings
