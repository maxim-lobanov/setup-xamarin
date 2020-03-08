import * as path from 'path';
import { addPath, exportVariable } from '@actions/core';
import { ToolSelector } from "./tool-selector";

export class MonoToolSelector extends ToolSelector {
    protected get basePath(): string {
        return '/Library/Frameworks/Mono.framework';
    }

    public setVersion(version: string): void {
        super.setVersion(version);

        const versionDirectory = this.getVersionPath(version);

        exportVariable('DYLD_LIBRARY_FALLBACK_PATH', [
            `${versionDirectory}/lib`,
            '/lib',
            '/usr/lib',
            process.env['DYLD_LIBRARY_FALLBACK_PATH']
        ].join(path.delimiter));

        exportVariable('PKG_CONFIG_PATH', [
            `${versionDirectory}/lib/pkgconfig`,
            `${versionDirectory}/share/pkgconfig`,
            process.env['PKG_CONFIG_PATH']
        ].join(path.delimiter));

        addPath(`${versionDirectory}/bin`);
    }
}