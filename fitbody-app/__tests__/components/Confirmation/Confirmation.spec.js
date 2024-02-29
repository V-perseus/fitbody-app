import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'

import Confirmation from '../../../src/components/Confirmation/Confirmation'

describe('Confirmation', () => {
  const noHandler = jest.fn()
  const yesHandler = jest.fn()

  let component
  beforeEach(() => {
    component = render(
      <Confirmation visible={true} handleYes={yesHandler} handleNo={noHandler} yesText="yes" noText="no" question="test" />,
    )
  })

  it('renders snapshot correctly', () => {
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render modal', async () => {
    const { getByText } = component
    expect(getByText('yes')).not.toBeNull()
    expect(getByText('no')).not.toBeNull()
    expect(getByText('test')).not.toBeNull()
  })

  it('should handle "no" press', async () => {
    const { queryByText } = component
    const btn = queryByText('no')
    fireEvent.press(btn)
    expect(noHandler).toHaveBeenCalled()
  })

  it('should handle "yes" press', async () => {
    const { queryByText } = component
    const btn = queryByText('yes')
    fireEvent.press(btn)
    expect(yesHandler).toHaveBeenCalled()
  })
})
