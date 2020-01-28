#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_args_1 = __importDefault(require("command-line-args"));
const commands_1 = require("./consts/commands");
const safe_1 = __importDefault(require("colors/safe"));
const help_error_1 = require("./errors/help-error");
const bridge_service_1 = require("./bridge/bridge.service");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mainDefinitions = [
                { name: "command", defaultOption: true },
            ];
            const { _unknown, command } = command_line_args_1.default(mainDefinitions, { stopAtFirstUnknown: true });
            const argv = _unknown || [];
            if (!(command in commands_1.COMMANDS)) {
                throw new help_error_1.HelpError([
                    safe_1.default.red(`${safe_1.default.bgGreen(command)} command is not valid`),
                    safe_1.default.yellow("Try with some of these ") + safe_1.default.bgGreen(Object.keys(commands_1.COMMANDS).join(", ")),
                ]);
            }
            const bridgeService = new bridge_service_1.BridgeService();
            const { env, path, file, type, output_dir, envs, print } = command_line_args_1.default(commands_1.COMMAND_DEFINITIONS, { argv });
            const currentDirectory = process.cwd();
            switch (command) {
                case "push":
                    yield bridgeService.pushFileData({ currentDirectory, env, path, file, type });
                    break;
                case "pull":
                    yield bridgeService.pullFileData({
                        currentDirectory,
                        envName: env,
                        filename: file,
                        path,
                        outputDir: output_dir,
                        print,
                    });
                    break;
                case "ls":
                    yield bridgeService.ls({ currentDirectory, env, file, type, path, envs });
                    break;
                case "delete":
                    yield bridgeService.delete({ currentDirectory, env, filename: file, path });
                    break;
            }
        }
        catch (error) {
            showError(error);
        }
    });
}
function showError(error) {
    if (error instanceof help_error_1.HelpError) {
        error.messages.forEach(m => console.log(m));
    }
    else {
        console.error(error);
    }
}
run();
//# sourceMappingURL=index.js.map