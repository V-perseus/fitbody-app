import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import 'isomorphic-fetch'

import reducer, {
  initialState,
  getJournals,
  getMoods,
  getActivities,
  createJournal,
  updateJournal,
} from '../../../src/data/journal/journalSlice'
import api from '../../../src/services/api'
import { cleanup } from '../../../testUtils'

jest.mock('../../../src/services/api')

const mockStore = configureMockStore([thunk])

// Reset any runtime request handlers we may add during the tests.
afterEach(() => {
  cleanup()
})

describe('Journal slice', () => {
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

describe('Journal thunks', () => {
  it('should get and set journals', async () => {
    const requestPayload = {
      start: 'start date',
      end: 'end date',
    }
    const responsePayload = [{ id: 1234567 }]

    const store = mockStore(initialState)

    await api.journals.getJournals.mockResolvedValueOnce(responsePayload)

    const {
      meta: { requestId },
    } = await store.dispatch(getJournals(requestPayload))

    const expectedActions = [
      getJournals.pending(requestId, requestPayload),
      getJournals.fulfilled(responsePayload, requestId, requestPayload),
    ]

    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should get and set moods', async () => {
    const responsePayload = [{ id: 1234567 }]

    const store = mockStore(initialState)

    await api.journals.getMoods.mockResolvedValueOnce(responsePayload)

    const {
      meta: { requestId },
    } = await store.dispatch(getMoods())

    const expectedActions = [getMoods.pending(requestId), getMoods.fulfilled(responsePayload, requestId)]

    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should get and set activities', async () => {
    const responsePayload = [{ id: 1234567 }]

    const store = mockStore(initialState)

    await api.journals.getActivities.mockResolvedValueOnce(responsePayload)

    const {
      meta: { requestId },
    } = await store.dispatch(getActivities())

    const expectedActions = [getActivities.pending(requestId), getActivities.fulfilled(responsePayload, requestId)]

    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should create and set a new journal entry', async () => {
    const requestPayload = { data: { journalActivities: [2] }, onSuccess: () => {} }
    const responsePayload = { journalActivities: [2] }

    const store = mockStore(initialState)

    await api.journals.createJournal.mockResolvedValueOnce(responsePayload)

    const {
      meta: { requestId },
    } = await store.dispatch(createJournal(requestPayload))

    const expectedActions = [
      createJournal.pending(requestId, requestPayload),
      createJournal.fulfilled(responsePayload, requestId, requestPayload),
    ]

    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should update an existing journal entry', async () => {
    const requestPayload = { journalId: 1234, data: { journalActivities: [3] }, onSuccess: () => {} }
    const responsePayload = { journalActivities: [3] }

    const stateWithJournal = {
      ...initialState,
      journals: [{ id: 1234, journalActivities: [2] }],
    }
    const store = mockStore(stateWithJournal)

    await api.journals.updateJournal.mockResolvedValueOnce(responsePayload)

    const {
      meta: { requestId },
    } = await store.dispatch(updateJournal(requestPayload))

    const expectedActions = [
      updateJournal.pending(requestId, requestPayload),
      updateJournal.fulfilled(responsePayload, requestId, requestPayload),
    ]

    expect(store.getActions()).toEqual(expectedActions)
  })
})
