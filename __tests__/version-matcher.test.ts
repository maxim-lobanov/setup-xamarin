import { matchVersion } from '../src/version-matcher';

describe('Version matcher tests', () => {
    const availableVersions = [
        '2.3.7',
        '2.3.8',
        '3.2.0'
    ];
    const result = matchVersion(availableVersions, '2.3.x');
    expect(result).toBe('2.3.8');
});