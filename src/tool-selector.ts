import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';
import compareVersions from 'compare-versions';
import { invokeCommandSync } from './utils';
import { VersionUtils } from './version-utils';

export abstract class ToolSelector {
    public abstract get toolName(): string;

    protected abstract get basePath(): string;

    protected get versionsDirectoryPath(): string {
        return path.join(this.basePath, 'Versions');
    }

    protected getVersionPath(version: string): string {
        return path.join(this.versionsDirectoryPath, version);
    }

    public getAllVersions(): string[] {
        const children = fs.readdirSync(this.versionsDirectoryPath, { encoding: 'utf8', withFileTypes: true });

        // macOS image contains symlinks for full versions, like '13.2' -> '13.2.3.0'
        // filter such symlinks and look for only real versions
        let potentialVersions = children.filter(child => !child.isSymbolicLink() && child.isDirectory()).map(child => child.name);
        potentialVersions = potentialVersions.filter(child => compareVersions.validate(child));

        // sort versions array by descending to make sure that the newest version will be picked up
        return potentialVersions.sort(compareVersions).reverse();
    }

    public findVersion(versionSpec: string): string | null {
        const availableVersions = this.getAllVersions();
        if (availableVersions.length === 0) {
            return null;
        }

        if (versionSpec === 'latest') {
            return availableVersions[0];
        }

        const normalizedVersionSpec = VersionUtils.normalizeVersion(versionSpec);
        core.debug(`Semantic version spec of '${versionSpec}' is '${normalizedVersionSpec}'`);

        return availableVersions.find(ver => compareVersions.compare(ver, normalizedVersionSpec, '=')) ?? null;
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
