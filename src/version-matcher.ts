import compareVersions from 'compare-versions';
import { LatestVersionKeyword } from './constants';

export const normalizeVersion = (version: string): string | null => {
    if (version === LatestVersionKeyword) {
        return 'x.x.x.x';
    }

    if (!compareVersions.validate(version)) {
        return null;
    }

    const normalizedLength = 4;

    const parts = version.split('.');
    while (parts.length < normalizedLength) {
        parts.push('x');
    }
    return parts.join('.');
};

export const countVersionDigits = (version: string): number => {
    if (!compareVersions.validate(version)) {
        return 0;
    }

    const parts = version.split('.');
    return parts.length;
};

export const cutVersionLength = (version: string, newLength: number): string => {
    const parts = version.split('.');
    const newParts = parts.slice(0, newLength);
    return newParts.join('.');
};

export const matchVersion = (availableVersions: string[], versionSpec: string): string | null => {
    const normalizedVersionSpec = normalizeVersion(versionSpec);
    if (!normalizedVersionSpec) {
        return null;
    }

    // sort versions array by descending to make sure that the newest version will be picked up
    const sortedVersions = availableVersions.sort(compareVersions).reverse();
    const version = sortedVersions.find(ver => compareVersions.compare(ver, normalizedVersionSpec, '='));
    if (version) {
        return version;
    }

    return null;
};
