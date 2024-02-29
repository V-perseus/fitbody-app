import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import { ButtonIcon } from '../../../src/components/Buttons/ButtonIcon'
import ChevronRight from '../../../assets/images/svg/icon/16px/cheveron/right.svg'

describe('ButtonIcon', () => {
  const onPress = jest.fn()

  it('renders snapshot correctly', () => {
    const tree = renderer.create(<ButtonIcon onPress={onPress} text="test" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render button text', () => {
    const { queryByText } = render(<ButtonIcon onPress={onPress} text="test" />)
    expect(queryByText('test')).not.toBeNull()
  })

  it('should handle press event', async () => {
    const { getByTestId } = render(<ButtonIcon onPress={onPress} text="test" testID="button_icon" />)
    await fireEvent.press(getByTestId('button_icon'))
    expect(onPress).toHaveBeenCalled()
  })

  it('should pass display proper icon', async () => {
    const { queryByTestId } = render(
      <ButtonIcon
        onPress={onPress}
        text="test"
        testID="button_icon"
        rightIcon={() => <ChevronRight style={{ marginLeft: 8 }} color={'red'} testID="icon_r" />}
        leftIcon={() => <ChevronRight style={{ marginLeft: 8 }} color={'red'} testID="icon_l" />}
      />,
    )
    expect(queryByTestId('button_icon')).not.toBeNull()
    expect(queryByTestId('icon_r')).not.toBeNull()
    expect(queryByTestId('icon_r')).toHaveProp('color')
    expect(queryByTestId('icon_r')).toHaveStyle({ marginLeft: 8 })
    expect(queryByTestId('icon_l')).not.toBeNull()
    expect(queryByTestId('icon_l')).toHaveProp('color')
    expect(queryByTestId('icon_l')).toHaveStyle({ marginLeft: 8 })
  })
})
