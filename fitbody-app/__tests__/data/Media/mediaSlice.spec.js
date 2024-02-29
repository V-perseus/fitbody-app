import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import 'isomorphic-fetch'

import reducer, { initialState, fetchMedia, fetchMediaStarted } from '../../../src/data/media/mediaSlice'
import api from '../../../src/services/api'
import { cleanup } from '../../../testUtils'

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

describe('Media slice', () => {
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

  describe('Media thunks', () => {
    it('should get and set videos', async () => {
      // the response from the api
      const responsePayload = {
        types: [
          {
            id: 1,
            name: 'On Demand',
            categories: [{ id: 4, name: '30 Day Tone', icon_url: 'icon', image_url: 'image', header_image_url: 'header_image' }],
          },
          {
            id: 2,
            name: 'Guidance',
            categories: [{ id: 5, name: 'Fitnesss', icon_url: 'icon', image_url: 'image', header_image_url: 'header_image' }],
          },
        ],
        videos: [
          { category_id: 4, thumbnail: 'link_1' },
          { category_id: 5, thumbnail: 'link_2' },
        ],
      }
      // api response formatted for reducer
      const startedState = {
        guidance: { Fitnesss: [{ category_id: 5, thumbnail: 'link_2' }] },
        onDemand: { '30 Day Tone': [{ category_id: 4, thumbnail: 'link_1' }] },
        categories: {
          'On Demand': [{ id: 4, name: '30 Day Tone', icon_url: 'icon', image_url: 'image', header_image_url: 'header_image' }],
          Guidance: [{ id: 5, name: 'Fitnesss', icon_url: 'icon', image_url: 'image', header_image_url: 'header_image' }],
        },
      }
      // formatted api response after creating download links
      const finalState = {
        categories: {
          Guidance: [
            {
              id: 5,
              name: 'Fitnesss',
              icon_url: '/assets/media/5/icon',
              image_url: '/assets/media/5/image',
              header_image_url: '/assets/media/5/header_image',
            },
          ],
          'On Demand': [
            {
              id: 4,
              name: '30 Day Tone',
              icon_url: 'icon',
              image_url: '/assets/media/4/image',
              header_image_url: '/assets/media/4/header_image',
            },
          ],
        },
        guidance: { Fitnesss: [{ category_id: 5, thumbnail: '/assets/media/link_2' }] },
        onDemand: { '30 Day Tone': [{ category_id: 4, thumbnail: '/assets/media/link_1' }] },
      }

      await api.guidance.getAllv4.mockResolvedValueOnce(responsePayload)
      await api.downloads.requestDownload.mockResolvedValueOnce({ url: 'https://www.website' })

      const {
        meta: { requestId },
      } = await store.dispatch(fetchMedia())

      const expectedActions = [
        fetchMedia.pending(requestId),
        fetchMediaStarted(startedState, requestId),
        fetchMedia.fulfilled(finalState, requestId),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should handle fetchMedia failure', async () => {
    await api.guidance.getAllv4.mockRejectedValueOnce(errorResponsePayload('Failed'))

    const {
      meta: { requestId },
    } = await store.dispatch(fetchMedia())

    const expectedActions = [
      fetchMedia.pending(requestId),
      fetchMedia.rejected({ message: 'Rejected' }, requestId, undefined, errorResponsePayload('Failed')),
    ]

    expect(store.getActions()).toEqual(expectedActions)
  })
})
