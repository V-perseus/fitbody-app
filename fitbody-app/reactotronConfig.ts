// import Reactotron from 'reactotron-react-native'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { reactotronRedux } from 'reactotron-redux'
// import { NativeModules } from 'react-native'
// import parse from 'url-parse'

// declare global {
//   interface Console {
//     tron: typeof Reactotron
//   }
// }

// // Geting device hostname to run on physical devices
// const { hostname } = parse(NativeModules.SourceCode.scriptURL)

// const reactotron = Reactotron.setAsyncStorageHandler?.(AsyncStorage)
//   .configure({
//     name: 'FitBody',
//     host: hostname || 'localhost',
//     port: 9090,
//   }) // controls connection & communication settings
//   .use(reactotronRedux())
//   .useReactNative() // add all built-in react native plugins
//   .connect() // let's connect!

// // horrible, but useful hack.... oh come on, don't look at me like that... it's JavaScript :|
// console.tron = Reactotron

// Reactotron.clear?.()

const reactotron = {}

export default reactotron
