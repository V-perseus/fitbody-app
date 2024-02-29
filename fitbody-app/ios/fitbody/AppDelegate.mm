#import "AppDelegate.h"

// #if defined(EX_DEV_MENU_ENABLED)
// @import EXDevMenu;
// #endif
 
// #if defined(EX_DEV_LAUNCHER_ENABLED)
// #include <EXDevLauncher/EXDevLauncherController.h>
// #import <EXUpdates/EXUpdatesDevLauncherController.h>
// #endif

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <React/RCTAppSetupUtils.h>

#if RCT_NEW_ARCH_ENABLED
#import <React/CoreModulesPlugins.h>
#import <React/RCTCxxBridgeDelegate.h>
#import <React/RCTFabricSurfaceHostingProxyRootView.h>
#import <React/RCTSurfacePresenter.h>
#import <React/RCTSurfacePresenterBridgeAdapter.h>
#import <ReactCommon/RCTTurboModuleManager.h>

#import <react/config/ReactNativeConfig.h>

static NSString *const kRNConcurrentRoot = @"concurrentRoot";

@interface AppDelegate () <RCTCxxBridgeDelegate, RCTTurboModuleManagerDelegate> {
  RCTTurboModuleManager *_turboModuleManager;
  RCTSurfacePresenterBridgeAdapter *_bridgeAdapter;
  std::shared_ptr<const facebook::react::ReactNativeConfig> _reactNativeConfig;
  facebook::react::ContextContainer::Shared _contextContainer;
}
@end
#endif

#import <RNBootSplash.h>
#import "RNNotifications.h"
#import "Orientation.h"
#import <AVFoundation/AVFoundation.h>  // import
#import <RNBackgroundDownloader.h>
#import <GoogleCast/GoogleCast.h>

/* For eas-updates */
@interface AppDelegate () <RCTBridgeDelegate>

@property (nonatomic, strong) NSDictionary *launchOptions;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  
  // Initialize casting before bridge creation
  NSString *receiverAppID = kGCKDefaultMediaReceiverApplicationID; // or @"CC93C89E"
  GCKDiscoveryCriteria *criteria = [[GCKDiscoveryCriteria alloc] initWithApplicationID:receiverAppID];
  GCKCastOptions* options = [[GCKCastOptions alloc] initWithDiscoveryCriteria:criteria];
  // options.startDiscoveryAfterFirstTapOnCastButton = false;
  // options.disableDiscoveryAutostart = true;
  [GCKCastContext setSharedInstanceWithOptions:options];
  
  self.launchOptions = launchOptions;
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  #ifdef DEBUG
    [self initializeReactNativeApp];
  #else
    EXUpdatesAppController *controller = [EXUpdatesAppController sharedInstance];
    controller.delegate = self;
    [controller startAndShowLaunchScreen:self.window];
  #endif
  
  RCTAppSetupPrepareApp(application);
  
//  [super application:application didFinishLaunchingWithOptions:launchOptions];
  return YES;
}
  
- (RCTBridge *)initializeReactNativeApp {

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:self.launchOptions];
  
  #if RCT_NEW_ARCH_ENABLED
    _contextContainer = std::make_shared<facebook::react::ContextContainer const>();
    _reactNativeConfig = std::make_shared<facebook::react::EmptyReactNativeConfig const>();
    _contextContainer->insert("ReactNativeConfig", _reactNativeConfig);
    _bridgeAdapter = [[RCTSurfacePresenterBridgeAdapter alloc] initWithBridge:bridge contextContainer:_contextContainer];
    bridge.surfacePresenter = _bridgeAdapter.surfacePresenter;
  #endif
  
  NSDictionary *initProps = [self prepareInitialProps];
  UIView *rootView = RCTAppSetupDefaultRootView(bridge, @"fitbody", initProps);

  if (@available(iOS 13.0, *)) {
    rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
    rootView.backgroundColor = [UIColor whiteColor];
  }

  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // #if defined(EX_DEV_LAUNCHER_ENABLED)
  //   EXDevLauncherController *controller = [EXDevLauncherController sharedInstance];
  //   controller.updatesInterface = [EXUpdatesDevLauncherController sharedInstance];
  //   [controller startWithWindow:self.window delegate:(id<EXDevLauncherControllerDelegate>)self launchOptions:launchOptions];
  // #else
  //   [self initializeReactNativeApp:launchOptions];
  // #endif
  
  /* Init additional libs */
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView];
  
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryMultiRoute withOptions:AVAudioSessionCategoryOptionDuckOthers	 error:nil];  // allow
  
  [RNNotifications startMonitorNotifications];
  
  // [super application:application didFinishLaunchingWithOptions:launchOptions];

//  return YES;
  return bridge;
}


// - (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge {
//   // If you'd like to export some custom RCTBridgeModules, add them here!
//   return @[];
// }

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feture is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  // Switch this bool to turn on and off the concurrent root
  return true;
}
- (NSDictionary *)prepareInitialProps
{
  NSMutableDictionary *initProps = [NSMutableDictionary new];
#ifdef RCT_NEW_ARCH_ENABLED
  initProps[kRNConcurrentRoot] = @([self concurrentRootEnabled]);
#endif
  return initProps;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  #if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  #else
//    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
    return [[EXUpdatesAppController sharedInstance] launchAssetUrl];
  #endif
}

- (void)appController:(EXUpdatesAppController *)appController didStartWithSuccess:(BOOL)success {
  appController.bridge = [self initializeReactNativeApp];
}

// - (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
//   #ifdef DEBUG
//     #if defined(EX_DEV_LAUNCHER_ENABLED)
//       return [[EXDevLauncherController sharedInstance] sourceUrl];
//     #else
//       return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
//     #endif
//   #else
//     return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//   #endif
// }

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [RNNotifications didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  [RNNotifications didFailToRegisterForRemoteNotificationsWithError:error];
}

// Fix for react-native-orientation-locker not working with iOS 14
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

// Background downloading events
- (void)application:(UIApplication *)application handleEventsForBackgroundURLSession:(NSString *)identifier completionHandler:(void (^)(void))completionHandler
{
  [RNBackgroundDownloader setCompletionHandlerWithIdentifier:identifier completionHandler:completionHandler];
}

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTCxxBridgeDelegate

- (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge {
  _turboModuleManager = [[RCTTurboModuleManager alloc] initWithBridge:bridge
                                                             delegate:self
                                                            jsInvoker:bridge.jsCallInvoker];
  return RCTAppSetupDefaultJsExecutorFactory(bridge, _turboModuleManager);
}

#pragma mark RCTTurboModuleManagerDelegate

- (Class)getModuleClassFromName:(const char *)name {
  return RCTCoreModulesClassProvider(name);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                      jsInvoker:(std::shared_ptr<facebook::react::CallInvoker>)jsInvoker
{
  return nullptr;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                     initParams:
                                                         (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return nullptr;
}

- (id<RCTTurboModule>)getModuleInstanceFromClass:(Class)moduleClass {
  return RCTAppSetupDefaultModuleFromClass(moduleClass);
}

#endif

@end

// Linking API
// - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
//   #if defined(EX_DEV_LAUNCHER_ENABLED)
//     if ([EXDevLauncherController.sharedInstance onDeepLink:url options:options]) {
//       return true;
//     }
//   #endif
//   return [RCTLinkingManager application:application openURL:url options:options];
// }

// Universal Links
// - (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
//   return [RCTLinkingManager application:application
//                    continueUserActivity:userActivity
//                      restorationHandler:restorationHandler];
// }

// @end

// #if defined(EX_DEV_LAUNCHER_ENABLED)
// @implementation AppDelegate (EXDevLauncherControllerDelegate)

// - (void)devLauncherController:(EXDevLauncherController *)developmentClientController
//     didStartWithSuccess:(BOOL)success
// {
//   developmentClientController.appBridge = [self initializeReactNativeApp:[EXDevLauncherController.sharedInstance getLaunchOptions]];
// }

// @end
// #endif
