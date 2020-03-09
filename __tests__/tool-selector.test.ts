import * as fs from 'fs';
import * as core from '@actions/core';
import { MonoToolSelector } from '../src/mono-selector';
import { XamarinIosToolSelector } from '../src/xamarin-ios-selector';
import { XamarinMacToolSelector } from '../src/xamarin-mac-selector';
import { XamarinAndroidToolSelector } from '../src/xamarin-android-selector';
import { ToolSelector } from '../src/tool-selector';
import * as utils from '../src/utils';

const selectors: { new (): ToolSelector }[] = [
    MonoToolSelector, //
    XamarinIosToolSelector,
    XamarinMacToolSelector,
    XamarinAndroidToolSelector
];

jest.mock('fs');
jest.mock('@actions/core');
jest.mock('../src/utils');

selectors.forEach(selector => {
    describe(selector.name, () => {
        describe('getAllVersions', () => {
            let fsReadDirSpy: jest.SpyInstance;

            beforeEach(() => {
                fsReadDirSpy = jest.spyOn(fs, 'readdirSync');
                fsReadDirSpy.mockImplementation(() => [
                    '13.10',
                    '13.10.0.21',
                    '13.4',
                    '13.4.0.2',
                    '13.6',
                    '13.6.0.12',
                    '13.8',
                    '13.8.3.0',
                    '6_4_0',
                    '6_4_1',
                    '6_6_0',
                    'third_party_folder',
                    'Current',
                    'Latest'
                ]);
            });

            afterEach(() => {
                jest.resetAllMocks();
                jest.clearAllMocks();
            });

            it('versions are filtered correctly', () => {
                const sel = new selector();
                const expectedVersions = [
                    '13.4.0.2', //
                    '13.6.0.12',
                    '13.8.3.0',
                    '13.10.0.21'
                ];
                expect(sel.getAllVersions()).toEqual(expectedVersions);
            });
        });

        describe('setVersion', () => {
            let fsExistsSpy: jest.SpyInstance;
            let fsInvokeCommandSpy: jest.SpyInstance;

            beforeEach(() => {
                fsExistsSpy = jest.spyOn(fs, 'existsSync');
                fsInvokeCommandSpy = jest.spyOn(utils, 'invokeCommandSync');
            });

            afterEach(() => {
                jest.resetAllMocks();
                jest.clearAllMocks();
            });

            it('symlink is created', () => {
                fsExistsSpy.mockImplementation((path: string) => {
                    return !path.endsWith('/Current');
                });
                const sel = new selector();
                sel.setVersion('1.2.3.4');
                expect(fsInvokeCommandSpy).toHaveBeenCalledTimes(1);
                expect(fsInvokeCommandSpy).toHaveBeenCalledWith('ln', expect.any(Array), true);
            });

            it('symlink is recreated', () => {
                fsExistsSpy.mockImplementation(() => true);
                const sel = new selector();
                sel.setVersion('1.2.3.4');
                expect(fsInvokeCommandSpy).toHaveBeenCalledTimes(2);
                expect(fsInvokeCommandSpy).toHaveBeenCalledWith('rm', expect.any(Array), true);
                expect(fsInvokeCommandSpy).toHaveBeenCalledWith('ln', expect.any(Array), true);
            });

            it(`error is thrown if version doesn't exist`, () => {
                fsExistsSpy.mockImplementation(() => false);
                const sel = new selector();
                expect(() => sel.setVersion('1.2.3.4')).toThrow();
                expect(fsInvokeCommandSpy).toHaveBeenCalledTimes(0);
            });
        });
    });
});

describe('MonoToolSelector', () => {
    describe('setVersion', () => {
        let coreExportVariableSpy: jest.SpyInstance;
        let coreAddPathSpy: jest.SpyInstance;
        let fsExistsSpy: jest.SpyInstance;

        beforeEach(() => {
            coreExportVariableSpy = jest.spyOn(core, 'exportVariable');
            coreAddPathSpy = jest.spyOn(core, 'addPath');
            fsExistsSpy = jest.spyOn(fs, 'existsSync');
        });

        afterEach(() => {
            jest.resetAllMocks();
            jest.clearAllMocks();
        });

        it('environment variables are set correctly', () => {
            fsExistsSpy.mockImplementation(() => true);

            const sel = new MonoToolSelector();
            sel.setVersion('1.2.3.4');
            expect(coreExportVariableSpy).toHaveBeenCalledWith(
                'DYLD_LIBRARY_FALLBACK_PATH',
                `/Library/Frameworks/Mono.framework/Versions/1.2.3.4/lib:/lib:/usr/lib:${process.env['DYLD_LIBRARY_FALLBACK_PATH'] ?? ''}`
            );
            expect(coreExportVariableSpy).toHaveBeenCalledWith(
                'PKG_CONFIG_PATH',
                `/Library/Frameworks/Mono.framework/Versions/1.2.3.4/lib/pkgconfig:/Library/Frameworks/Mono.framework/Versions/1.2.3.4/share/pkgconfig:${process.env['PKG_CONFIG_PATH'] ?? ''}`
            );
            expect(coreAddPathSpy).toHaveBeenCalledWith('/Library/Frameworks/Mono.framework/Versions/1.2.3.4/bin');
        });
    });
});
