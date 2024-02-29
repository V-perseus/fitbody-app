import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'

import ContactSupport from '../../../src/components/ContactSupport/ContactSupport'

describe('ContactSupport', () => {
  const onPress = jest.fn()

  it('renders snapshot correctly', () => {
    const tree = render(<ContactSupport onPress={onPress} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render', () => {
    const { queryByText } = render(<ContactSupport onPress={onPress} />)
    expect(queryByText(/Have Questions?/)).not.toBeNull()
  })

  it('should handle press event', async () => {
    const { getByText } = render(<ContactSupport onPress={onPress} />)
    await fireEvent.press(getByText('Contact Us.'))
    expect(onPress).toHaveBeenCalled()
  })
})
