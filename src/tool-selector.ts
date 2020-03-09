import * as fs from 'fs';
import * as path from 'path';
import * as child from 'child_process';
import * as core from '@actions/core';
import compareVersions from 'compare-versions';
import { normalizeVersion } from './version-matcher';

export abstract class ToolSelector {
    public abstract get toolName(): string;
    public abstract get versionLength(): number;
    protected abstract get basePath(): string;

    protected get versionsDirectoryPath(): string {
        return path.join(this.basePath, 'Versions');
    }

    protected getVersionPath(version: string): string {
        return path.join(this.versionsDirectoryPath, version);
    }

    public getAllVersions(): string[] {
        let potentialVersions = fs.readdirSync(this.versionsDirectoryPath);
        potentialVersions = potentialVersions.filter(child => compareVersions.validate(child));

        // macOS image contains symlinks for full versions, like '13.2' -> '13.2.3.0'
        // filter such symlinks and look for only real versions
        potentialVersions = potentialVersions.filter(child => normalizeVersion(child, this.versionLength) === child);
        return potentialVersions.sort(compareVersions);
    }

    public setVersion(version: string): void {
        const targetVersionDirectory = this.getVersionPath(version);
        if (!fs.existsSync(targetVersionDirectory)) {
            throw new Error(`Invalid version: Directory '${targetVersionDirectory}' doesn't exist`);
        }

        const currentVersionDirectory = path.join(this.versionsDirectoryPath, 'Current');
        core.debug(`Creating symlink '${currentVersionDirectory}' -> '${targetVersionDirectory}'`);
        if (fs.existsSync(currentVersionDirectory)) {
            //fs.unlinkSync(currentVersionDirectory);
            const res = child.spawnSync('/usr/bin/sudo', [`rm -f ${currentVersionDirectory}`], );
            console.log(res.status);
            console.log(res.stdout.toString());
            console.log(res.stderr.toString());
            res.output.forEach(w => console.log(w));

            fs.readdirSync(this.versionsDirectoryPath).forEach(w => console.log(w));
        }

        fs.symlinkSync(currentVersionDirectory, targetVersionDirectory);
    }
}
