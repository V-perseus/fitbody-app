import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import { ButtonFloatingGroup } from '../../../src/components/Buttons/ButtonFloatingGroup'

describe('ButtonFloatingGroup', () => {
  const leftPress = jest.fn()
  const rightPress = jest.fn()

  it('renders snapshot correctly', () => {
    const tree = renderer
      .create(<ButtonFloatingGroup onPressLeft={leftPress} onPressRight={rightPress} btnLeftText="left" btnRightText="right" />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render buttons text', () => {
    const { queryByText } = render(
      <ButtonFloatingGroup onPressLeft={leftPress} onPressRight={rightPress} btnLeftText="left" btnRightText="right" />,
    )
    expect(queryByText('left')).not.toBeNull()
    expect(queryByText('right')).not.toBeNull()
  })

  it('should handle press event', async () => {
    const { getByTestId } = render(
      <ButtonFloatingGroup onPressLeft={leftPress} onPressRight={rightPress} btnLeftText="left" btnRightText="right" />,
    )
    await fireEvent.press(getByTestId('button_left'))
    await fireEvent.press(getByTestId('button_right'))
    expect(leftPress).toHaveBeenCalled()
    expect(rightPress).toHaveBeenCalled()
  })

  it('should pass proper styles', async () => {
    const color = { color: '#bada55' }
    const { queryByTestId } = render(
      <ButtonFloatingGroup
        onPressLeft={leftPress}
        onPressRight={rightPress}
        btnLeftText="left"
        btnRightText="right"
        btnLeftStyles={color}
        btnRightStyles={color}
      />,
    )
    expect(queryByTestId('button_left')).toHaveStyle(color)
    expect(queryByTestId('button_right')).toHaveStyle(color)
  })
})
