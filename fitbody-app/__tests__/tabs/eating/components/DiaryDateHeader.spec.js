import React from 'react'
import { cleanup, waitFor, render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'
import moment from 'moment'
import { NavigationContainer } from '@react-navigation/native'

import { DiaryDateHeader } from '../../../../src/screens/tabs/eating/MealPlan/DiaryDateHeader'

describe('DiaryDateHeader', () => {
  afterEach(() => {
    cleanup()
  })

  let component = null
  beforeEach(async () => {
    Date.now = jest.fn(() => 1572393600000) // 2019-10-30T00:00Z0 (GMT)
    const today = moment()
    component = (props) => (
      <NavigationContainer>
        <DiaryDateHeader onDayChange={props?.changeDay ?? jest.fn} navigation={{ navigate: jest.fn }} today={props?.today ?? today} />
      </NavigationContainer>
    )
  })

  it('renders snapshot correctly', () => {
    const tree = renderer.create(component()).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render todays date in list', async () => {
    const { queryByText } = render(component({ today: now }))
    const now = moment()
    await waitFor(() => queryByText(/30/), {
      timeout: 3000,
      interval: 200,
    })
    expect(queryByText(/30/gi)).not.toBeNull()
  })
})
