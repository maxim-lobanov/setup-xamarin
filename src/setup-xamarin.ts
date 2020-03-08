import * as core from '@actions/core';
import { MonoToolSelector } from './mono-selector';
import { XamarinIosToolSelector } from './xamarin-ios-selector';
import { XamarinMacToolSelector } from './xamarin-mac-selector';
import { XamarinAndroidToolSelector } from './xamarin-android-selector';
import { ToolSelector } from './tool-selector';

const applySelector = (variableName: string, selectorClass: { new (): ToolSelector }): void => {
  const versionSpec = core.getInput(variableName, { required: false });
  if (!versionSpec) {
    return;
  }

  const selector = new selectorClass();
  const availableVersions = selector.getAllVersions();
  const targetVersion = availableVersions[0];
  selector.setVersion(targetVersion);
}

async function run() {
  try {
    applySelector('mono-version', MonoToolSelector);
    applySelector('xamarin-ios-version', XamarinIosToolSelector);
    applySelector('xamarin-mac-version', XamarinMacToolSelector);
    applySelector('xamarin-android-version', XamarinAndroidToolSelector);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
