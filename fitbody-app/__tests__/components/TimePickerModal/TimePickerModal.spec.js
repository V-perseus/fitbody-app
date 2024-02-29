import React from 'react'

import { render, cleanup, fireEvent } from '../../../testUtils'
import TimePickerModal from '../../../src/components/TimePickerModal'

describe('TimePickerModal', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders snapshot correctly', () => {
    const tree = render(<TimePickerModal onChange={jest.fn} onClose={jest.fn} visible={true} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the default time option', () => {
    const { getByText } = render(<TimePickerModal onChange={jest.fn} onClose={jest.fn} visible={true} />)
    expect(getByText(/7/i)).not.toBeNull()
    expect(getByText(/00/gi)).not.toBeNull()
    expect(getByText(/am/gi)).not.toBeNull()
  })

  it('selects the current time option', async () => {
    const handleChange = jest.fn()
    const { getByText } = render(<TimePickerModal onChange={handleChange} onClose={jest.fn} visible={true} />)
    await fireEvent.press(getByText(/select/gi))
    expect(handleChange).toHaveBeenCalled()
    expect(handleChange).toHaveBeenCalledWith('07:00')
  })

  it('closes the modal', async () => {
    const handleClose = jest.fn()
    const { getByTestId, queryByText } = render(<TimePickerModal onChange={jest.fn} onClose={handleClose} visible={true} />)
    await fireEvent.press(getByTestId('close_btn'))
    expect(handleClose).toHaveBeenCalled()
    expect(queryByText(/select/gi)).toBeNull()
  })
})
