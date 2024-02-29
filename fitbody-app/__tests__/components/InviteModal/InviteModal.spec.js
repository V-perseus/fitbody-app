import 'react-native'
import React from 'react'
import { expect, it } from '@jest/globals'

import { render } from '../../../testUtils'
import InviteModal from '../../../src/components/InviteModal'

describe('InviteModal', () => {
  it('renders snapshot correctly', () => {
    const tree = render(<InviteModal />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders JoinAmbassadorModal content correctly', () => {
    const { getByText } = render(<InviteModal />)

    const headerText = getByText(/Loving the Fit Body app/i)
    const joinBtn = getByText('JOIN NOW')

    expect(headerText).not.toBeNull()
    expect(joinBtn).not.toBeNull()
  })

  it('renders ReferralProgramModal content correctly', () => {
    const { getByText } = render(<InviteModal />, {
      preloadedState: { data: { user: { is_ambassador: true, ambassador_link: 'TEST LINK' } } },
    })

    const headerText = getByText(/Share this link to invite a friend/i)
    const shareBtn = getByText('SHARE YOUR LINK')
    const link = getByText('TEST LINK')

    expect(headerText).not.toBeNull()
    expect(shareBtn).not.toBeNull()
    expect(link).not.toBeNull()
  })
})
