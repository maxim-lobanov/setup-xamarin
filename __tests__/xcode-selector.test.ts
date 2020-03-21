import * as fs from "fs";
import * as core from "@actions/core";
import * as utils from "../src/utils";
import { XcodeSelector } from "../src/xcode-selector";
import { VersionUtils } from "../src/version-utils";

jest.mock("fs");
jest.mock("@actions/core");
jest.mock("../src/utils");

const buildFsDirentItem = (name: string, opt: { isSymbolicLink: boolean; isDirectory: boolean }): fs.Dirent => {
    return {
        name,
        isSymbolicLink: () => opt.isSymbolicLink,
        isDirectory: () => opt.isDirectory
    } as fs.Dirent;
};

const fakeReadDirResults = [
    buildFsDirentItem("Xcode.app", { isSymbolicLink: true, isDirectory: false }),
    buildFsDirentItem("Xcode.app", { isSymbolicLink: false, isDirectory: true }),
    buildFsDirentItem("Xcode_11.1.app", { isSymbolicLink: false, isDirectory: true }),
    buildFsDirentItem("Xcode_11.1_beta.app", { isSymbolicLink: true, isDirectory: false }),
    buildFsDirentItem("Xcode_11.2.1.app", { isSymbolicLink: false, isDirectory: true }),
    buildFsDirentItem("Xcode_11.4.app", { isSymbolicLink: true, isDirectory: false }),
    buildFsDirentItem("Xcode_11.4_beta.app", { isSymbolicLink: false, isDirectory: true }),
    buildFsDirentItem("Xcode_11.app", { isSymbolicLink: false, isDirectory: true }),
    buildFsDirentItem("third_party_folder", { isSymbolicLink: false, isDirectory: true }),
];

const fakeGetVersionsResult = VersionUtils.sortVersions([
    "10.3",
    "11",
    "11.2",
    "11.2.1",
    "11.4"
]);

describe("XcodeSelector", () => {
    describe("xcodeRegex", () => {
        it.each([
            ["Xcode_11.app", "11"],
            ["Xcode_11.2.app", "11.2"],
            ["Xcode_11.2.1.app", "11.2.1"],
            ["Xcode.app", null],
            ["Xcode_11.2", null],
            ["Xcode.11.2.app", null]
        ])("'%s' -> '%s'", (input: string, expected: string | null) => {
            // test private method
            const actual = new XcodeSelector()["parseXcodeVersionFromFilename"](input);
            expect(actual).toBe(expected);
        });

    });

    describe("getAllVersions", () => {
        beforeEach(() => {
            jest.spyOn(fs, "readdirSync").mockImplementation(() => fakeReadDirResults);
        });

        afterEach(() => {
            jest.resetAllMocks();
            jest.clearAllMocks();
        });

        it("versions are filtered correctly", () => {
            const sel = new XcodeSelector();
            const expectedVersions = [
                "11.4",
                "11.2.1",
                "11.1",
                "11"
            ];
            expect(sel.getAllVersions()).toEqual(expectedVersions);
        });
    });

    describe("findVersion", () => {
        it.each([
            ["latest", "11.4", "latest is matched"],
            ["11", "11", "one digit is matched"],
            ["11.x", "11.4", "one digit is matched and latest version is selected"],
            ["10", null, "one digit is not matched"],
            ["11.2", "11.2", "two digits are matched"],
            ["11.2.x", "11.2.1", "two digits are matched and latest version is selected"],
            ["11.4.x", "11.4", "the latest patch version is matched"],
            ["10.4", null, "two digits are not matched"],
            ["9.x", null, "two digits are not matched"],
            ["11.5.x", null, "three digits are not matched"],
            ["11.2.1", "11.2.1", "full version is matched"]
        ] as [string, string | null, string][])("'%s' -> '%s' (%s)", (versionSpec: string, expected: string | null) => {
            const sel = new XcodeSelector();
            sel.getAllVersions = (): string[] => fakeGetVersionsResult;
            const matchedVersion = sel.findVersion(versionSpec);
            expect(matchedVersion).toBe(expected);
        });
    });

    describe("setVersion", () => {
        let coreExportVariableSpy: jest.SpyInstance;
        let fsExistsSpy: jest.SpyInstance;
        let fsInvokeCommandSpy: jest.SpyInstance;

        beforeEach(() => {
            coreExportVariableSpy = jest.spyOn(core, "exportVariable");
            fsExistsSpy = jest.spyOn(fs, "existsSync");
            fsInvokeCommandSpy = jest.spyOn(utils, "invokeCommandSync");
        });

        afterEach(() => {
            jest.resetAllMocks();
            jest.clearAllMocks();
        });

        it("works correctly", () => {
            fsExistsSpy.mockImplementation(() => true);
            const sel = new XcodeSelector();
            sel.setVersion("11.4");
            expect(fsInvokeCommandSpy).toHaveBeenCalledWith("xcode-select", expect.any(Array), expect.any(Object));
            expect(coreExportVariableSpy).toHaveBeenCalledWith("MD_APPLE_SDK_ROOT", expect.any(String));
        });

        it("error is thrown if version doesn't exist", () => {
            fsExistsSpy.mockImplementation(() => false);
            const sel = new XcodeSelector();
            expect(() => sel.setVersion("11.4")).toThrow();
            expect(fsInvokeCommandSpy).toHaveBeenCalledTimes(0);
            expect(coreExportVariableSpy).toHaveBeenCalledTimes(0);
        });
    });
});