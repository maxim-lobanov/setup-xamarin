import { VersionUtils } from "../src/version-utils";

describe("VersionUtils", () => {
    describe("validVersion", () => {
        it.each([
            ["5", true],
            ["5.2", true],
            ["5.2.3", true],
            ["5.2.3.1", true],
            ["5.2.3.1.6", false],
            ["invalid_version_format", false],
            ["", false]
        ])("'%s' -> %s", (version: string, expected: boolean) => {
            expect(VersionUtils.isValidVersion(version)).toBe(expected);
        });
    });

    it("sortVersions", () => {
        const actual = VersionUtils.sortVersions([
            "11.2",
            "11.4",
            "10.1",
            "11.2.1",
            "10.2"
        ]);
        expect(actual).toEqual([
            "11.4",
            "11.2.1",
            "11.2",
            "10.2",
            "10.1"
        ]);
    });

    describe("isVersionsEqual", () => {
        it.each([
            ["11.2", "11.2", true],
            ["11.x", "11.2", true],
            ["11.x.x", "11.2", true],
            ["11.x.x", "11.2.1", true],
            ["11", "11.2", false],
            ["11", "11.2.1", false],
            ["10", "11.2", false]
        ])("'%s', '%s' -> %s", (firstVersion: string, secondVersion: string, expected: boolean) => {
            const actual = VersionUtils.isVersionsEqual(firstVersion, secondVersion);
            expect(actual).toBe(expected);
        });
    });

    describe("normalizeVersion", () => {
        it.each([
            ["5", "5.x.x.x"],
            ["5.2", "5.2.x.x"],
            ["5.2.3", "5.2.3.x"],
            ["5.2.3.1", "5.2.3.1"]
        ])("'%s' -> '%s'", (version: string, expected: string) => {
            expect(VersionUtils.normalizeVersion(version)).toBe(expected);
        });
    });

    describe("countVersionLength", () => {
        it.each([
            ["5", 1],
            ["5.2", 2],
            ["5.2.3", 3],
            ["5.2.3.1", 4]
        ])("'%s' -> %d", (version: string, expected: number) => {
            expect(VersionUtils.countVersionLength(version)).toBe(expected);
        });
    });

    describe("cutVersionLength", () => {
        it.each([
            ["5.2.3.1", 4, "5.2.3.1"],
            ["5.2.3.1", 3, "5.2.3"],
            ["5.2.3.1", 2, "5.2"],
            ["5.2.3.1", 1, "5"]
        ])("'%s', %d -> '%s'", (version: string, newLength: number, expected: string) => {
            expect(VersionUtils.cutVersionLength(version, newLength)).toBe(expected);
        });
    });
});
