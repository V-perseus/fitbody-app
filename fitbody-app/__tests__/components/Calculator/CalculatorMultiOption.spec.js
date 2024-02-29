import React from 'react'
import { fireEvent, render, cleanup } from '@testing-library/react-native'
import { render as appRender } from '../../../testUtils'

import CalculatorMultiOption from '../../../src/components/Calculator/CalculatorMultiOption'

afterEach(cleanup)

describe('CalculatorMultiOption', () => {
  const onPress = jest.fn()
  const options = [
    {
      value: 1,
      title: 'title_1',
      subtitle: 'subtitle_1',
    },
    {
      value: 2,
      title: 'title_2',
      subtitle: 'subtitle_2',
    },
  ]

  it('renders snapshot correctly', () => {
    const tree = appRender(<CalculatorMultiOption update={onPress} options={options} activeOption={1} title="title" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render options', () => {
    const { queryByText } = render(<CalculatorMultiOption update={onPress} options={options} activeOption={1} title="title" />)
    expect(queryByText('title')).not.toBeNull()
    expect(queryByText('TITLE_1')).not.toBeNull()
    expect(queryByText('TITLE_2')).not.toBeNull()
    expect(queryByText('subtitle_1')).not.toBeNull()
    expect(queryByText('subtitle_2')).not.toBeNull()
  })

  it('should handle update event', async () => {
    const { getByText } = render(<CalculatorMultiOption update={onPress} options={options} activeOption={1} title="title" />)
    expect(onPress).not.toHaveBeenCalled()
    await fireEvent.press(getByText('TITLE_2'))
    expect(onPress).toHaveBeenCalledWith(2)
  })
})
