import React from 'react'
import { act } from '@testing-library/react-native'
import { render } from '../../../testUtils'

import CollagePhoto from '../../../src/components/CollagePhoto'

describe('CollagePhoto', () => {
  it('renders snapshot correctly', () => {
    const tree = render(<CollagePhoto beforeImage={'../../'} afterImage={''} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render ', async () => {
    const { getByText, getByTestId } = render(<CollagePhoto beforeImage={'../../'} afterImage={''} />)
    const elLabel1 = getByText('Before')
    const elLabel2 = getByText('After')
    await act(async () => {
      const beforeImg = getByTestId('before_img')
      expect(elLabel1).not.toBeNull()
      expect(elLabel2).not.toBeNull()
      expect(beforeImg.props.source).toEqual({ uri: '../../' })
    })
  })
})
