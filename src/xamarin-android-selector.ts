import { ToolSelector } from './tool-selector';

export class XamarinAndroidToolSelector extends ToolSelector {
    public get toolName(): string {
        return 'Xamarin.Android';
    }

    public get versionLength(): number {
        return 4;
    }

    protected get basePath(): string {
        return '/Library/Frameworks/Xamarin.Android.framework';
    }
}
