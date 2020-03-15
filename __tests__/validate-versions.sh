set -e

MONO_VERSION=$1
XAMARIN_IOS_VERSION=$2
XAMARIN_MAC_VERSION=$3
XAMARIN_ANDROID_VERSION=$4

mono --version | grep "Mono JIT compiler version ${MONO_VERSION}"
printf "Mono "
cat /Library/Frameworks/Mono.framework/Versions/Current/Version | grep $MONO_VERSION

printf "Xamarin.iOS "
cat /Library/Frameworks/Xamarin.iOS.framework/Versions/Current/Version | grep $XAMARIN_IOS_VERSION

printf "Xamarin.Mac "
cat /Library/Frameworks/Xamarin.Mac.framework/Versions/Current/Version | grep $XAMARIN_MAC_VERSION

printf "Xamarin.Android "
cat /Library/Frameworks/Xamarin.Android.framework/Versions/Current/Version | grep $XAMARIN_ANDROID_VERSION
