#!/usr/bin/env node

import commandLineArgs from "command-line-args";
import { COMMANDS, COMMAND_DEFINITIONS } from "./consts/commands";
import "colors";
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
                `${command.bgGreen} command is not valid`.red,
                "Try with some of these ".yellow + Object.keys(COMMANDS).join(", ").bgGreen,
            ]);
        }

        const bridgeService = new BridgeService();

        const {env, path, file, type} = commandLineArgs(COMMAND_DEFINITIONS, {argv});
        switch (command) {
            case "push":
            await bridgeService.pushFileData({
                currentDirectory: process.cwd(),
                env, path, file, type,
            });
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

/* second - parse the merge command options */
// if (mainOptions.command === "merge") {
//     const mergeDefinitions = [
//         { name: "squash", type: Boolean },
//         { name: "message", alias: "m" }
//     ]
//     const mergeOptions = commandLineArgs(mergeDefinitions, { argv });

//     console.log("\nmergeOptions\n============")
//     console.log(mergeOptions)
// }
