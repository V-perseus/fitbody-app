import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import { ButtonFloating } from '../../../src/components/Buttons/ButtonFloating'

describe('ButtonFloating', () => {
  it('renders snapshot correctly', () => {
    const tree = renderer.create(<ButtonFloating text="test" style={{ color: 'red' }} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render button', () => {
    const { queryByText } = render(<ButtonFloating text="test" />)
    expect(queryByText('test')).not.toBeNull()
  })

  it('should handle press event', async () => {
    const onPress = jest.fn()
    const { getByTestId } = render(<ButtonFloating text="test" textStyle={{ color: 'red' }} onPress={onPress} />)
    await fireEvent.press(getByTestId('button_floating'))
    expect(onPress).toHaveBeenCalled()
  })

  it('should pass proper styles', async () => {
    const onPress = jest.fn()
    const { queryByText, queryByTestId } = render(
      <ButtonFloating text="test" style={{ color: '#bada55' }} textStyle={{ color: '#bada55' }} onPress={onPress} />,
    )
    expect(queryByText('test')).toHaveStyle({ color: '#bada55' })
    expect(queryByTestId('button_floating')).toHaveStyle({ color: '#bada55' })
  })
})
