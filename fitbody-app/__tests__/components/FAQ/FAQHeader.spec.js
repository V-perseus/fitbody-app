import React from 'react'
import { cleanup, render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import FAQHeader from '../../../src/components/FAQ/FAQHeader'

describe('FAQHeader', () => {
  const availableTabs = ['support', 'workouts', 'meals', 'community']

  let handlePress
  beforeEach(() => {
    handlePress = jest.fn()
  })

  afterEach(cleanup)

  it('renders snapshot correctly', () => {
    const tree = renderer.create(<FAQHeader active={availableTabs[0]} handlePress={handlePress} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correct tabs', () => {
    const { queryByText } = render(<FAQHeader active={availableTabs[0]} handlePress={handlePress} />)
    expect(queryByText(/tech support/i)).not.toBeNull()
    expect(queryByText(/workouts/i)).not.toBeNull()
    expect(queryByText(/meals/i)).not.toBeNull()
    expect(queryByText(/community/i)).not.toBeNull()
  })
})
