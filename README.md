# setup-xamarin
This action is intended to switch between pre-installed versions of Xamarin and Mono for macOS images in GitHub Actions.  

# Available parameters
| Argument                | Required | Description                                               | Available versions |
|-------------------------|----------|-----------------------------------------------------------|--------------------|
| mono-version            | False    | Specify the version of Mono to switch                     | [Link](https://github.com/actions/virtual-environments/blob/master/images/macos/macos-10.15-Readme.md#mono) |
| xamarin-ios-version     | False    | Specify the version of Xamarin.iOS to switch              | [Link](https://github.com/actions/virtual-environments/blob/master/images/macos/macos-10.15-Readme.md#xamarinios) |
| xamarin-mac-version     | False    | Specify the version of Xamarin.Mac to switch              | [Link](https://github.com/actions/virtual-environments/blob/master/images/macos/macos-10.15-Readme.md#xamarinmac) |
| xamarin-android-version | False    | Specify the version of Xamarin.Android to switch          | [Link](https://github.com/actions/virtual-environments/blob/master/images/macos/macos-10.15-Readme.md#xamarinandroid) |
| xcode-version           | False    | Specify the Xcode to use with Xamarin.iOS and Xamarin.Mac | [Link](https://github.com/actions/virtual-environments/blob/master/images/macos/macos-10.15-Readme.md#xcode) |

- `mono-version`, `xamarin-ios-version`, `xamarin-mac-version`, `xamarin-android-version` parameters support the following format: `latest`, `13`, `13.2`, `13.2.1.4`  
- `xcode-version` parameter supports the following format: `latest`, `11.4`, `11.x`, `11.2.1`  
**Note:** If you need to switch Xcode only without Xamarin - please consider using [maxim-lobanov/setup-xcode](https://github.com/maxim-lobanov/setup-xcode) actions since it provides more comfortable way to specify Xcode.

# Usage
```
name: CI
on: [push]
jobs:
  build:
    name: Setup Xamarin and Mono versions
    runs-on: macos-latest
    steps:
    - name: setup-xamarin
      uses: maxim-lobanov/setup-xamarin@v1
      with:
        mono-version: 6.6 # specify version in '<major>.<minor>' format
        xamarin-ios-version: 13 # specify version in '<major>' format
        xamarin-mac-version: latest # specify 'latest' keyword to pick up the latest available version
        xamarin-android-version: 10.1.3.7 # specify full version; it is not recomended option because your pipeline can be broken suddenly in future
        xcode-version: 11.x # set the latest available Xcode 11
```

# License
The scripts and documentation in this project are released under the [MIT License](LICENSE)
