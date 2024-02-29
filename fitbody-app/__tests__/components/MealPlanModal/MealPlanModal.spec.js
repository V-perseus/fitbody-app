import 'react-native'
import React from 'react'

import { render, fireEvent } from '../../../testUtils'
import MealPlanModal from '../../../src/components/MealPlanModal'

describe('MealPlanModal', () => {
  it('renders snapshot correctly', () => {
    const tree = render(
      <MealPlanModal
        showModal={true}
        modalText={'Are you sure you want see a title?'}
        noButtonText={'NO'}
        yesButtonText={'YES'}
        noButtonPressHandler={jest.fn}
        yesButtonPressHandler={jest.fn}
        onClose={jest.fn}
      />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders content correctly', async () => {
    const { findByText } = render(
      <MealPlanModal
        showModal={true}
        modalText={'Are you sure you want see a title?'}
        noButtonText={'NO'}
        yesButtonText={'YES'}
        noButtonPressHandler={jest.fn}
        yesButtonPressHandler={jest.fn}
        onClose={jest.fn}
      />,
    )

    await findByText(/Are you sure you want see a title?/i)
    await findByText('NO')
    await findByText('YES')
  })

  it('handles button presses', async () => {
    const yes = jest.fn()
    const no = jest.fn()
    const { findByText, findByTestId } = render(
      <MealPlanModal
        showModal={true}
        modalText={'Are you sure you want see a title?'}
        noButtonText={'NO'}
        yesButtonText={'YES'}
        noButtonPressHandler={no}
        yesButtonPressHandler={yes}
        onClose={no}
      />,
    )

    const noBtn = await findByText('NO')
    const yesBtn = await findByText('YES')
    const modalBg = await findByTestId('modal_bg')
    fireEvent.press(noBtn)
    expect(no).toHaveBeenCalled()
    fireEvent.press(yesBtn)
    expect(yes).toHaveBeenCalled()
    fireEvent(modalBg, 'onBackdropPress')
    expect(no).toHaveBeenCalledTimes(2)
  })
})
