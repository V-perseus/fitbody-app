import React from 'react'
import { cleanup, render, fireEvent } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import QuestionsScrollView from '../../../src/components/FAQ/QuestionsScrollView'

describe('FAQ QuestionsScrollView', () => {
  afterEach(cleanup)

  it('renders snapshot correctly', () => {
    const tree = renderer.create(<QuestionsScrollView section={'support'} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should show modal when link is pressed', async () => {
    const { queryByText, queryByTestId } = render(<QuestionsScrollView section={'support'} />)
    const question = queryByText(/What are membership plans\? How much do they cost\?/gi)
    expect(question).not.toBeNull()
    await fireEvent.press(question)
    const linkText = queryByTestId('link_btn')
    expect(linkText).toBeDefined()
    await fireEvent.press(linkText)
    expect(queryByText(/Open link in browser\?/i)).toBeDefined()
  })
})
