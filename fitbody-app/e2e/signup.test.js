describe('Auth Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true, permissions: { notifications: 'YES', userTracking: 'YES' } })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  afterAll(async () => {
    // await RNBackgroundDownloader.download().stop()
  })

  it('should have welcome screen', async () => {
    // we need waitFor because technically the first screen to load is the splash screen gif component
    await waitFor(element(by.id('loginbutton')))
      .toBeVisible()
      .withTimeout(4000)
    // waitFor needs to be expected because if waitFor times out
    // it does not throw, it just continues the test
    await expect(element(by.id('loginbutton'))).toBeVisible()

    await waitFor(element(by.id('signupbutton')))
      .toBeVisible()
      .withTimeout(4000)
    await expect(element(by.id('signupbutton'))).toBeVisible()
  })

  it('should show login screen after tap', async () => {
    const loginbutton = await element(by.id('loginbutton'))
    await waitFor(loginbutton).toBeVisible().withTimeout(5000)
    await expect(loginbutton).toBeVisible()
    await loginbutton.tap()
    await expect(element(by.text('LOG IN'))).toBeVisible()
    await element(by.id('login_email')).typeText('kevin@few.io')
    await waitFor(element(by.text('login_password')))
      .toBeVisible()
      .whileElement(by.id('login_scrollview'))
      .scrollTo('bottom')
    await element(by.id('login_password')).typeText('Password1')

    // await device.disableSynchronization()
    // do not synchronize with app downloads as they are a long running background task
    await device.setURLBlacklist(['.*/workouts/download/.*'])

    await element(by.id('login_button')).tap()
    // await waitFor(element(by.id('program_name')))
    await waitFor(element(by.id('category_scrollview')))
      .toBeVisible()
      .withTimeout(8000)

    // await device.enableSynchronization()
  })

  it('should show signup screen after tap', async () => {
    const signupbutton = await element(by.id('signupbutton'))
    await waitFor(signupbutton).toBeVisible().withTimeout(5000)
    await expect(signupbutton).toBeVisible()
    await signupbutton.tap()
    await expect(element(by.text('SIGN UP'))).toBeVisible()
  })
})
