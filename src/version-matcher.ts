import compareVersions from 'compare-versions';

export const normalizeVersion = (version: string, versionLength: number): string | null => {
    if (!compareVersions.validate(version)) {
        return null;
    }

    const parts = version.split('.');
    while (parts.length < versionLength) {
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

export const matchVersion = (availableVersions: string[], versionSpec: string, versionLength: number): string | null => {
    const normalizedVersionSpec = normalizeVersion(versionSpec, versionLength);
    if (!normalizedVersionSpec) {
        return null;
    }

    const sortedVersions = availableVersions.sort(compareVersions).reverse();
    const version = sortedVersions.find(ver => compareVersions.compare(ver, normalizedVersionSpec, '='));
    if (version) {
        return version;
    }

    return null;
};
