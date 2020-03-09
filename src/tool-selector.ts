import * as fs from 'fs';
import * as path from 'path';
import compareVersions from 'compare-versions';
import { normalizeVersion } from './version-matcher';

export abstract class ToolSelector {
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
        potentialVersions = potentialVersions.filter(child => normalizeVersion(child) === child);
        return potentialVersions.sort(compareVersions);
    }

    public setVersion(version: string): void {
        const versionDirectory = this.getVersionPath(version);
        if (!fs.existsSync(versionDirectory)) {
            throw new Error("version directory doesn't exist");
        }

        const currentDirectory = path.join(this.versionsDirectoryPath, 'Current');
        if (fs.existsSync(currentDirectory)) {
            fs.unlinkSync(currentDirectory);
        }

        fs.symlinkSync(currentDirectory, versionDirectory);
    }
}
