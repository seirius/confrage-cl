/// <reference types="node" />
import { IStoreArgs, IRetrieveArgs, ILsEnvsResponse, ILsFileDataResponse } from "./bridge.dto";
export declare class Bridge {
    store({ data, filename, envName, path, type }: IStoreArgs): Promise<void>;
    retrieve({ envName, path, filename }: IRetrieveArgs): Promise<Buffer>;
    lsEnvs({ name }: {
        name?: string;
    }): Promise<ILsEnvsResponse>;
    lsFileData({ env, filename, path }: {
        env?: string;
        filename?: string;
        path?: string;
    }): Promise<ILsFileDataResponse>;
    deleteEnv({ env }: {
        env: string;
    }): Promise<{
        deleted: number;
    }>;
    deleteFileData({ env, filename, path }: {
        env: string;
        filename: string;
        path: string;
    }): Promise<{
        deleted: number;
    }>;
}
