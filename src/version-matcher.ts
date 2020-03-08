export const matchVersion = (availableVersions: string[], versionSpec: string): string | undefined => {
    return availableVersions.find(ver => ver === versionSpec);
};
