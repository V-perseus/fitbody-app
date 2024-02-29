import { MockedNavigator, render } from '../../../../../testUtils'

import Menu from '../../../../../src/screens/tabs/account/Menu'

describe('Menu Screen', () => {
  it('renders snapshot correctly', () => {
    const comp = MockedNavigator({ component: Menu })
    const tree = render(comp).toJSON()
    expect(tree).toMatchSnapshot()
  })

  // it('renders all buttons correctly', () => {
  //   const comp = MockedNavigator({ component: Menu })
  //   const { getByText } = render(comp)

  //   const profileBtn = getByText(/profile/i)

  //   expect(profileBtn).not.toBeNull()
  //   // fireEvent.press(profileBtn)
  //   // expect(counterText.props.children).toEqual(['Current count: ', 1])
  //   // fireEvent.press(decrement)
  //   // expect(counterText.props.children).toEqual(['Current count: ', 0])
  // })
})
