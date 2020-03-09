import { ToolSelector } from './tool-selector';

export class XamarinIosToolSelector extends ToolSelector {
    public get toolName(): string {
        return 'Xamarin.iOS';
    }

    public get versionLength(): number {
        return 4;
    }

    protected get basePath(): string {
        return '/Library/Frameworks/Xamarin.iOS.framework';
    }
}
