import * as child from "child_process";
import { EOL } from "os";

interface InvokeCommandOptions {
    sudo: boolean;
}

export const invokeCommandSync = (command: string, args: string[], options: InvokeCommandOptions): void => {
    let execResult: child.SpawnSyncReturns<string>;

    if (options.sudo) {
        execResult = child.spawnSync("sudo", [command, ...args]);
    } else {
        execResult = child.spawnSync(command, args);
    }

    if (execResult.status !== 0) {
        const fullCommand = `${options.sudo ? "sudo " : ""}${command} ${args.join(" ")}`;
        throw new Error(
            [
                `Error during run '${fullCommand}'`,
                execResult.stderr,
                execResult.stdout
            ].join(EOL)
        );
    }
};
