import React from 'react'
import { render } from '@testing-library/react-native'
import { toHaveStyle } from '@testing-library/jest-native'
import renderer from 'react-test-renderer'

import { ActivityItem } from '../../../src/components/ActivityItem/ActivityItem'

const textStyle = {
  marginTop: 6,
  fontFamily: 'BebasNeue',
  fontSize: 16,
  textAlign: 'center',
}

describe('ActivityItem', () => {
  it('renders snapshot correctly', () => {
    const tree = renderer
      .create(
        <ActivityItem
          name={'exercised'}
          onPress={() => {}}
          iconColor={'#bada55'}
          // iconKey={'exercised'}
          // containerStyle={}
          // iconContainerStyle={}
          textStyle={textStyle}
        />,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the correct activity', () => {
    expect.extend({ toHaveStyle })
    const { queryByText } = render(
      <ActivityItem
        name={'exercised'}
        onPress={() => {}}
        iconColor={'#bada55'}
        // iconKey={'exercised'}
        // containerStyle={}
        // iconContainerStyle={}
        textStyle={textStyle}
      />,
    )
    expect(queryByText('EXERCISED')).not.toBeNull()
    expect(queryByText('EXERCISED')).toHaveStyle(textStyle)
  })
})
