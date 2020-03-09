import * as path from 'path';
import * as core from '@actions/core';
import { ToolSelector } from './tool-selector';

export class MonoToolSelector extends ToolSelector {
    public get toolName(): string {
        return 'Mono';
    }

    public get versionLength(): number {
        return 3;
    }

    protected get basePath(): string {
        return '/Library/Frameworks/Mono.framework';
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
