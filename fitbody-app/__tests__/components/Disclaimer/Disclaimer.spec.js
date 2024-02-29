import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import Disclaimer from '../../../src/components/Disclaimer'

describe('Disclaimer', () => {
  const mockNavigate = jest.fn()
  const onAccept = jest.fn()

  afterEach(() => {
    cleanup()
  })

  it('renders snapshot correctly', () => {
    const tree = renderer
      .create(
        <Disclaimer
          route={{
            params: {
              title: 'TITLE',
              body: '<div>BODY</div>',
              acceptHandler: onAccept,
              approvalRequired: false,
            },
          }}
        />,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders content and buttons', () => {
    const { getByText } = render(
      <Disclaimer
        navigation={{ goBack: mockNavigate }}
        route={{
          params: {
            title: 'TITLE',
            body: '<div>BODY</div>',
            acceptHandler: onAccept,
            approvalRequired: true,
          },
        }}
      />,
    )

    const titleText = getByText('TITLE')
    const bodyText = getByText('BODY')
    expect(titleText).not.toBeNull()
    expect(bodyText).not.toBeNull()

    const acceptBtn = getByText('ACCEPT')
    const declineBtn = getByText('DECLINE')
    expect(acceptBtn).not.toBeNull()
    expect(declineBtn).not.toBeNull()

    fireEvent.press(acceptBtn)
    expect(onAccept).toBeCalledTimes(1)

    fireEvent.press(declineBtn)
    expect(mockNavigate).toBeCalledTimes(1)
  })

  it('renders when approval not required', () => {
    const { getByText } = render(
      <Disclaimer
        route={{
          params: {
            title: 'TITLE',
            body: '<div>BODY</div>',
            acceptHandler: onAccept,
            approvalRequired: false,
          },
        }}
      />,
    )
    const gotItBtn = getByText('GOT IT!')
    expect(gotItBtn).not.toBeNull()
    fireEvent.press(gotItBtn)
    expect(onAccept).toBeCalledTimes(2)
  })
})
