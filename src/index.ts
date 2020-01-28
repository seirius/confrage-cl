#!/usr/bin/env node

import commandLineArgs from "command-line-args";
import { COMMANDS, COMMAND_DEFINITIONS } from "./consts/commands";
import colors from "colors/safe";
import { HelpError } from "./errors/help-error";
import { BridgeService } from "./bridge/bridge.service";

async function run() {
    try {
        const mainDefinitions = [
            { name: "command", defaultOption: true },
        ];
        const {_unknown, command} = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
        const argv = _unknown || [];

        if (!(command in COMMANDS)) {
            throw new HelpError([
                colors.red(`${colors.bgGreen(command)} command is not valid`),
                colors.yellow("Try with some of these ") + colors.bgGreen(Object.keys(COMMANDS).join(", ")),
            ]);
        }

        const bridgeService = new BridgeService();

        const {env, path, file, type, output_dir, envs, print} = commandLineArgs(COMMAND_DEFINITIONS, {argv});
        const currentDirectory = process.cwd();
        switch (command) {
            case "push":
                await bridgeService.pushFileData({ currentDirectory, env, path, file, type });
                break;

            case "pull":
                await bridgeService.pullFileData({
                    currentDirectory,
                    envName: env,
                    filename: file,
                    path,
                    outputDir: output_dir,
                    print,
                });
                break;
            case "ls":
                await bridgeService.ls({ currentDirectory, env, file, type, path, envs });
                break;
            case "delete":
                await bridgeService.delete({ currentDirectory, env, filename: file, path });
                break;
        }
    } catch (error) {
        showError(error);
    }
}

function showError(error: Error) {
    if (error instanceof HelpError) {
        // tslint:disable-next-line: no-console
        error.messages.forEach(m => console.log(m));
    } else {
        // tslint:disable-next-line: no-console
        console.error(error);
    }
}

run();
