import { fireEvent, MockedNavigator, render, act, cleanup } from '../../../../../testUtils'

import NotificationSettings from '../../../../../src/screens/tabs/account/NotificationSettings'
import api from '../../../../../src/services/api'
import globals from '../../../../../src/config/globals'

jest.mock('../../../../../src/services/api')

describe('NotificationSettings screen', () => {
  let component = null
  let setting = null
  beforeEach(() => {
    api.notifications.settings.mockResolvedValue(setting)
    component = MockedNavigator({ component: NotificationSettings })
    setting = {
      notificationTypes: [
        {
          id: 1,
          class: '',
          title: 'Pause All Notifications',
          type: 'toggle',
          cascading_mode: 'inherit',
          default: { enabled: true },
          settings: { enabled: true },
          children: [
            {
              id: 2,
              class: '',
              title: 'General',
              type: 'toggle',
              cascading_mode: 'inherit',
              default: { enabled: true },
              settings: { enabled: true },
              children: [
                {
                  id: 6,
                  class: 'ProgressPhoto',
                  title: 'Progress Photos',
                  type: 'toggle',
                  cascading_mode: 'inherit',
                  default: { enabled: true },
                  settings: { enabled: true },
                  children: [],
                },
              ],
            },
            {
              id: 4,
              class: 'WaterIntake',
              title: 'Water Intake',
              type: 'timeSelector',
              cascading_mode: 'inherit',
              default: { enabled: true, times: ['10:00'] },
              settings: { enabled: true, times: ['7:00', '7:30', '8:30', '9:00'] },
              children: [],
            },
            {
              id: 7,
              class: '',
              title: 'Workouts',
              type: 'toggle',
              cascading_mode: 'inherit',
              default: { enabled: true },
              settings: { enabled: true },
              children: [
                {
                  id: 8,
                  class: 'DailyWorkout',
                  title: 'Daily Workout Reminder',
                  type: 'timeSelector',
                  cascading_mode: 'inherit',
                  default: { enabled: true, times: ['8:00'] },
                  settings: { enabled: true, times: ['8:00'] },
                  children: [],
                },
                {
                  id: 9,
                  class: 'NewChallenge',
                  title: 'New Cardio Burn Workouts',
                  type: 'toggle',
                  cascading_mode: 'inherit',
                  default: { enabled: true },
                  settings: { enabled: true },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    }
  })
  afterEach(() => {
    cleanup()
  })

  it('renders snapshot correctly', async () => {
    await act(async () => {
      await api.notifications.settings.mockResolvedValue(setting)
      const tree = render(component).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  it('should render header buttons', async () => {
    const tree = render(component)
    await act(async () => {
      const { getByText, findByText } = tree
      await findByText('NOTIFICATIONS')
      getByText(/cancel/gi)
      getByText(/save/gi)
    })
  })

  it('should render toggle', async () => {
    const tree = render(component)
    await act(async () => {
      const { findByText, findByTestId } = tree
      await findByText('NOTIFICATIONS')
      const toggle = await findByTestId(/Water Intake/i)
      expect(toggle).not.toBeNull()
      expect(toggle).toHaveProp('trackColor', {
        false: globals.styles.colors.colorGrayLight,
        true: globals.styles.colors.colorLove,
      })
      fireEvent(toggle, 'valueChange', { value: true })
    })
  })

  it('should render available settings', async () => {
    const tree = render(component)
    await act(async () => {
      const { getAllByText, getByText, findByText } = tree
      await findByText('NOTIFICATIONS')
      getByText(/Pause All Notifications/gi)
      getByText(/Progress Photos/gi)
      getByText(/Daily Workout Reminder/gi)
      getByText(/New Cardio Burn Workouts/gi)
      getByText(/07:30/i)
      getByText(/07:00/i)
      getByText(/08:30/i)
      expect(getAllByText(/add time/i)).toHaveLength(2)
    })
  })

  it('should open Add Time modal', async () => {
    const tree = render(component)
    await act(async () => {
      const { getAllByText, findByText, findByTestId } = tree
      await findByText('NOTIFICATIONS')
      const buttons = getAllByText(/add time/i)
      expect(buttons).toHaveLength(2)
      fireEvent.press(buttons[0])
      const modal = await findByTestId('add_time_modal')
      expect(modal).not.toBeNull()
    })
  })
})
