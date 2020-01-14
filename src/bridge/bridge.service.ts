import { Bridge } from "./bridge";
import { IPushFileData, IPullFileData } from "./bridge.dto";
import { promises } from "fs";
import { HelpError } from "./../errors/help-error";
import { join, basename } from "path";
import colors from "colors/safe";

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
            env = currentDirectory.match(/([^\/]*)\/*$/)[1];
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

    public async pullFileData({envName, filename, path}: IPullFileData): Promise<void> {
        const data = await this.bridge.retrieve({envName, path, filename});
        await promises.writeFile(join(path ? path : "", filename), data);
    }

}
