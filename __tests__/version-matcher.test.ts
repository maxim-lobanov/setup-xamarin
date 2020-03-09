import { matchVersion, normalizeVersion, countVersionDigits, cutVersionLength } from '../src/version-matcher';

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
                const matchedVersion = matchVersion(availableVersions, '14');
                expect(matchedVersion).toBe('14.0.2.1');
            });

            it('is matched and latest version is selected', () => {
                const matchedVersion = matchVersion(availableVersions, '13');
                expect(matchedVersion).toBe('13.10.0.21');
            });

            it('is not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '11');
                expect(matchedVersion).toBeNull();
            });
        });

        describe('two digits', () => {
            it('are matched', () => {
                const matchedVersion = matchVersion(availableVersions, '14.0');
                expect(matchedVersion).toBe('14.0.2.1');
            });

            it('are matched and latest version is selected', () => {
                const matchedVersion = matchVersion(availableVersions, '13.8');
                expect(matchedVersion).toBe('13.8.3.2');
            });

            it('are not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '13.7');
                expect(matchedVersion).toBeNull();
            });

            it('are not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '11.2');
                expect(matchedVersion).toBeNull();
            });
        });

        describe('three digits', () => {
            it('are matched', () => {
                const matchedVersion = matchVersion(availableVersions, '13.2.0');
                expect(matchedVersion).toBe('13.2.0.47');
            });

            it('are matched and latest version is selected', () => {
                const matchedVersion = matchVersion(availableVersions, '13.8.3');
                expect(matchedVersion).toBe('13.8.3.2');
            });

            it('are not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '11.0.2');
                expect(matchedVersion).toBeNull();
            });

            it('are not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '13.5.4');
                expect(matchedVersion).toBeNull();
            });

            it('are not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '13.8.1');
                expect(matchedVersion).toBeNull();
            });
        });

        describe('four digits', () => {
            it('are matched', () => {
                const matchedVersion = matchVersion(availableVersions, '13.9.1.0');
                expect(matchedVersion).toBe('13.9.1.0');
            });

            it('are not matched', () => {
                const matchedVersion = matchVersion(availableVersions, '13.10.0.22');
                expect(matchedVersion).toBeNull();
            });
        });
    });

    describe('normalizeVersion', () => {
        it('one digit', () => {
            expect(normalizeVersion('4')).toBe('4.x.x.x');
        });

        it('two digits', () => {
            expect(normalizeVersion('4.2')).toBe('4.2.x.x');
        });

        it('three digits', () => {
            expect(normalizeVersion('4.2.1')).toBe('4.2.1.x');
        });

        it('four digits', () => {
            expect(normalizeVersion('4.2.1.3')).toBe('4.2.1.3');
        });

        it('already normalized', () => {
            expect(normalizeVersion('4.2.x.x')).toBe('4.2.x.x');
        });

        it('too many digits', () => {
            expect(normalizeVersion('1.2.3.4.5')).toBeNull();
        });

        it('invalid version', () => {
            expect(normalizeVersion('a.b.c.d')).toBeNull();
        });

        it('empty string', () => {
            expect(normalizeVersion('')).toBeNull();
        });
    });

    describe('countVersionDigits', () => {
        it('one digit', () => {
            expect(countVersionDigits('4')).toBe(1);
        });

        it('two digits', () => {
            expect(countVersionDigits('4.2')).toBe(2);
        });

        it('three digits', () => {
            expect(countVersionDigits('4.2.1')).toBe(3);
        });

        it('four digits', () => {
            expect(countVersionDigits('4.2.1.3')).toBe(4);
        });

        it('invalid version', () => {
            expect(countVersionDigits('a.b.c.d')).toBe(0);
        });
    });

    describe('cutVersionLength', () => {
        it('one digit', () => {
            expect(cutVersionLength('4.2.3.1', 1)).toBe('4');
        });

        it('two digits', () => {
            expect(cutVersionLength('4.2.3.1', 2)).toBe('4.2');
        });

        it('three digits', () => {
            expect(cutVersionLength('4.2.3.1', 3)).toBe('4.2.3');
        });

        it('four digits', () => {
            expect(cutVersionLength('4.2.3.1', 4)).toBe('4.2.3.1');
        });
    });
});
