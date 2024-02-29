import 'react-native'
import React from 'react'

import { render, fireEvent } from '../../../testUtils'
import EditedRecipeModal from '../../../src/components/MealPlanModal/EditedRecipeModal'

describe('EditedRecipeModal', () => {
  it('renders snapshot correctly', () => {
    const tree = render(
      <EditedRecipeModal showModal={true} noButtonPressHandler={jest.fn} yesButtonPressHandler={jest.fn} onClose={jest.fn} />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders content correctly', async () => {
    const { findByText } = render(
      <EditedRecipeModal showModal={true} noButtonPressHandler={jest.fn} yesButtonPressHandler={jest.fn} onClose={jest.fn} />,
    )

    await findByText(/You previously/i)
    await findByText(/edited this recipe/i)
    await findByText(/Which version would you like to use?/i)
    await findByText(/KEEP/i)
    await findByText('USE ORIGINAL')
  })

  it('handles button presses', async () => {
    const yes = jest.fn()
    const no = jest.fn()
    const { findByText, findByTestId } = render(
      <EditedRecipeModal showModal={true} noButtonPressHandler={no} yesButtonPressHandler={yes} onClose={no} />,
    )

    const noBtn = await findByText(/KEEP/i)
    const yesBtn = await findByText('USE ORIGINAL')
    const modalBg = await findByTestId('modal_bg')
    fireEvent.press(noBtn)
    expect(no).toHaveBeenCalled()
    fireEvent.press(yesBtn)
    expect(yes).toHaveBeenCalled()
    fireEvent(modalBg, 'onBackdropPress')
    expect(no).toHaveBeenCalledTimes(2)
  })
})
