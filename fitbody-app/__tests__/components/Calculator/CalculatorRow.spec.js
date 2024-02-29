import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'

import CalculatorRow from '../../../src/components/Calculator/CalculatorRow'

describe('CalculatorRow', () => {
  const updateMock = jest.fn()
  const updateUnitMock = jest.fn()

  let component
  beforeEach(() => {
    component = render(
      <CalculatorRow
        type="height"
        value={{
          value: 5,
          unit: 'feet',
        }}
        title={'How tall are you?'}
        buttonsData={[
          { value: 'inches', title: 'feet' },
          { value: 'cm', title: 'centimeter' },
        ]}
        update={updateMock}
        updateUnit={updateUnitMock}
      />,
    )
  })

  it('renders snapshot correctly', () => {
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render row', () => {
    const { queryByText } = component
    expect(queryByText('How tall are you?')).not.toBeNull()
  })

  it('should handle input', () => {
    const { queryByTestId } = component
    fireEvent.changeText(queryByTestId('input'), 20)
    expect(updateMock).toBeCalledWith({ unit: 'feet', value: 20 })
    // expect(queryByText('CENTIMETER')).not.toBeNull()
  })

  it('should render and handle inches input', async () => {
    const { queryByTestId } = render(
      <CalculatorRow
        type="height"
        value={{
          value: 5,
          unit: 'inches',
        }}
        title={'How tall are you?'}
        buttonsData={[
          { value: 'inches', title: 'feet' },
          { value: 'cm', title: 'centimeter' },
        ]}
        update={updateMock}
        updateUnit={updateUnitMock}
      />,
    )
    fireEvent.changeText(queryByTestId('inches_input'), 20)
    expect(updateMock).toBeCalledWith({ unit: 'inches', value: 20 })
  })
})
