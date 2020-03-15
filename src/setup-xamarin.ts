import * as core from "@actions/core";
import { MonoToolSelector } from "./mono-selector";
import { XamarinIosToolSelector } from "./xamarin-ios-selector";
import { XamarinMacToolSelector } from "./xamarin-mac-selector";
import { XamarinAndroidToolSelector } from "./xamarin-android-selector";
import { EOL } from "os";
import { VersionUtils } from "./version-utils";
import { ToolSelector } from "./tool-selector";

let showVersionMajorMinorWarning = false;

const invokeSelector = (variableName: string, toolSelector: { new (): ToolSelector }): void => {
    const versionSpec = core.getInput(variableName, { required: false });
    if (!versionSpec) {
        return;
    }

    const selector = new toolSelector();

    if (!VersionUtils.isLatestVersionKeyword(versionSpec) && !VersionUtils.isValidVersion(versionSpec)) {
        throw new Error(`Value '${versionSpec}' is not valid version for ${selector.toolName}`);
    }

    core.info(`Switching ${selector.toolName} to version '${versionSpec}'...`);

    const targetVersion = selector.findVersion(versionSpec);
    if (!targetVersion) {
        throw new Error(
            [
                `Could not find ${selector.toolName} version that satisfied version spec: ${versionSpec}`,
                "Available versions:",
                ...selector.getAllVersions().map(ver => `- ${ver}`)
            ].join(EOL)
        );
    }

    core.debug(`${selector.toolName} ${targetVersion} will be set`);
    selector.setVersion(targetVersion);
    core.info(`${selector.toolName} is set to '${targetVersion}'`);

    showVersionMajorMinorWarning = showVersionMajorMinorWarning || VersionUtils.countVersionLength(versionSpec) > 2;
};

const run = (): void => {
    try {
        if (process.platform !== "darwin") {
            throw new Error(`This task is intended only for macOS platform. It can't be run on '${process.platform}' platform`);
        }

        invokeSelector("mono-version", MonoToolSelector);
        invokeSelector("xamarin-ios-version", XamarinIosToolSelector);
        invokeSelector("xamarin-mac-version", XamarinMacToolSelector);
        invokeSelector("xamarin-android-version", XamarinAndroidToolSelector);

        if (showVersionMajorMinorWarning) {
            core.warning(
                [
                    "It is recommended to specify only major and minor versions of tool (like '13' or '13.2').",
                    "Hosted VMs contain the latest patch & build version for each major & minor pair.",
                    "It means that version '13.2.1.4' can be replaced by '13.2.2.0' without any notice and your pipeline will start failing."
                ].join(" ")
            );
        }
    } catch (error) {
        core.setFailed(error.message);
    }
};

run();
