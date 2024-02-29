import SignInSignUp from '../../../src/screens/auth/SignInSignUp'
import { MockedNavigator, render, cleanup } from '../../../testUtils'

describe('SignInSignUp Screen', () => {
  let component = null
  beforeEach(() => {
    component = MockedNavigator({ component: SignInSignUp })
  })
  afterEach(() => {
    cleanup()
  })

  it('renders snapshot correctly', async () => {
    const tree = render(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Should render screen text', async () => {
    const { queryByText, queryAllByText } = render(component)
    expect(queryAllByText(/LOG IN/gi)).toHaveLength(2)
    expect(queryByText(/Email:/gi)).not.toBeNull()
    expect(queryByText(/Password:/gi)).not.toBeNull()
    expect(queryByText(/Forgot Password/gi)).not.toBeNull()
    expect(queryByText(/Have Questions\?/gi)).not.toBeNull()
  })
})
