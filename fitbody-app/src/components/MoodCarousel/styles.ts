import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    paddingTop: 26,
  },
  thumbListContainer: {
    paddingHorizontal: 23,
  },
  thumbItem: {
    width: 41,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carousel: {
    marginTop: 29,
    marginBottom: 23,
  },
  mainItem: {
    flex: 1,
    alignSelf: 'center',
    width: 197,
    height: 197,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainItemBackground: {
    width: 197,
    height: 197,
    borderRadius: 98.5,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  mainItemIcon: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
})

export default styles
