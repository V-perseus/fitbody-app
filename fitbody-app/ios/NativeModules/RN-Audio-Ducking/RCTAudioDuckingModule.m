//
//  RCTAudioDuckingModule.m
//  fitbody
//
//  Created by Jossendal on 10/21/22.
//

#import "RCTAudioDuckingModule.h"

@interface RCT_EXTERN_MODULE(AudioDucking, NSObject)

RCT_EXTERN_METHOD(duckAudio:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(removeAudioDucking:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

@end
