import * as fs from 'fs';
import * as path from 'path';
import compareVersions from 'compare-versions';

export abstract class ToolSelector {
    protected abstract get basePath(): string;

    protected get versionsDirectoryPath(): string {
        return path.join(this.basePath, 'Versions');
    }

    protected getVersionPath(version: string): string {
        return path.join(this.versionsDirectoryPath, version);
    }

    public getAllVersions(): string[] {
        const potentialVersions = fs.readdirSync(this.versionsDirectoryPath);
        return potentialVersions.filter(child => compareVersions.validate(child));
    }

    public setVersion(version: string): void {
        const versionDirectory = this.getVersionPath(version);
        if (!fs.existsSync(versionDirectory)) {
            throw new Error("version directory doesn't exist");
        }

        const currentDirectory = path.join(this.versionsDirectoryPath, "Current");
        if (fs.existsSync(currentDirectory)) {
            fs.unlinkSync(currentDirectory);
        }

        fs.symlinkSync(currentDirectory, versionDirectory);
    }
}