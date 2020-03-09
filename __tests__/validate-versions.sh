set -e

MONO_VERSION=$1
XAMARIN_IOS_VERSION=$2
XAMARIN_MAC_VERSION=$3
XAMARIN_ANDROID_VERSION=$4

mono --version | grep "Mono JIT compiler version ${MONO_VERSION}"
cat /Library/Frameworks/Mono.framework/Versions/Current/Version | grep $MONO_VERSION
cat /Library/Frameworks/Xamarin.iOS.framework/Versions/Current/Version | grep $XAMARIN_IOS_VERSION
cat /Library/Frameworks/Xamarin.Mac.framework/Versions/Current/Version | grep $XAMARIN_MAC_VERSION
cat /Library/Frameworks/Xamarin.Android.framework/Versions/Current/Version | grep $XAMARIN_ANDROID_VERSION
