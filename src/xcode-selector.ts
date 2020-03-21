import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import { VersionUtils } from "./version-utils";
import { ToolSelector } from "./tool-selector";
import * as utils from "./utils";

export class XcodeSelector implements ToolSelector {
    private readonly xcodeDirectoryPath = "/Applications";
    private readonly xcodeFilenameRegex = /Xcode_([\d.]+)(_beta)?\.app/;

    private parseXcodeVersionFromFilename(filename: string): string | null {
        const match = filename.match(this.xcodeFilenameRegex);
        if (!match || match.length < 2) {
            return null;
        }

        return match[1];
    }

    public get toolName(): string {
        return "Xcode";
    }

    protected getVersionPath(version: string): string {
        return path.join(this.xcodeDirectoryPath, `Xcode_${version}.app`);
    }

    public getAllVersions(): string[] {
        const children = fs.readdirSync(this.xcodeDirectoryPath, { encoding: "utf8", withFileTypes: true });

        let potentialVersions = children.filter(child => !child.isSymbolicLink() && child.isDirectory()).map(child => child.name);
        potentialVersions = potentialVersions.map(child => this.parseXcodeVersionFromFilename(child)).filter((child): child is string => !!child);

        const stableVersions = potentialVersions.filter(ver => VersionUtils.isValidVersion(ver));
        const betaVersions = potentialVersions.filter(ver => ver.endsWith("_beta")).map(ver => {
            const verWithoutBeta = ver.substr(0, ver.length - 5);
            return children.find(child => child.isSymbolicLink() && this.parseXcodeVersionFromFilename(child.name) === verWithoutBeta)?.name;
        }).filter(((ver): ver is string => !!ver && VersionUtils.isValidVersion(ver)));

        // sort versions array by descending to make sure that the newest version will be picked up
        return VersionUtils.sortVersions([...stableVersions, ...betaVersions]);
    }

    findVersion(versionSpec: string): string | null {
        const availableVersions = this.getAllVersions();
        if (availableVersions.length === 0) {
            return null;
        }

        if (VersionUtils.isLatestVersionKeyword(versionSpec)) {
            return availableVersions[0];
        }

        return availableVersions.find(ver => VersionUtils.isVersionsEqual(ver, versionSpec)) ?? null;
    }

    setVersion(version: string): void {
        const targetVersionDirectory = this.getVersionPath(version);
        if (!fs.existsSync(targetVersionDirectory)) {
            throw new Error(`Invalid version: Directory '${targetVersionDirectory}' doesn't exist`);
        }

        core.debug(`sudo xcode-select -s ${targetVersionDirectory}`);
        utils.invokeCommandSync("xcode-select", ["-s", targetVersionDirectory], { sudo: true });

        core.exportVariable("MD_APPLE_SDK_ROOT", targetVersionDirectory);
    }
    
}
