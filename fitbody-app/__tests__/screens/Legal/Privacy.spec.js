import api from '../../../src/services/api'
import Privacy from '../../../src/screens/legal/Privacy'
import { waitFor, MockedNavigator, render, act, cleanup } from '../../../testUtils'

jest.mock('../../../src/services/api')

describe('Privacy Screen', () => {
  afterEach(() => {
    cleanup()
  })

  let comp = null
  beforeEach(async () => {
    comp = MockedNavigator({ component: Privacy })
  })

  it('renders snapshot correctly', async () => {
    await act(async () => {
      await api.legal.privacy.mockResolvedValue({ policy: { content: '<div>These are privacy violations.</div>' } })
      const tree = render(comp).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  it('Should render screen title', async () => {
    await act(async () => {
      const content = '<div>These are prviacy violations.</div>'
      await api.legal.privacy.mockResolvedValue({ policy: { content } })
      const { queryByText } = render(comp)
      expect(queryByText(/Privacy/gi)).not.toBeNull()
    })
  })

  it('should render text in webview', async () => {
    const content = '<div>These are prviacy violations.</div>'

    await act(async () => {
      await api.legal.privacy.mockResolvedValue({ policy: { content } })
      const { getByTestId } = render(comp)
      await waitFor(() => {
        expect(getByTestId('webview')).toHaveProp('source', { html: content })
      })
    })
  })
})
