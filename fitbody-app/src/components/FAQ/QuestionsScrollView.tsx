import React, { useState } from 'react'
import { LayoutAnimation, ScrollView } from 'react-native'

//Component
import QuestionAccordion from './QuestionAccordion'
import Questions from './Questions'
import SegueModal from '../SegueModal/SegueModal'

// Types
import { ActiveTab } from '../../screens/tabs/account/FAQ/FAQ'

const ANIMATION_DURATION = 300

interface ICommunityProps {
  section: ActiveTab
}
const Community = ({ section }: ICommunityProps) => {
  const [isShowing, setIsShowing] = useState(false)
  const [linkURL, setLinkURL] = useState('')

  function showModal(url: string) {
    setIsShowing(true)
    setLinkURL(url)
  }

  function closeModal() {
    setIsShowing(false)
    setLinkURL('')
  }

  const slideLayoutAnimation = async () => {
    // just call this function before a state change you want animated
    // requires that list items have key that does not change between rerenders
    const CustomLayoutLinear = {
      duration: ANIMATION_DURATION,
      create: {
        type: LayoutAnimation.Types.easeIn,
        property: LayoutAnimation.Properties.scaleY,
      },
      update: {
        type: LayoutAnimation.Types.easeOut,
      },
    }
    LayoutAnimation.configureNext(CustomLayoutLinear)
  }

  return (
    <>
      <SegueModal
        modalText={'Open link in browser?'}
        noButtonText={'CANCEL'}
        yesButtonText={'VISIT'}
        url={linkURL}
        showModal={isShowing}
        setShowModal={closeModal}
      />
      <ScrollView>
        {Questions[section].map((item, index) => (
          <QuestionAccordion key={`qa${index}`} title={item.title} slideLayoutAnimation={slideLayoutAnimation}>
            {item.description instanceof Function ? item.description({ showModal: showModal }) : item.description}
          </QuestionAccordion>
        ))}
      </ScrollView>
    </>
  )
}

export default Community
