import api from '../../../src/services/api'
import Terms from '../../../src/screens/legal/Terms'
import { MockedNavigator, render, act, cleanup, waitFor } from '../../../testUtils'

jest.mock('../../../src/services/api')

describe('Terms Screen', () => {
  afterEach(() => {
    cleanup()
  })

  let comp = null
  beforeEach(async () => {
    comp = MockedNavigator({ component: Terms })
  })

  it('renders snapshot correctly', async () => {
    await act(async () => {
      await api.legal.terms.mockResolvedValue({ terms: { content: 'These are the Term And Conditions.' } })
      const tree = render(comp).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  it('Should render screen title', async () => {
    await act(async () => {
      const content = '<div>These are the Term And Conditions.</div>'
      await api.legal.terms.mockResolvedValue({ terms: { content } })
      const { queryByText } = render(comp)
      expect(queryByText(/Terms and Conditions/gi)).not.toBeNull()
    })
  })

  it('should render text in webview', async () => {
    const content = '<div>These are the Term And Conditions.</div>'
    await act(async () => {
      await api.legal.terms.mockResolvedValue({ terms: { content } })
      const { getByTestId } = render(comp)
      await waitFor(() => {
        expect(getByTestId('webview')).toHaveProp('source', { html: content })
      })
    })
  })
})
