import { Bridge } from "./bridge";
import { IPushFileData } from "./bridge.dto";
import { promises } from "fs";
import { HelpError } from "./../errors/help-error";
import { join, basename } from "path";

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
            throw new HelpError("No file found at ".yellow + file.bgYellow);
        }

        const data = await promises.readFile(file);

        await this.bridge.store({data, filename: basename(file), envName: env, path, type});
    }

    // public async pullFileData(args: IPullFileData): Promise<void> {

    // }

}
