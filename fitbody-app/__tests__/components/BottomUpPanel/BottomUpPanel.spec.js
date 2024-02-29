import React from 'react'
import { Text } from 'react-native'
import { render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import BottomPanelUp from '../../../src/components/BottomUpPanel'

jest.useFakeTimers()

describe('BottomPanelUp', () => {
  it('renders snapshot correctly', () => {
    const tree = renderer
      .create(
        <BottomPanelUp
          isOpen={true}
          startHeight={0}
          topEnd={400}
          header={() => null}
          content={() => <Text testID="content">content</Text>}
        />,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('should render content', async () => {
    const { queryByTestId, queryByText, getByTestId } = render(
      <BottomPanelUp
        isOpen={true}
        startHeight={0}
        topEnd={400}
        header={() => null}
        content={() => <Text testID="content">content</Text>}
      />,
    )
    await getByTestId('content')
    // await getByTestId('scrollview')
    // expect(getByTestId('scrollview')).not.toBeNull()
    expect(queryByText('content')).not.toBeNull()
  })

  // it('should handle toggle press event', async () => {
  //   const { container, getByTestId, getByText } = render(
  //     <BottomPanelUp isOpen={false} startHeight={0} topEnd={400} header={() => <Text>toggle</Text>} content={() => null} />,
  //   )
  //   expect(container.instance.state.open).toEqual(false)
  //   await fireEvent.press(getByText('toggle'))
  //   expect(container.instance.state.open).toEqual(true)
  // })
})
