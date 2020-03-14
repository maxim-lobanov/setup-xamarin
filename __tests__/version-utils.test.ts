import { VersionUtils } from '../src/version-utils';

describe('VersionUtils', () => {
    describe('validVersion', () => {
        it.each([
            ['5', true],
            ['5.2', true],
            ['5.2.3', true],
            ['5.2.3.1', true],
            ['5.2.3.1.6', false],
            ['invalid_version_format', false],
            ['', false]
        ])(`'%s' -> %s`, (version: string, expected: boolean) => {
            expect(VersionUtils.validVersion(version)).toBe(expected);
        });
    });

    describe('normalizeVersion', () => {
        it.each([
            ['5', '5.x.x.x'],
            ['5.2', '5.2.x.x'],
            ['5.2.3', '5.2.3.x'],
            ['5.2.3.1', '5.2.3.1']
        ])(`'%s' -> '%s'`, (version: string, expected: string) => {
            expect(VersionUtils.normalizeVersion(version)).toBe(expected);
        });
    });

    describe('countVersionLength', () => {
        it.each([
            ['5', 1],
            ['5.2', 2],
            ['5.2.3', 3],
            ['5.2.3.1', 4]
        ])(`'%s' -> %d`, (version: string, expected: number) => {
            expect(VersionUtils.countVersionLength(version)).toBe(expected);
        });
    });

    describe('cutVersionLength', () => {
        it.each([
            ['5.2.3.1', 4, '5.2.3.1'],
            ['5.2.3.1', 3, '5.2.3'],
            ['5.2.3.1', 2, '5.2'],
            ['5.2.3.1', 1, '5'],
        ])(`'%s', %d -> '%s'`, (version: string, newLength: number, expected: string) => {
            expect(VersionUtils.cutVersionLength(version, newLength)).toBe(expected);
        });
    });
});