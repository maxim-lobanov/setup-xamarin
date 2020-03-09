import { matchVersion, normalizeVersion } from '../src/version-matcher';

describe('Version matcher tests', () => {
    describe('matchVersion', () => {
        const availableVersions = [
            '13.2.0.47', //
            '13.4.0.2',
            '13.6.0.12',
            '13.8.2.9',
            '13.8.3.0',
            '13.8.3.2',
            '13.9.1.0',
            '13.10.0.21',
            '14.0.2.1'
        ];

        describe('one digit', () => {
            it('is matched', () => {
                const matchedVersion = matchVersion(availableVersions, '14', 4);
                expect(matchedVersion).toBe('14.0.2.1');
            });

            it('is matched and latest version is selected', () => {
                const matchedVersion = matchVersion(availableVersions, '13', 4);
                expect(matchedVersion).toBe('13.10.0.21');
            });

            it('is not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '11', 4);
                expect(matchedVersion).toBeNull();
            });
        });

        describe('two digits', () => {
            it('are matched', () => {
                const matchedVersion = matchVersion(availableVersions, '14.0', 4);
                expect(matchedVersion).toBe('14.0.2.1');
            });

            it('are matched and latest version is selected', () => {
                const matchedVersion = matchVersion(availableVersions, '13.8', 4);
                expect(matchedVersion).toBe('13.8.3.2');
            });

            it('are not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '13.7', 4);
                expect(matchedVersion).toBeNull();
            });

            it('are not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '11.2', 4);
                expect(matchedVersion).toBeNull();
            });
        });

        describe('three digits', () => {
            it('are matched', () => {
                const matchedVersion = matchVersion(availableVersions, '13.2.0', 4);
                expect(matchedVersion).toBe('13.2.0.47');
            });

            it('are matched and latest version is selected', () => {
                const matchedVersion = matchVersion(availableVersions, '13.8.3', 4);
                expect(matchedVersion).toBe('13.8.3.2');
            });

            it('are not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '11.0.2', 4);
                expect(matchedVersion).toBeNull();
            });

            it('are not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '13.5.4', 4);
                expect(matchedVersion).toBeNull();
            });

            it('are not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '13.8.1', 4);
                expect(matchedVersion).toBeNull();
            });
        });

        describe('four digits', () => {
            it('are matched', () => {
                const matchedVersion = matchVersion(availableVersions, '13.9.1.0', 4);
                expect(matchedVersion).toBe('13.9.1.0');
            });

            it('are not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '13.10.0.22', 4);
                expect(matchedVersion).toBeNull();
            });
        });
    });

    describe('normalizeVersion', () => {
        it('one digit', () => {
            expect(normalizeVersion('4', 4)).toBe('4.x.x.x');
        });

        it('two digits', () => {
            expect(normalizeVersion('4.2', 4)).toBe('4.2.x.x');
        });

        it('three digits', () => {
            expect(normalizeVersion('4.2.1', 4)).toBe('4.2.1.x');
        });

        it('four digits', () => {
            expect(normalizeVersion('4.2.1.3', 4)).toBe('4.2.1.3');
        });

        it('already normalized', () => {
            expect(normalizeVersion('4.2.x.x', 4)).toBe('4.2.x.x');
        });

        it('too many digits', () => {
            expect(normalizeVersion('1.2.3.4.5', 4)).toBeNull();
        });

        it('invalid version', () => {
            expect(normalizeVersion('a.b.c.d', 4)).toBeNull();
        });

        it('empty string', () => {
            expect(normalizeVersion('', 4)).toBeNull();
        });
    });
});
