import * as path from 'path';
import * as fs from 'fs';
import * as core from '@actions/core';
import {VersionRelativeDir, XamarinIOSDirectoryPath} from './constants';
import semver from 'semver';

async function run() {
  try {
    const xamarinVersionsDir = path.join(XamarinIOSDirectoryPath, VersionRelativeDir);
    const children: string[] = fs.readdirSync(xamarinVersionsDir);
    for (const child of children) {
        const valid = semver.valid(child) !== null;
        console.log(`${child}: ${valid}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
