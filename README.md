# setup-xamarin
This action is intended to switch between pre-installed versions Xamarin & Mono on macos-10.15 image in GitHub Actions.  
The list of available versions can be found in [virtual-environments](https://github.com/actions/virtual-environments/blob/master/images/macos/macos-10.15-Readme.md#mono) repository.
# Available parameters
- `mono-version` (optional) 
- `xamarin-ios-version` (optional)
- `xamarin-mac-version` (optional)
- `xamarin-android-version` (optional)

All fields support the following format: `latest`, `13`, `13.2`, `13.2.1.4`

# Usage
```
name: CI
on: [push]
jobs:
  build:
    name: valid versions (should pass)
    runs-on: macos-latest
    steps:
    - name: Checkout
      uses: actions/checkout@master

    - name: setup-xamarin
      uses: maxim-lobanov/setup-xamarin
      with:
        mono-version: 6.6 # specify version in '<major>.<minor>' format
        xamarin-ios-version: 13 # specify version in '<major>' format
        xamarin-mac-version: latest # specify 'latest' keyword to pick up the latest available version
        xamarin-android-version: 10.1.3.7 # specify full version; it is not recomended option because your pipeline can be broken suddenly in future
```