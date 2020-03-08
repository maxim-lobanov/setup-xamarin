import {ToolSelector} from './tool-selector';

export class XamarinAndroidToolSelector extends ToolSelector {
    protected get basePath(): string {
        return '/Library/Frameworks/Xamarin.Android.framework';
    }
}
