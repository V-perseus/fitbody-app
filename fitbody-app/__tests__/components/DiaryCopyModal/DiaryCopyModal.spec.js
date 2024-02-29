import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react-native'
import renderer from 'react-test-renderer'
import moment from 'moment'

import DiaryCopyModal from '../../../src/components/DiaryCopyModal'

describe('DiaryCopyModal', () => {
  const createButtonHandler = jest.fn()
  const closeButton = jest.fn()

  afterEach(() => {
    cleanup()
  })

  it('renders snapshot correctly', () => {
    const tree = renderer
      .create(
        <DiaryCopyModal
          showModal={true}
          closeModal={closeButton}
          sourceDate={moment()}
          selectedDays={[]}
          selectDayHandler={() => {}}
          createButtonHandler={createButtonHandler}
        />,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles button presses', async () => {
    const { getByText, getByTestId } = render(
      <DiaryCopyModal
        showModal={true}
        closeModal={closeButton}
        sourceDate={moment()}
        selectedDays={[]}
        selectDayHandler={() => {}}
        createButtonHandler={createButtonHandler}
      />,
    )
    const copyBtn = getByText(/COPY/)
    expect(copyBtn).not.toBeNull()
    await fireEvent.press(copyBtn)
    expect(createButtonHandler).toBeCalledTimes(1)
    const closeBtn = getByTestId('close_btn')
    expect(closeBtn).not.toBeNull()
    await fireEvent.press(closeBtn)
    expect(closeButton).toBeCalledTimes(1)
  })

  it('renders all text', async () => {
    const { getByText } = render(
      <DiaryCopyModal
        showModal={true}
        closeModal={closeButton}
        sourceDate={moment()}
        selectedDays={[]}
        selectDayHandler={() => {}}
        createButtonHandler={createButtonHandler}
      />,
    )
    const titleText = getByText(/Copy Selected Foods/)
    const descriptionText = getByText(/Choose which day\(s\) to/i)
    const descriptionText2 = getByText(/copy selected foods to./)
    const thisWeekText = getByText(/This Week/)
    const nextWeekText = getByText(/Next Week/i)
    expect(titleText).not.toBeNull()
    expect(descriptionText).not.toBeNull()
    expect(descriptionText2).not.toBeNull()
    expect(thisWeekText).not.toBeNull()
    expect(nextWeekText).not.toBeNull()
  })
})
