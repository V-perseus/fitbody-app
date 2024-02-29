import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import FAQButton from '../../../src/components/FAQ/FAQButton'
import globals from '../../../src/config/globals'

describe('FAQButton', () => {
  let handlePress
  beforeEach(() => {
    handlePress = jest.fn()
  })

  afterEach(cleanup)

  it('renders snapshot correctly', () => {
    const tree = renderer.create(<FAQButton active={true} title="TECH SUPPORT" handlePress={() => handlePress('support')} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render button', () => {
    const { queryByText } = render(<FAQButton active={true} title="TECH SUPPORT" handlePress={() => handlePress('support')} />)
    expect(queryByText('TECH SUPPORT')).not.toBeNull()
  })

  it('should render inactive state', () => {
    // active
    //   ? [globals.styles.colors.colorTopaz, globals.styles.colors.colorSkyBlue]
    //   : [globals.styles.colors.colorGray, globals.styles.colors.colorGray]
    const container = render(<FAQButton active={false} title="TECH SUPPORT" handlePress={() => handlePress('support')} />)
    expect(container.queryByTestId('tab_bg')).toBeDefined()
    expect(container.queryByText(globals.styles.colors.colorGray)).toBeDefined()
  })

  it('should render active state', () => {
    // active
    //   ? [globals.styles.colors.colorTopaz, globals.styles.colors.colorSkyBlue]
    //   : [globals.styles.colors.colorGray, globals.styles.colors.colorGray]
    const container = render(<FAQButton active={true} title="TECH SUPPORT" handlePress={() => handlePress('support')} />)
    expect(container.queryByTestId('tab_bg')).toBeDefined()
    expect(container.queryByText(globals.styles.colors.colorTopaz)).toBeDefined()
    expect(container.queryByText(globals.styles.colors.colorSkyBlue)).toBeDefined()
  })

  it('should handle press event', async () => {
    const { queryByTestId } = render(<FAQButton active={true} title="TECH SUPPORT" handlePress={() => handlePress('support')} />)
    expect(queryByTestId('tab_btn')).toBeDefined()
    await fireEvent.press(queryByTestId('tab_btn'))
    expect(handlePress).toHaveBeenCalledWith('support')
  })
})
