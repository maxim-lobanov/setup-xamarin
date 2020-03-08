import { ToolSelector } from './tool-selector';

export class XamarinIosToolSelector extends ToolSelector {
    protected get basePath(): string {
        return '/Library/Frameworks/Xamarin.iOS.framework';
    }
}
