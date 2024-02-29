import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import 'isomorphic-fetch'

import api from '../../../src/services/api'
import { cleanup } from '../../../testUtils'
import reducer, {
  initialState,
  getNotifications,
  deleteNotification,
  readAllNotifications,
  clearAllNotifications,
} from '../../../src/data/notification/notificationSlice'

jest.mock('../../../src/services/api')

const mockStore = configureMockStore([thunk])

let store = null
beforeEach(() => {
  store = mockStore(initialState)
})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => {
  cleanup()
})

const errorResponsePayload = (msg = 'Error') => ({
  response: {
    data: {
      message: msg,
    },
  },
})

const initialStateOverride = (data) => [...initialState, ...data]

const testNotification = {
  id: 'asdf1',
  type: 'WaterIntake',
  data: {
    title: 'Water Intake',
    text: 'Drink up',
  },
  read_at: null,
  created_at: '2020-01-01T00:00:00.000Z',
  expire_at: '2020-01-01T00:00:00.000Z',
}

describe('Notification Slice', () => {
  describe('reducer, actions and selectors', () => {
    it('should return the initial state on first run', () => {
      // Arrange
      const nextState = initialState

      // Act
      const result = reducer(undefined, {})

      // Assert
      expect(result).toEqual(nextState)
    })
  })
})

describe('Notification thunks', () => {
  it('should get and set Notifications', async () => {
    const responsePayload = {
      notifications: [testNotification],
    }

    await api.notifications.getNotifications.mockResolvedValueOnce(responsePayload)

    const {
      meta: { requestId },
    } = await store.dispatch(getNotifications())

    const expectedActions = [getNotifications.pending(requestId), getNotifications.fulfilled(responsePayload, requestId)]

    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should handle getNotifications failure', async () => {
    await api.notifications.getNotifications.mockRejectedValueOnce(errorResponsePayload('Failed'))

    const {
      meta: { requestId },
    } = await store.dispatch(getNotifications())

    const expectedActions = [
      getNotifications.pending(requestId),
      getNotifications.rejected({ message: 'Rejected' }, requestId, undefined, errorResponsePayload('Failed')),
    ]

    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should handle deleting a Notification', async () => {
    const requestPayload = testNotification
    const enhancedStore = mockStore(initialStateOverride([requestPayload]))
    const responsePayload = { notifications: [], message: 'Notification deleted!' }

    await api.notifications.deleteNotification.mockResolvedValueOnce(responsePayload)

    const {
      meta: { requestId },
    } = await enhancedStore.dispatch(deleteNotification(requestPayload))

    const expectedActions = [
      deleteNotification.pending(requestId, requestPayload),
      deleteNotification.fulfilled(responsePayload, requestId, requestPayload),
    ]

    expect(enhancedStore.getActions()).toEqual(expectedActions)
  })

  it('should handle deleteNotification failure', async () => {
    const requestPayload = testNotification
    await api.notifications.deleteNotification.mockRejectedValueOnce(errorResponsePayload('Failed'))

    const {
      meta: { requestId },
    } = await store.dispatch(deleteNotification(requestPayload))

    const expectedActions = [
      deleteNotification.pending(requestId, requestPayload),
      deleteNotification.rejected({ message: 'Rejected' }, requestId, requestPayload, errorResponsePayload('Failed')),
    ]

    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should mark as read all Notifications', async () => {
    const responsePayload = {
      notifications: [
        {
          ...testNotification,
          read_at: '2020-01-01T00:00:00.000Z',
        },
      ],
    }
    const enhancedStore = mockStore(initialStateOverride([testNotification]))

    await api.notifications.markAllRead.mockResolvedValueOnce(responsePayload)

    const {
      meta: { requestId },
    } = await enhancedStore.dispatch(readAllNotifications())

    const expectedActions = [readAllNotifications.pending(requestId), readAllNotifications.fulfilled(responsePayload, requestId)]
    expect(enhancedStore.getActions()).toEqual(expectedActions)
  })

  it('should handle markAllRead failure', async () => {
    const enhancedStore = mockStore(initialStateOverride([testNotification]))

    await api.notifications.markAllRead.mockRejectedValueOnce(errorResponsePayload('Failed'))

    const {
      meta: { requestId },
    } = await enhancedStore.dispatch(readAllNotifications())

    const expectedActions = [
      readAllNotifications.pending(requestId),
      readAllNotifications.rejected({ message: 'Rejected' }, requestId, undefined, errorResponsePayload('Failed')),
    ]

    expect(enhancedStore.getActions()).toEqual(expectedActions)
  })

  it('should clear all Notifications', async () => {
    const responsePayload = { message: 'Notifications deleted!', notifications: [] }
    const enhancedStore = mockStore(initialStateOverride([testNotification]))

    await api.notifications.clearNotification.mockResolvedValueOnce(responsePayload)

    const {
      meta: { requestId },
    } = await enhancedStore.dispatch(clearAllNotifications())

    const expectedActions = [clearAllNotifications.pending(requestId), clearAllNotifications.fulfilled(responsePayload, requestId)]
    expect(enhancedStore.getActions()).toEqual(expectedActions)
  })
})

it('should handle clearNotification failure', async () => {
  const enhancedStore = mockStore(initialStateOverride([testNotification]))

  await api.notifications.clearNotification.mockRejectedValueOnce(errorResponsePayload('Failed'))

  const {
    meta: { requestId },
  } = await enhancedStore.dispatch(clearAllNotifications())

  const expectedActions = [
    clearAllNotifications.pending(requestId),
    clearAllNotifications.rejected({ message: 'Rejected' }, requestId, undefined, errorResponsePayload('Failed')),
  ]

  expect(enhancedStore.getActions()).toEqual(expectedActions)
})
