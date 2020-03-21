import compareVersions from "compare-versions";

export class VersionUtils {
    public static isValidVersion = (version: string): boolean => {
        return compareVersions.validate(version);
    }

    public static isLatestVersionKeyword = (version: string): boolean => {
        return version === "latest";
    }

    public static isVersionsEqual = (firstVersion: string, secondVersion: string): boolean => {
        return compareVersions.compare(firstVersion, secondVersion, "=");
    }

    public static sortVersions = (versions: string[]): string[] => {
        return [...versions].sort(compareVersions).reverse();
    }

    public static normalizeVersion = (version: string): string => {
        const versionParts = VersionUtils.splitVersionToParts(version);
        while (versionParts.length < 4) {
            versionParts.push("x");
        }

        return VersionUtils.buildVersionFromParts(versionParts);
    }

    public static countVersionLength = (version: string): number => {
        return VersionUtils.splitVersionToParts(version).length;
    }

    public static cutVersionLength = (version: string, newLength: number): string => {
        const versionParts = VersionUtils.splitVersionToParts(version);
        const newParts = versionParts.slice(0, newLength);
        return VersionUtils.buildVersionFromParts(newParts);
    }

    private static splitVersionToParts = (version: string): string[] => {
        return version.split(".");
    }

    private static buildVersionFromParts = (versionParts: string[]): string => {
        return versionParts.join(".");
    }
}
