import React from 'react'
import { cleanup, render, fireEvent } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import QuestionAccordion from '../../../src/components/FAQ/QuestionAccordion'

describe('FAQ QuestionAccordion', () => {
  afterEach(cleanup)

  it('renders snapshot correctly', () => {
    const tree = renderer
      .create(
        <QuestionAccordion key={`key`} title={'TITLE'} slideLayoutAnimation={() => {}}>
          BODY TEXT
        </QuestionAccordion>,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render title', () => {
    const { queryByText } = render(
      <QuestionAccordion key={`key`} title={'TITLE'} slideLayoutAnimation={() => {}}>
        BODY TEXT
      </QuestionAccordion>,
    )
    expect(queryByText('TITLE')).not.toBeNull()
  })

  it('should show/hide body when pressed', async () => {
    const { queryByTestId, queryByText } = render(
      <QuestionAccordion key={`key`} title={'TITLE'} slideLayoutAnimation={() => {}}>
        BODY TEXT
      </QuestionAccordion>,
    )
    const button = queryByTestId('faq_btn')
    expect(button).toBeDefined()
    await fireEvent.press(button)
    expect(queryByText(/BODY TEXT/)).toBeDefined()
    await fireEvent.press(button)
    expect(queryByText(/BODY TEXT/)).toBeNull()
  })
})
