import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import 'isomorphic-fetch'

import reducer, {
  initialState,
  getProgressPhotos,
  getWeekPhotos,
  deleteProgressPhotos,
  sendProgressPhotos,
} from '../../../src/data/progress_photos/progressPhotosSlice'
import api from '../../../src/services/api'
import { cleanup } from '../../../testUtils'

jest.mock('../../../src/services/api')

const mockStore = configureMockStore([thunk])

const getPhotosResponse = () => ({
  '2021-04-04': {
    SIDE: {
      id: 25423,
      week_id: 1,
      user_id: 62778,
      view_type: 'SIDE',
      program: 'SHRED',
      file_path: '60c0c88d06bc8.jpg',
      created_at: '2021-06-09 13:56:32',
      updated_at: '2021-06-09 13:56:32',
      date: '2021-06-09',
      guid: '2f7a946d-7fe8-4664-8a61-8f90d7465be9',
      photo_url: 'https://bodylove-cf.s3-us-west-2.amazonaws.com/progressPhotos/60c0c88d06bc8.jpg',
      photo_thumb_url: 'https://bodylove-cf.s3-us-west-2.amazonaws.com/progressPhotos/thumb/60c0c88d06bc8.jpg',
    },
    FRONT: {
      id: 25424,
      week_id: 1,
      user_id: 62778,
      view_type: 'FRONT',
      program: 'SHRED',
      file_path: '60c0c890c5fc8.jpg',
      created_at: '2021-06-09 13:56:36',
      updated_at: '2021-06-09 13:56:36',
      date: '2021-06-09',
      guid: 'be217378-7951-46ac-a739-06d383b03340',
      photo_url: 'https://bodylove-cf.s3-us-west-2.amazonaws.com/progressPhotos/60c0c890c5fc8.jpg',
      photo_thumb_url: 'https://bodylove-cf.s3-us-west-2.amazonaws.com/progressPhotos/thumb/60c0c890c5fc8.jpg',
    },
    BACK: {
      id: 25425,
      week_id: 2,
      user_id: 62778,
      view_type: 'BACK',
      program: 'SHRED',
      file_path: '60c0cde7224ba.jpg',
      created_at: '2021-06-09 14:19:31',
      updated_at: '2021-06-09 14:19:31',
      date: '2021-06-09',
      guid: '84ff5dd1-702f-4320-bbd1-02383b5e26d8',
      photo_url: 'https://bodylove-cf.s3-us-west-2.amazonaws.com/progressPhotos/60c0cde7224ba.jpg',
      photo_thumb_url: 'https://bodylove-cf.s3-us-west-2.amazonaws.com/progressPhotos/thumb/60c0cde7224ba.jpg',
    },
  },
})

const errorResponsePayload = (msg = 'Error') => ({
  response: {
    data: {
      message: msg,
    },
  },
})

let store = null
beforeEach(() => {
  store = mockStore(initialState)
})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => {
  cleanup()
})

afterAll(() => {
  jest.unmock('../../../src/services/api')
})

describe('ProgressPhotos slice', () => {
  describe('reducer, actions and selectors', () => {
    it('should return the initial state on first run', () => {
      // Arrange
      const nextState = initialState

      // Act
      const result = reducer(undefined, {})

      // Assert
      expect(result).toEqual(nextState)
    })

    it('should send progress photos and set in state', () => {
      const payload = {
        weekId: 1,
        date: '2020-06-09',
        program: 'SHRED',
        photos: [
          {
            guid: '12345678-1234-1234-1234-123456789012',
            type: 'SIDE',
            photo_url: '/var/mobile/Containers/Data/Applications/60c0c88d06bc8.jpg',
            image: {
              name: 'file.jpg',
              type: 'image/jpeg',
              uri: '/var/mobile/Containers/Data/Applications/60c0c88d06bc8.jpg',
            },
          },
        ],
      }
      expect(reducer(initialState, sendProgressPhotos(payload))).toEqual({
        ...initialState,
        loading: -1,
        days: {
          ...initialState.days,
          ['2020-06-09']: {
            ['SIDE']: {
              guid: '12345678-1234-1234-1234-123456789012',
              type: 'SIDE',
              photo_url: '/var/mobile/Containers/Data/Applications/60c0c88d06bc8.jpg',
            },
          },
        },
      })
    })
  })

  describe('ProgressPhotos thunks', () => {
    it('getProgressPhotos should get and set user photos', async () => {
      await api.progress_photos.getPhotos.mockResolvedValueOnce(getPhotosResponse())

      const {
        meta: { requestId },
      } = await store.dispatch(getProgressPhotos())

      const expectedActions = [getProgressPhotos.pending(requestId), getProgressPhotos.fulfilled(getPhotosResponse(), requestId)]

      expect(store.getActions()).toEqual(expectedActions)
    })

    it('getProgressPhotos should fail properly', async () => {
      const requestPayload = 'invalidDate'

      await api.progress_photos.getPhotos.mockRejectedValueOnce(errorResponsePayload('Failed'))

      const {
        meta: { requestId },
      } = await store.dispatch(getProgressPhotos(requestPayload))

      const expectedActions = [
        getProgressPhotos.pending(requestId, requestPayload),
        getProgressPhotos.rejected({ message: 'Rejected' }, requestId, requestPayload, errorResponsePayload('Failed')),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })

    it('getWeekPhotos should get and set user photos by week', async () => {
      // weekId
      const requestPayload = 1
      await api.progress_photos.getPhotos.mockResolvedValueOnce(getPhotosResponse())

      const {
        meta: { requestId },
      } = await store.dispatch(getWeekPhotos(requestPayload))

      const expectedActions = [
        getWeekPhotos.pending(requestId, requestPayload),
        getWeekPhotos.fulfilled(getPhotosResponse(), requestId, requestPayload),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })

    it('getWeekPhotos should fail properly', async () => {
      const requestPayload = '--------'

      await api.progress_photos.getPhotos.mockRejectedValueOnce(errorResponsePayload('Failed'))

      const {
        meta: { requestId },
      } = await store.dispatch(getWeekPhotos(requestPayload))

      const expectedActions = [
        getWeekPhotos.pending(requestId, requestPayload),
        getWeekPhotos.rejected({ message: 'Rejected' }, requestId, requestPayload, errorResponsePayload('Failed')),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })

    it('deleteProgressPhotos should delete photo properly', async () => {
      // photoId
      const requestPayload = 1
      await api.progress_photos.getDeleteProgressPhoto.mockResolvedValueOnce(getPhotosResponse())

      const {
        meta: { requestId },
      } = await store.dispatch(deleteProgressPhotos(requestPayload))

      const expectedActions = [
        deleteProgressPhotos.pending(requestId, requestPayload),
        deleteProgressPhotos.fulfilled(getPhotosResponse(), requestId, requestPayload),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })

    it('deleteProgressPhotos should fail properly', async () => {
      // photoId
      const requestPayload = null

      await api.progress_photos.getDeleteProgressPhoto.mockRejectedValueOnce(errorResponsePayload('Failed'))

      const {
        meta: { requestId },
      } = await store.dispatch(deleteProgressPhotos(requestPayload))

      const expectedActions = [
        deleteProgressPhotos.pending(requestId, requestPayload),
        deleteProgressPhotos.rejected({ message: 'Rejected' }, requestId, requestPayload, errorResponsePayload('Failed')),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
