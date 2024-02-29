import { cleanup, fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { TimeListItem } from '../../../../../src/screens/tabs/account/NotificationSettings/TimeListItem'

describe('TimeListItem', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders snapshot correctly', () => {
    const tree = render(<TimeListItem time={'11:00'} onPress={jest.fn} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render time', async () => {
    const { queryByText } = render(<TimeListItem time={'11:00'} onPress={jest.fn} />)
    expect(queryByText(/11:00 AM/gi)).not.toBeNull()
  })

  it('should handle delete button press', async () => {
    const del = jest.fn()
    const { queryByTestId } = render(<TimeListItem time={'11:00'} onPress={del} />)
    expect(queryByTestId('del_button')).not.toBeNull()
    fireEvent.press(queryByTestId('del_button'))
    expect(del).toHaveBeenCalled()
  })
})
