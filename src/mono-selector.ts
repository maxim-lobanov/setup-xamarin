import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';
import { ToolSelector } from './tool-selector';
import compareVersions from 'compare-versions';
import { normalizeVersion, cutVersion } from './version-matcher';

export class MonoToolSelector extends ToolSelector {
    protected readonly versionFormatLength = 3; // version folder contains 3 digits, like '/Versions/6.6.0'

    protected get basePath(): string {
        return '/Library/Frameworks/Mono.framework';
    }

    public get toolName(): string {
        return 'Mono';
    }

    public getAllVersions(): string[] {
        const versionsFolders = super.getAllVersions();

        return versionsFolders.map(version => {
            const versionFile = path.join(this.versionsDirectoryPath, version, 'Version');
            const realVersion = fs.readFileSync(versionFile).toString();
            return realVersion.trim();
        });
    }

    public setVersion(version: string): void {
        version = cutVersion(version, this.versionFormatLength);
        super.setVersion(version);

        const versionDirectory = this.getVersionPath(version);

        core.exportVariable(
            'DYLD_LIBRARY_FALLBACK_PATH',
            [
                `${versionDirectory}/lib`, //
                '/lib',
                '/usr/lib',
                process.env['DYLD_LIBRARY_FALLBACK_PATH']
            ].join(path.delimiter)
        );

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
