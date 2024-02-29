import React from 'react'
import { Text } from 'react-native'
import { fireEvent, render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import { ButtonOpacity } from '../../../src/components/Buttons/ButtonOpacity'

describe('ButtonOpacity', () => {
  const onPress = jest.fn()

  it('renders snapshot correctly', () => {
    const tree = renderer
      .create(
        <ButtonOpacity onPress={onPress} text="test">
          <Text testID="child">test</Text>
        </ButtonOpacity>,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render child', () => {
    const { queryByTestId } = render(
      <ButtonOpacity onPress={onPress} text="test">
        <Text testID="child">test</Text>
      </ButtonOpacity>,
    )
    expect(queryByTestId('child')).not.toBeNull()
  })

  it('should handle press event', async () => {
    const { getByTestId } = render(<ButtonOpacity onPress={onPress} text="test" testID="button_icon" />)
    await fireEvent.press(getByTestId('button_icon'))
    expect(onPress).toHaveBeenCalled()
  })
})
