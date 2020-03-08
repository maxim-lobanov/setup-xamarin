import * as core from '@actions/core';
import { MonoToolSelector } from './mono-selector';
import { XamarinIosToolSelector } from './xamarin-ios-selector';
import { XamarinMacToolSelector } from './xamarin-mac-selector';
import { XamarinAndroidToolSelector } from './xamarin-android-selector';
import { ToolSelector } from './tool-selector';
import { findVersion } from './version-matcher';

const invokeSelector = (variableName: string, selectorClass: { new (): ToolSelector }): void => {
  const versionSpec = core.getInput(variableName, { required: false });
  if (!versionSpec) {
    return;
  }

  const selector = new selectorClass();
  const availableVersions = selector.getAllVersions();
  const targetVersion = findVersion(availableVersions, versionSpec);
  if (!targetVersion) {
    throw new Error('Impossible to find target version');
  }

  selector.setVersion(targetVersion);
}

async function run() {
  try {
    // platform check

    invokeSelector('mono-version', MonoToolSelector);
    invokeSelector('xamarin-ios-version', XamarinIosToolSelector);
    invokeSelector('xamarin-mac-version', XamarinMacToolSelector);
    invokeSelector('xamarin-android-version', XamarinAndroidToolSelector);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
