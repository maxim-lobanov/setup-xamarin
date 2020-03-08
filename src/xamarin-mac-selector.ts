import { ToolSelector } from './tool-selector';

export class XamarinMacToolSelector extends ToolSelector {
    protected get basePath(): string {
        return '/Library/Frameworks/Xamarin.Mac.framework';
    }
}
