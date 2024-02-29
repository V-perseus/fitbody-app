import { MockedNavigator, render, cleanup } from '../../../../../testUtils'

import Settings from '../../../../../src/screens/tabs/account/Settings'

jest.mock('../../../../../src/services/api')

describe('Settings screen', () => {
  let component = null
  beforeEach(() => {
    component = MockedNavigator({ component: Settings })
  })
  afterEach(() => {
    cleanup()
  })

  it('renders snapshot correctly', async () => {
    const tree = render(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render header buttons', async () => {
    const { findByText } = render(component)
    await findByText('SETTINGS')
  })

  it('should all settings links', async () => {
    const { findByText } = render(component)
    await findByText('Notifications')
    await findByText('Downloads')
    await findByText('Change Password')
    await findByText('Data Deletion Request')
    await findByText('Terms & Conditions')
    await findByText('Privacy Policy')
  })
})
