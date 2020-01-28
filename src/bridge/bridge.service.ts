import { Bridge } from "./bridge";
import { IPushFileData, IPullFileData } from "./bridge.dto";
import { promises } from "fs";
import { HelpError } from "./../errors/help-error";
import { join, basename } from "path";
import colors from "colors/safe";
import { log } from "./../util/logger";
import { groupBy } from "./../util/array";
import { getLastDirectory } from "./../util/dirs";

const fileExists = async (path: string) => !!(await promises.stat(path).catch(e => false));

export class BridgeService {
    private bridge: Bridge;

    constructor() {
        this.bridge = new Bridge();
    }

    public async pushFileData({
        currentDirectory, env, path, file, type,
    }: IPushFileData): Promise<void> {
        if (!env) {
            env = getLastDirectory(currentDirectory);
        }
        if (!file.startsWith("/")) {
            file = join(currentDirectory, file);
        }
        if (! (await fileExists(file))) {
            throw new HelpError(colors.yellow("No file found at ") + colors.bgYellow(file));
        }

        const data = await promises.readFile(file);

        await this.bridge.store({data, filename: basename(file), envName: env, path, type});
    }

    public async pullFileData({currentDirectory, envName, filename, path, outputDir, print}: IPullFileData): Promise<void> {
        if (!envName) {
            envName = getLastDirectory(currentDirectory);
        }
        const data = await this.bridge.retrieve({envName, path, filename});

        if (print !== undefined) {
            log(data.toString());
            return;
        }

        const finalPath = outputDir ? outputDir : path ? path : "";
        if (finalPath) {
            await promises.mkdir(finalPath, {recursive: true});
        }
        await promises.writeFile(join(finalPath, filename), data);
    }

    public async ls({currentDirectory, env, path, file, type, envs}): Promise<void> {
        const isEnvs = envs !== undefined;
        if (!env && !isEnvs) {
            env = getLastDirectory(currentDirectory);
        }
        if (env === "*") {
            env = undefined;
        }

        if (isEnvs) {
            const {items} = await this.bridge.lsEnvs({name: env});
            items.forEach(({name}) => log(colors.yellow(name)));
        } else {
            const {items} = await this.bridge.lsFileData({env, filename: file, path});
            Object.entries(groupBy(items
            .map(({
                env: {name}, filename, path: fPath, type: fType, id,
            }) => ({env: name, filename, path: fPath, type: fType, id}))
            .sort(({env: aEnv}, {env: bEnv}) => {
                aEnv = aEnv.toLowerCase();
                bEnv = bEnv.toLowerCase();
                return aEnv < bEnv ? -1 : aEnv > bEnv ? 1 : 0;
            }).sort(({filename: aF}, {filename: bF}) => {
                aF = aF.toLowerCase();
                bF = bF.toLowerCase();
                return aF < bF ? -1 : aF > bF ? 1 : 0;
            }), "env")).forEach(([key, filenameItems]) => {
                log(colors.yellow(key));
                filenameItems.forEach(({ path: fPath, filename }) => {
                    fPath = fPath ? fPath : "./";
                    const filenamePath = join(fPath, filename);
                    log(` - ${colors.grey(filenamePath)}`);
                });
            });
        }
    }

    public async delete({currentDirectory, env, filename, path}: {
        currentDirectory: string;
        env: string;
        filename?: string;
        path?: string;
    }): Promise<void> {
        if (!env) {
            env = getLastDirectory(currentDirectory);
        }
        if (!filename) {
            const {deleted} = await this.bridge.deleteEnv({env});
            if (!deleted) {
                log(colors.yellow("No environment was deleted"));
            }
        } else {
            const {deleted} = await this.bridge.deleteFileData({env, filename, path});
            if (!deleted) {
                log(colors.yellow("No file data was deleted"));
            }
        }
    }

}
