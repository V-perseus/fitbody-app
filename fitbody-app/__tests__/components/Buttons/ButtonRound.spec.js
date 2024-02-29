import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import { ButtonRound } from '../../../src/components/Buttons/ButtonRound'

describe('ButtonRound', () => {
  const onPress = jest.fn()

  it('renders snapshot correctly', () => {
    const tree = renderer.create(<ButtonRound onPress={onPress} text="test" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render button text', () => {
    const { queryByText } = render(<ButtonRound onPress={onPress} text="test" />)
    expect(queryByText('test')).not.toBeNull()
  })

  it('should handle press event', async () => {
    const { getByTestId } = render(<ButtonRound onPress={onPress} text="test" testID="button_round" />)
    await fireEvent.press(getByTestId('button_round'))
    expect(onPress).toHaveBeenCalled()
  })

  it('should have proper base styles', async () => {
    const styles = {
      width: 114,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
    }
    const { queryByTestId } = render(<ButtonRound onPress={onPress} text="test" testID="button_round" />)
    expect(queryByTestId('button_round')).toHaveStyle(styles)
  })
})
