import * as core from '@actions/core';
import { MonoToolSelector } from './mono-selector';
import { XamarinIosToolSelector } from './xamarin-ios-selector';
import { XamarinMacToolSelector } from './xamarin-mac-selector';
import { XamarinAndroidToolSelector } from './xamarin-android-selector';
import { ToolSelector } from './tool-selector';

type SelectorResult = [ToolSelector, string];
type SelectorClass = { new (): ToolSelector };

const createToolSelector = (variableName: string, selectorClass: SelectorClass): SelectorResult | null => {
  const versionSpec = core.getInput(variableName, { required: false });
  if (!versionSpec) {
    return null;
  }

  return [new selectorClass(), versionSpec];
}

async function run() {
  try {
    const selectors = [
      createToolSelector('mono-version', MonoToolSelector),
      createToolSelector('xamarin-ios-version', XamarinIosToolSelector),
      createToolSelector('xamarin-mac-version', XamarinMacToolSelector),
      createToolSelector('xamarin-android-version', XamarinAndroidToolSelector),
    ].filter((sel): sel is SelectorResult => sel !== null);

    for (const [selector, version] of selectors) {
      const availableVersions = selector.getAllVersions();
      const targetVersion = availableVersions[0];
      selector.setVersion(targetVersion);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
