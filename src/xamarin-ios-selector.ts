import { XamarinSelector } from "./xamarin-selector";

export class XamarinIosToolSelector extends XamarinSelector {
    public get toolName(): string {
        return "Xamarin.iOS";
    }

    protected get basePath(): string {
        return "/Library/Frameworks/Xamarin.iOS.framework";
    }
}
