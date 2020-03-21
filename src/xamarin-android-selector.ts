import { XamarinSelector } from "./xamarin-selector";

export class XamarinAndroidToolSelector extends XamarinSelector {
    public get toolName(): string {
        return "Xamarin.Android";
    }

    protected get basePath(): string {
        return "/Library/Frameworks/Xamarin.Android.framework";
    }
}
