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
    type?: string;
}

export interface IPushFileData {
    currentDirectory: string;
    env?: string;
    path?: string;
    file: string;
    type?: string;
}
