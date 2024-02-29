Building, deploying, and updates

Expo dashboard
https://expo.dev/accounts/fitbodydev/projects/fitbody

Whenever changing native code
https://docs.expo.dev/eas-update/bare-react-native/#app-config

1: Update versions in xCode and build.gradle if necessary
2: If you've changed any native code or are releasing a new version, increment runtimeVersion in app.json
3: Make sure build numbers are later then the current build numbers in the stores
4: Run staging builds
  a: `fastlane ios expo_build_preview`
  b: `fastlane android expo_build_preview`
5: When build complete push to staging tracks on testflight and google play internal track
  a: `fastlane ios expo_submit_preview`
  b: `fastlane android expo_submit_preview`
6: Technically from here, iOS can be promoted to production but for android we need to submit the store build variant. So for completion sake:
  a: `fastlane ios expo_build`
  a: `fastlane android expo_build`
7: When build complete push to testflight and google play alpha track
8: When both approved, test again, then production release can be started from appstoreconnect and google play console
