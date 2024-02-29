fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios nuke

```sh
[bundle exec] fastlane ios nuke
```



### ios register

```sh
[bundle exec] fastlane ios register
```



### ios initit

```sh
[bundle exec] fastlane ios initit
```



### ios generate_new_certificates

```sh
[bundle exec] fastlane ios generate_new_certificates
```

Generate new certificates

### ios increment_build_numbers

```sh
[bundle exec] fastlane ios increment_build_numbers
```

Increment build numbers in multiple plists

### ios expo_build_development

```sh
[bundle exec] fastlane ios expo_build_development
```

Create new internal QA build with eas and push to eas servers

### ios expo_build

```sh
[bundle exec] fastlane ios expo_build
```

Create new build with eas and push to eas servers

### ios expo_submit

```sh
[bundle exec] fastlane ios expo_submit
```

Submit the latest ios build on eas servers to app store

### ios expo_build_preview

```sh
[bundle exec] fastlane ios expo_build_preview
```

Create new preview staging build with eas and push to eas servers

### ios expo_submit_preview

```sh
[bundle exec] fastlane ios expo_submit_preview
```

Submit the latest preview ios build on eas servers to app store

### ios slack_it

```sh
[bundle exec] fastlane ios slack_it
```



----


## Android

### android build

```sh
[bundle exec] fastlane android build
```

Build the Android application.

### android expo_build_internal

```sh
[bundle exec] fastlane android expo_build_internal
```

Create new internal QA for easy distribution build with eas and push to eas servers

### android expo_build_preview

```sh
[bundle exec] fastlane android expo_build_preview
```

Create new preview staging build with eas and push to eas servers

### android expo_submit_preview

```sh
[bundle exec] fastlane android expo_submit_preview
```

Submit the latest android build on eas servers to internal track

### android expo_build

```sh
[bundle exec] fastlane android expo_build
```

Create new build with eas and push to eas servers

### android expo_submit

```sh
[bundle exec] fastlane android expo_submit
```

Submit the latest android build on eas servers to app store

### android store

```sh
[bundle exec] fastlane android store
```



### android alpha

```sh
[bundle exec] fastlane android alpha
```



### android retry

```sh
[bundle exec] fastlane android retry
```



### android internal

```sh
[bundle exec] fastlane android internal
```



### android promote

```sh
[bundle exec] fastlane android promote
```



### android slack_it

```sh
[bundle exec] fastlane android slack_it
```



----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
