import { MockedNavigator, render, cleanup, fireEvent } from '../../../../../testUtils'

import AccountDeletion from '../../../../../src/screens/tabs/account/AccountDeletion'

import api from '../../../../../src/services/api'

jest.mock('../../../../../src/services/api')

describe('Account Deletion screen', () => {
  let component = null
  beforeEach(() => {
    component = MockedNavigator({ component: AccountDeletion })
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
    await findByText('DATA DELETION REQUEST')
  })

  it('should render correct buttons and body text', async () => {
    const { findByText } = render(component)
    await findByText(
      /This action will delete your workout history and personal data inside the app. This action will not cancel your membership. In order to cancel your membership, please see our FAQ or email us at/i,
    )
    await findByText(
      /If you would like to proceed with deleting your personal data, confirm below. Please note that this action cannot be undone and you will immediately lose access to the Fit Body App and all your workout progress and history./i,
    )
    await findByText(/YES, DELETE MY PERSONAL DATA/gi)
    await findByText(/NO THANKS/gi)
  })

  it('should submit request and show confirmation', async () => {
    api.users.requestAccountDelete.mockResolvedValueOnce({ sent: true, message: 'Thanks for playing' })
    const { findByText } = render(component)
    const delBtn = await findByText(/YES, DELETE MY PERSONAL DATA/gi)
    fireEvent.press(delBtn)
    await findByText(/Account Deletion Request Submitted/gi)
    await findByText(
      /We have received your request for your account and data to be deleted. Further action may be required, so please be on the lookout for a follow-up email from us in 1-2 business days./i,
    )
  })
})
