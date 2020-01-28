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
const bridge_1 = require("./bridge");
const fs_1 = require("fs");
const help_error_1 = require("./../errors/help-error");
const path_1 = require("path");
const safe_1 = __importDefault(require("colors/safe"));
const logger_1 = require("./../util/logger");
const array_1 = require("./../util/array");
const dirs_1 = require("./../util/dirs");
const fileExists = (path) => __awaiter(void 0, void 0, void 0, function* () { return !!(yield fs_1.promises.stat(path).catch(e => false)); });
class BridgeService {
    constructor() {
        this.bridge = new bridge_1.Bridge();
    }
    pushFileData({ currentDirectory, env, path, file, type, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!env) {
                env = dirs_1.getLastDirectory(currentDirectory);
            }
            if (!file.startsWith("/")) {
                file = path_1.join(currentDirectory, file);
            }
            if (!(yield fileExists(file))) {
                throw new help_error_1.HelpError(safe_1.default.yellow("No file found at ") + safe_1.default.bgYellow(file));
            }
            const data = yield fs_1.promises.readFile(file);
            yield this.bridge.store({ data, filename: path_1.basename(file), envName: env, path, type });
        });
    }
    pullFileData({ currentDirectory, envName, filename, path, outputDir, print }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!envName) {
                envName = dirs_1.getLastDirectory(currentDirectory);
            }
            const data = yield this.bridge.retrieve({ envName, path, filename });
            if (print !== undefined) {
                logger_1.log(data.toString());
                return;
            }
            const finalPath = outputDir ? outputDir : path ? path : "";
            if (finalPath) {
                yield fs_1.promises.mkdir(finalPath, { recursive: true });
            }
            yield fs_1.promises.writeFile(path_1.join(finalPath, filename), data);
        });
    }
    ls({ currentDirectory, env, path, file, type, envs }) {
        return __awaiter(this, void 0, void 0, function* () {
            const isEnvs = envs !== undefined;
            if (!env && !isEnvs) {
                env = dirs_1.getLastDirectory(currentDirectory);
            }
            if (env === "*") {
                env = undefined;
            }
            if (isEnvs) {
                const { items } = yield this.bridge.lsEnvs({ name: env });
                items.forEach(({ name }) => logger_1.log(safe_1.default.yellow(name)));
            }
            else {
                const { items } = yield this.bridge.lsFileData({ env, filename: file, path });
                Object.entries(array_1.groupBy(items
                    .map(({ env: { name }, filename, path: fPath, type: fType, id, }) => ({ env: name, filename, path: fPath, type: fType, id }))
                    .sort(({ env: aEnv }, { env: bEnv }) => {
                    aEnv = aEnv.toLowerCase();
                    bEnv = bEnv.toLowerCase();
                    return aEnv < bEnv ? -1 : aEnv > bEnv ? 1 : 0;
                }).sort(({ filename: aF }, { filename: bF }) => {
                    aF = aF.toLowerCase();
                    bF = bF.toLowerCase();
                    return aF < bF ? -1 : aF > bF ? 1 : 0;
                }), "env")).forEach(([key, filenameItems]) => {
                    logger_1.log(safe_1.default.yellow(key));
                    filenameItems.forEach(({ path: fPath, filename }) => {
                        fPath = fPath ? fPath : "./";
                        const filenamePath = path_1.join(fPath, filename);
                        logger_1.log(` - ${safe_1.default.grey(filenamePath)}`);
                    });
                });
            }
        });
    }
    delete({ currentDirectory, env, filename, path }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!env) {
                env = dirs_1.getLastDirectory(currentDirectory);
            }
            if (!filename) {
                const { deleted } = yield this.bridge.deleteEnv({ env });
                if (!deleted) {
                    logger_1.log(safe_1.default.yellow("No environment was deleted"));
                }
            }
            else {
                const { deleted } = yield this.bridge.deleteFileData({ env, filename, path });
                if (!deleted) {
                    logger_1.log(safe_1.default.yellow("No file data was deleted"));
                }
            }
        });
    }
}
exports.BridgeService = BridgeService;
//# sourceMappingURL=bridge.service.js.map