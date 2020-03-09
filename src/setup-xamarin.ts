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

    const selector = new selectorClass();
    core.info(`Switch ${selector.toolName} to version ${versionSpec}`);

    const normalizedVersionSpec = normalizeVersion(versionSpec);
    if (!normalizedVersionSpec) {
        throw new Error(`Value '${versionSpec}' is not valid version for ${selector.toolName}`);
    }
    core.debug(`Semantic version spec of '${versionSpec}' is '${normalizedVersionSpec}'`);

    const availableVersions = selector.getAllVersions();

    const targetVersion = matchVersion(availableVersions, normalizedVersionSpec);
    if (!targetVersion) {
        core.info('Available versions:');
        availableVersions.forEach(ver => core.info(`- ${ver}`));
        throw new Error(`Could not find ${selector.toolName} version that satisfied version spec: ${versionSpec} (${normalizedVersionSpec})`);
    }

    selector.setVersion(targetVersion);
    core.info('Switched');
};

async function run() {
    try {
        if (process.platform !== 'darwin') {
            throw new Error(`This task is intended only for macOS system. It can't be run on '${process.platform}' platform`);
        }

        invokeSelector('mono-version', MonoToolSelector);
        invokeSelector('xamarin-ios-version', XamarinIosToolSelector);
        invokeSelector('xamarin-mac-version', XamarinMacToolSelector);
        invokeSelector('xamarin-android-version', XamarinAndroidToolSelector);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
