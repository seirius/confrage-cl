import { IPushFileData, IPullFileData } from "./bridge.dto";
export declare class BridgeService {
    private bridge;
    constructor();
    pushFileData({ currentDirectory, env, path, file, type, }: IPushFileData): Promise<void>;
    pullFileData({ currentDirectory, envName, filename, path, outputDir, print }: IPullFileData): Promise<void>;
    ls({ currentDirectory, env, path, file, type, envs }: {
        currentDirectory: any;
        env: any;
        path: any;
        file: any;
        type: any;
        envs: any;
    }): Promise<void>;
    delete({ currentDirectory, env, filename, path }: {
        currentDirectory: string;
        env: string;
        filename?: string;
        path?: string;
    }): Promise<void>;
}
