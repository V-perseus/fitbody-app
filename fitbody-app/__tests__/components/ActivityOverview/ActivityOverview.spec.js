import React from 'react'
import { render, cleanup } from '../../../testUtils'

import ActivityOverview from '../../../src/components/ActivityOverview/ActivityOverview'

afterEach(cleanup)

const myActivities = [
  2, // exercised
  3, // ate healthy
  4, // meal prepped
  5, // drank 3-4 liters
  6, // took a rest
  7, // sletp 6-8
]

describe('ActivityOverview', () => {
  it('renders snapshot correctly', () => {
    const tree = render(<ActivityOverview activities={myActivities} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('renders the exercised activities', () => {
    const { getByTestId } = render(<ActivityOverview myActivities={myActivities} />)
    expect(getByTestId('activity_item_0')).not.toBeNull()
    expect(getByTestId('activity_item_5')).not.toBeNull()
  })
})
