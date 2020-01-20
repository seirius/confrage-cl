export interface IStoreArgs {
    data: Buffer;
    filename: string;
    envName: string;
    path?: string;
    type?: string;
}

export interface IRetrieveArgs {
    envName: string;
    path?: string;
    filename?: string;
}

export interface IPushFileData {
    currentDirectory: string;
    env?: string;
    path?: string;
    file: string;
    type?: string;
}

export interface IPullFileData {
    currentDirectory: string;
    envName: string;
    filename: string;
    path?: string;
    outputDir?: string;
}
