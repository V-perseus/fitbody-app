import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import { HeaderButton } from '../../../src/components/Buttons/HeaderButton'
import ChevronRight from '../../../assets/images/svg/icon/16px/cheveron/right.svg'

describe('HeaderButton', () => {
  const onPress = jest.fn()

  it('renders snapshot correctly', () => {
    const tree = renderer.create(<HeaderButton onPress={onPress} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render back arrow icon', () => {
    const { getByTestId } = render(<HeaderButton onPress={onPress} />)
    expect(getByTestId('back_arrow')).not.toBeNull()
  })

  it('should handle press event', async () => {
    const { getByTestId } = render(<HeaderButton onPress={onPress} testID="btn" />)
    await fireEvent.press(getByTestId('btn'))
    expect(onPress).toHaveBeenCalled()
  })

  it('should render custom icon', async () => {
    const { queryByTestId } = render(
      <HeaderButton onPress={onPress}>
        <ChevronRight testID="icon" />
      </HeaderButton>,
    )
    expect(queryByTestId('icon')).not.toBeNull()
  })
})
