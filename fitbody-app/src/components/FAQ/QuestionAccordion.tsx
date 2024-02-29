import React, { useState } from 'react'
import { Animated, TouchableOpacity, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

// Assets
import styles from './styles'
import ChevronDown from '../../../assets/images/svg/icon/16px/cheveron/down.svg'
import ChevronUp from '../../../assets/images/svg/icon/16px/cheveron/up.svg'
import globals from '../../config/globals'

interface IQuestionAccordionProps {
  title: string
  children: React.ReactNode
  slideLayoutAnimation: () => void
}
const QuestionAccordion: React.FC<IQuestionAccordionProps> = ({ title, children, slideLayoutAnimation }) => {
  const [extended, setExtended] = useState(false)

  /**
   * Handle Click on question section
   */
  function handleOpenCloseState() {
    slideLayoutAnimation()
    setExtended(!extended)
  }

  return (
    <TouchableOpacity onPress={handleOpenCloseState} style={styles.question} testID="faq_btn">
      {/* Outer expandable container */}
      <View>
        {/* question */}
        <View style={styles.question}>
          <LinearGradient
            style={extended ? styles.questionHeaderActive : styles.questionHeader}
            colors={extended ? [globals.styles.colors.colorPink, globals.styles.colors.colorLove] : ['transparent', 'transparent']}>
            <Text
              numberOfLines={extended ? 200 : 2}
              ellipsizeMode="tail"
              style={extended ? styles.textFieldsQuestionActive : styles.textFieldsQuestion}>
              {title}
            </Text>
            <View style={styles.arrow}>
              {extended ? (
                <ChevronUp color={globals.styles.colors.colorWhite} />
              ) : (
                <ChevronDown color={globals.styles.colors.colorGrayDark} />
              )}
            </View>
          </LinearGradient>
        </View>
        {/* Animated answer section */}
        <Animated.View>
          <View>
            {extended ? (
              <TouchableOpacity>
                <View style={styles.answerBody}>{children}</View>
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  )
}

export default QuestionAccordion
