import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'

import CalculatorButton from '../../../src/components/Calculator/CalculatorButton'

describe('CalculatorButton', () => {
  const onPress = jest.fn()

  it('renders snapshot correctly', () => {
    const tree = render(<CalculatorButton onPress={onPress} title="test" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render button text', () => {
    const { queryByText } = render(<CalculatorButton onPress={onPress} title="test" />)
    expect(queryByText('test')).not.toBeNull()
  })

  it('should handle press event', async () => {
    const { getByTestId } = render(<CalculatorButton handlePress={onPress} title="test" />)
    await fireEvent.press(getByTestId('calc_btn'))
    expect(onPress).toHaveBeenCalled()
  })
})
