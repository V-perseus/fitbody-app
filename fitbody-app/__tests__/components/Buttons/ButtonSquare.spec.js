import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import { ButtonSquare } from '../../../src/components/Buttons/ButtonSquare'

describe('ButtonSquare', () => {
  const onPress = jest.fn()

  it('renders snapshot correctly', () => {
    const tree = renderer.create(<ButtonSquare onPress={onPress} text="test" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render button text', () => {
    const { queryByText } = render(<ButtonSquare onPress={onPress} text="test" />)
    expect(queryByText('test')).not.toBeNull()
  })

  it('should handle press event', async () => {
    const { getByTestId } = render(<ButtonSquare onPress={onPress} text="test" testID="button_square" />)
    await fireEvent.press(getByTestId('button_square'))
    expect(onPress).toHaveBeenCalled()
  })

  it('should have proper base styles', async () => {
    const styles = {
      width: 114,
      height: 56,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    }
    const { queryByTestId } = render(<ButtonSquare onPress={onPress} text="test" testID="button_square" />)
    expect(queryByTestId('button_square')).toHaveStyle(styles)
  })
})
