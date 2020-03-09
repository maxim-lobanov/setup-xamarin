import * as fs from 'fs';
import * as core from '@actions/core';
import { MonoToolSelector } from './mono-selector';
import { XamarinIosToolSelector } from './xamarin-ios-selector';
import { XamarinMacToolSelector } from './xamarin-mac-selector';
import { XamarinAndroidToolSelector } from './xamarin-android-selector';
import { ToolSelector } from './tool-selector';
import { matchVersion, normalizeVersion } from './version-matcher';

const invokeSelector = (variableName: string, selectorClass: { new (): ToolSelector }): void => {
    const versionSpec = core.getInput(variableName, { required: false });
    if (!versionSpec) {
        return;
    }
    const normalizedVersionSpec = normalizeVersion(versionSpec);
    if (!normalizedVersionSpec) {
        throw new Error('Invalid version');
    }

    const selector = new selectorClass();
    const availableVersions = selector.getAllVersions();

    const targetVersion = matchVersion(availableVersions, normalizedVersionSpec);
    if (!targetVersion) {
        throw new Error('Impossible to find target version');
    }

    selector.setVersion(targetVersion);
};

async function run() {
    try {
        if (process.platform !== 'darwin') {
            throw new Error(`This task is intended only for macOS system. Impossible to run it on '${process.platform}'`);
        }

        const versions = fs.readdirSync('/Library/Frameworks/Xamarin.iOS.framework');
        versions.forEach(w => console.log(w));

        invokeSelector('mono-version', MonoToolSelector);
        invokeSelector('xamarin-ios-version', XamarinIosToolSelector);
        invokeSelector('xamarin-mac-version', XamarinMacToolSelector);
        invokeSelector('xamarin-android-version', XamarinAndroidToolSelector);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
