import { XamarinSelector } from "./xamarin-selector";

export class XamarinMacToolSelector extends XamarinSelector {
    public get toolName(): string {
        return "Xamarin.Mac";
    }

    protected get basePath(): string {
        return "/Library/Frameworks/Xamarin.Mac.framework";
    }
}
