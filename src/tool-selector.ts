import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';
import compareVersions from 'compare-versions';
import { normalizeVersion } from './version-matcher';
import { invokeCommandSync } from './utils';

export abstract class ToolSelector {
    protected readonly versionFormatLength: number = 4; // version folder contains 4 digits, like '/Versions/13.2.1.4'

    protected abstract get basePath(): string;

    protected get versionsDirectoryPath(): string {
        return path.join(this.basePath, 'Versions');
    }

    protected getVersionPath(version: string): string {
        return path.join(this.versionsDirectoryPath, version);
    }

    public abstract get toolName(): string;

    public getAllVersions(): string[] {
        const children = fs.readdirSync(this.versionsDirectoryPath, { encoding: 'utf8', withFileTypes: true });

        // macOS image contains symlinks for full versions, like '13.2' -> '13.2.3.0'
        // filter such symlinks and look for only real versions
        let potentialVersions = children.filter(child => !child.isSymbolicLink() && child.isDirectory).map(child => child.name);
        potentialVersions = potentialVersions.filter(child => compareVersions.validate(child));

        // macOS image contains symlinks for full versions, like '13.2' -> '13.2.3.0'
        // filter such symlinks and look for only real versions
        // potentialVersions = potentialVersions.filter(child => normalizeVersion(child, this.versionFormatLength) === child);
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
            invokeCommandSync('rm', ['-f', currentVersionDirectory], true);
        }

        invokeCommandSync('ln', ['-s', targetVersionDirectory, currentVersionDirectory], true);
    }
}
