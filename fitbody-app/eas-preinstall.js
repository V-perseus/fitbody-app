const { exec } = require('child_process')

if (process.env.EAS_BUILD_PLATFORM === 'android') {
  console.log('Running Android scripts')
  // react-native-image-filter-script relies on renderScript which is deprecated
  // so we have to inject this lib into build tools
  exec('sudo apt-get install --yes libncurses5')
} else if (process.env.EAS_BUILD_PLATFORM === 'ios') {
  console.log('Run commands for iOS builds in eas-preinstall.js')
}
