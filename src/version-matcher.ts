export const findVersion = (availableVersions: string[], versionSpec: string): string | undefined => {
  return availableVersions.find(ver => ver === versionSpec);
}