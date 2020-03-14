import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import { MonoToolSelector } from "../src/mono-selector";
import { XamarinIosToolSelector } from "../src/xamarin-ios-selector";
import { XamarinMacToolSelector } from "../src/xamarin-mac-selector";
import { XamarinAndroidToolSelector } from "../src/xamarin-android-selector";
import * as utils from "../src/utils";
import compareVersions from "compare-versions";
import { ToolSelector } from "../src/tool-selector";

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
    buildFsDirentItem("13.10", { isSymbolicLink: true, isDirectory: true }),
    buildFsDirentItem("13.10.0.21", { isSymbolicLink: false, isDirectory: true }),
    buildFsDirentItem("13.4", { isSymbolicLink: true, isDirectory: false }),
    buildFsDirentItem("13.4.0.2", { isSymbolicLink: false, isDirectory: true }),
    buildFsDirentItem("13.6", { isSymbolicLink: true, isDirectory: false }),
    buildFsDirentItem("13.6.0.12", { isSymbolicLink: false, isDirectory: true }),
    buildFsDirentItem("6_4_0", { isSymbolicLink: false, isDirectory: false }),
    buildFsDirentItem("6_6_0", { isSymbolicLink: true, isDirectory: true }),
    buildFsDirentItem("third_party_folder", { isSymbolicLink: false, isDirectory: true }),
    buildFsDirentItem("Current", { isSymbolicLink: true, isDirectory: true }),
    buildFsDirentItem("Latest", { isSymbolicLink: false, isDirectory: false })
];

const fakeGetVersionsResult = [
    "13.2.0.47",
    "13.4.0.2",
    "13.6.0.12",
    "13.8.2.9",
    "13.8.3.0",
    "13.8.3.2",
    "13.9.1.0",
    "13.10.0.21",
    "14.0.2.1"
].sort(compareVersions).reverse();

describe.each([
    MonoToolSelector,
    XamarinIosToolSelector,
    XamarinMacToolSelector,
    XamarinAndroidToolSelector
])("%s", (selectorClass: { new (): ToolSelector }) => {
    describe("getAllVersions", () => {

        beforeEach(() => {
            jest.spyOn(fs, "readdirSync").mockImplementation(() => fakeReadDirResults);
            jest.spyOn(fs, "readFileSync").mockImplementation(filepath => path.basename(path.dirname(filepath.toString())));
        });

        afterEach(() => {
            jest.resetAllMocks();
            jest.clearAllMocks();
        });

        it("versions are filtered correctly", () => {
            const sel = new selectorClass();
            const expectedVersions = [
                "13.10.0.21",
                "13.6.0.12",
                "13.4.0.2"
            ];
            expect(sel.getAllVersions()).toEqual(expectedVersions);
        });
    });

    describe("findVersion", () => {
        it.each([
            ["latest", "14.0.2.1", "latest is matched"],
            ["14", "14.0.2.1", "one digit is matched"],
            ["13", "13.10.0.21", "one digit is matched and latest version is selected"],
            ["11", null, "one digit is not matched"],
            ["14.0", "14.0.2.1", "two digits are matched"],
            ["13.8", "13.8.3.2", "two digits are matched and latest version is selected"],
            ["13.7", null, "two digits are not matched"],
            ["11.0", null, "two digits are not matched"],
            ["13.2.0", "13.2.0.47", "three digits are matched"],
            ["13.8.3", "13.8.3.2", "three digits are matched and latest version is selected"],
            ["11.0.2", null, "three digits are not matched"],
            ["13.5.4", null, "three digits are not matched"],
            ["13.8.1", null, "three digits are not matched"],
            ["13.9.1.0", "13.9.1.0", "four digits are matched"],
            ["13.10.0.22", null, "four digits are not matched"]
        ] as [string, string | null, string][])("'%s' -> '%s' (%s)", (versionSpec: string, expected: string | null) => {
            const sel = new selectorClass();
            sel.getAllVersions = (): string[] => fakeGetVersionsResult;
            const matchedVersion = sel.findVersion(versionSpec);
            expect(matchedVersion).toBe(expected);
        });
    });

    describe("setVersion", () => {
        let fsExistsSpy: jest.SpyInstance;
        let fsInvokeCommandSpy: jest.SpyInstance;

        beforeEach(() => {
            fsExistsSpy = jest.spyOn(fs, "existsSync");
            fsInvokeCommandSpy = jest.spyOn(utils, "invokeCommandSync");
        });

        afterEach(() => {
            jest.resetAllMocks();
            jest.clearAllMocks();
        });

        it("symlink is created", () => {
            fsExistsSpy.mockImplementation((path: string) => {
                return !path.endsWith("/Current");
            });
            const sel = new selectorClass();
            sel.setVersion("1.2.3.4");
            expect(fsInvokeCommandSpy).toHaveBeenCalledTimes(1);
            expect(fsInvokeCommandSpy).toHaveBeenCalledWith("ln", expect.any(Array), true);
        });

        it("symlink is recreated", () => {
            fsExistsSpy.mockImplementation(() => true);
            const sel = new selectorClass();
            sel.setVersion("1.2.3.4");
            expect(fsInvokeCommandSpy).toHaveBeenCalledTimes(2);
            expect(fsInvokeCommandSpy).toHaveBeenCalledWith("rm", expect.any(Array), true);
            expect(fsInvokeCommandSpy).toHaveBeenCalledWith("ln", expect.any(Array), true);
        });

        it("error is thrown if version doesn't exist", () => {
            fsExistsSpy.mockImplementation(() => false);
            const sel = new selectorClass();
            expect(() => sel.setVersion("1.2.3.4")).toThrow();
            expect(fsInvokeCommandSpy).toHaveBeenCalledTimes(0);
        });
    });
});

describe("MonoToolSelector", () => {
    describe("setVersion", () => {
        let coreExportVariableSpy: jest.SpyInstance;
        let coreAddPathSpy: jest.SpyInstance;
        let fsExistsSpy: jest.SpyInstance;

        beforeEach(() => {
            coreExportVariableSpy = jest.spyOn(core, "exportVariable");
            coreAddPathSpy = jest.spyOn(core, "addPath");
            fsExistsSpy = jest.spyOn(fs, "existsSync");
        });

        afterEach(() => {
            jest.resetAllMocks();
            jest.clearAllMocks();
        });

        it("environment variables are set correctly", () => {
            fsExistsSpy.mockImplementation(() => true);

            const sel = new MonoToolSelector();
            sel.setVersion("1.2.3.4");
            expect(coreExportVariableSpy).toHaveBeenCalledWith("DYLD_LIBRARY_FALLBACK_PATH", expect.any(String));
            expect(coreExportVariableSpy).toHaveBeenCalledWith("PKG_CONFIG_PATH", expect.any(String));
            expect(coreAddPathSpy).toHaveBeenCalledWith("/Library/Frameworks/Mono.framework/Versions/1.2.3/bin");
        });
    });
});
