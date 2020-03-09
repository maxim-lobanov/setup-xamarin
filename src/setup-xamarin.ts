import * as core from '@actions/core';
import { MonoToolSelector } from './mono-selector';
import { XamarinIosToolSelector } from './xamarin-ios-selector';
import { XamarinMacToolSelector } from './xamarin-mac-selector';
import { XamarinAndroidToolSelector } from './xamarin-android-selector';
import { ToolSelector } from './tool-selector';
import { countVersionDigits, matchVersion, normalizeVersion } from './version-matcher';
import { EOL } from 'os';

let showVersionMajorMinorWarning = false;

const invokeSelector = (variableName: string, selectorClass: { new (): ToolSelector }): void => {
    const versionSpec = core.getInput(variableName, { required: false });
    if (!versionSpec) {
        return;
    }

    const selector = new selectorClass();
    core.info(`Switch ${selector.toolName} to version ${versionSpec}`);

    const normalizedVersionSpec = normalizeVersion(versionSpec, selector.versionLength);
    if (!normalizedVersionSpec) {
        throw new Error(`Value '${versionSpec}' is not valid version for ${selector.toolName}`);
    }
    core.debug(`Semantic version spec of '${versionSpec}' is '${normalizedVersionSpec}'`);

    const availableVersions = selector.getAllVersions();

    const targetVersion = matchVersion(availableVersions, normalizedVersionSpec, selector.versionLength);
    if (!targetVersion) {
        throw new Error([
            `Could not find ${selector.toolName} version that satisfied version spec: ${versionSpec} (${normalizedVersionSpec})`,
            'Available versions:',
            ...availableVersions.map(ver => `- ${ver}`)
        ].join(EOL));
    }

    selector.setVersion(targetVersion);
    core.info(`${selector.toolName} is set to ${targetVersion}`);

    showVersionMajorMinorWarning = showVersionMajorMinorWarning || countVersionDigits(versionSpec) > 2;
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

        if (showVersionMajorMinorWarning) {
            core.warning(`It is recommended to specify only major and minor versions of tool (like '13' or '13.2').
Hosted VMs contain the latest patch & build version for each major & minor pair. It means that version '13.2.1.4' can be replaced by '13.2.2.0' without any notice and your pipeline will start failing.
            `);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
