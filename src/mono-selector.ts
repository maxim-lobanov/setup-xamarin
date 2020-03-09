import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';
import { ToolSelector } from './tool-selector';
import compareVersions from 'compare-versions';
import { normalizeVersion } from './version-matcher';

export class MonoToolSelector extends ToolSelector {
    public get toolName(): string {
        return 'Mono';
    }

    public get versionLength(): number {
        return 4;
    }

    protected get basePath(): string {
        return '/Library/Frameworks/Mono.framework';
    }

    public getAllVersions(): string[] {
        let potentialVersions = fs.readdirSync(this.versionsDirectoryPath);
        potentialVersions = potentialVersions.map(version => {
            const versionFile = path.join(this.versionsDirectoryPath, version, 'Version');
            return fs.readFileSync(versionFile).toString();
        });
        potentialVersions.forEach(w => console.log(w));
        potentialVersions = potentialVersions.filter(child => compareVersions.validate(child));
        
        // macOS image contains symlinks for full versions, like '13.2' -> '13.2.3.0'
        // filter such symlinks and look for only real versions
        potentialVersions = potentialVersions.filter(child => normalizeVersion(child, this.versionLength) === child);
        return potentialVersions.sort(compareVersions);
    }

    public setVersion(version: string): void {
        super.setVersion(version);

        const versionDirectory = this.getVersionPath(version);

        core.debug('Update DYLD_LIBRARY_FALLBACK_PATH environment variable');
        core.exportVariable(
            'DYLD_LIBRARY_FALLBACK_PATH',
            [
                `${versionDirectory}/lib`, //
                '/lib',
                '/usr/lib',
                process.env['DYLD_LIBRARY_FALLBACK_PATH']
            ].join(path.delimiter)
        );

        core.debug('Update PKG_CONFIG_PATH environment variable');
        core.exportVariable(
            'PKG_CONFIG_PATH',
            [
                `${versionDirectory}/lib/pkgconfig`, //
                `${versionDirectory}/share/pkgconfig`,
                process.env['PKG_CONFIG_PATH']
            ].join(path.delimiter)
        );

        core.debug(`Add '${versionDirectory}/bin' to PATH`);
        core.addPath(`${versionDirectory}/bin`);
    }
}
