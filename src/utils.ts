import * as child from 'child_process';
import { EOL } from 'os';

export const invokeCommandSync = (command: string, args: string[], sudo: boolean) => {
    let execResult: child.SpawnSyncReturns<string>;
    if (sudo) {
        execResult = child.spawnSync('sudo', [command, ...args]);
    } else {
        execResult = child.spawnSync(command, args);
    }

    if (execResult.status !== 0) {
        throw new Error([
            `Error during run ${sudo ? 'sudo' : ''} ${command} ${args.join(' ')}`,
            execResult.stderr,
            execResult.stdout
        ].join(EOL));
    }
};