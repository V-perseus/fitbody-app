import React from 'react'
import { render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'
import moment from 'moment'

import DatePickerModal from '../../../src/components/DatePickerModal'

describe('DatePickerModal', () => {
  it('renders snapshot correctly', () => {
    const tree = renderer
      .create(
        <DatePickerModal
          todayLink={true}
          date={moment().toDate()}
          title={'TITLE'}
          minDate={new Date()}
          onDateChange={(date) => {}}
          onClose={() => {}}
          visible={true}
        />,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the correct props', () => {
    const date = moment().toDate()
    const { queryByText, getByText, getByTestId } = render(
      <DatePickerModal
        todayLink={true}
        date={date}
        title={'title'}
        minDate={new Date()}
        onDateChange={() => {}}
        onClose={() => {}}
        visible={true}
      />,
    )
    expect(getByText(/GO TO TODAY/i)).not.toBeNull()
    expect(getByText(/TITLE/i)).not.toBeNull()
    expect(queryByText(/SELECT/i)).not.toBeNull()
    expect(getByTestId('datepicker_close_button')).not.toBeNull()
  })
})
