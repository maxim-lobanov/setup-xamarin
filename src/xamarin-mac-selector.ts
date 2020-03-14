import { ToolSelector } from "./tool-selector";

export class XamarinMacToolSelector extends ToolSelector {
    public get toolName(): string {
        return "Xamarin.Mac";
    }

    protected get basePath(): string {
        return "/Library/Frameworks/Xamarin.Mac.framework";
    }
}
