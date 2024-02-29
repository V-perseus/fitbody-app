import React from 'react'
import { Text } from 'react-native'
import { render } from '../testUtils'

const Hello = () => <Text>Hello, world!</Text>

describe('Hello', () => {
  it('renders the correct message', () => {
    const { queryByText } = render(<Hello />)
    expect(queryByText('Hello, world!')).not.toBeNull()
  })
})
