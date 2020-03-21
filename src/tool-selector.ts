export interface ToolSelector {
    readonly toolName: string;
    getAllVersions(): string[];
    findVersion(versionSpec: string): string | null;
    setVersion(version: string): void;
}