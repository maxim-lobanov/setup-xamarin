import * as path from 'path';
import * as fs from 'fs';
import * as core from '@actions/core';
import {VersionRelativeDir, XamarinIOSDirectoryPath} from './constants';

async function run() {
  try {
    const xamarinVersionsDir = path.join(XamarinIOSDirectoryPath, VersionRelativeDir);
    const children: string[] = fs.readdirSync(xamarinVersionsDir);
    for (const child of children) {
      console.log(child);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
