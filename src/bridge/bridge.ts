import Axios from "axios";
import { IStoreArgs, IRetrieveArgs, ILsEnvsResponse, ILsFileDataResponse } from "./bridge.dto";
import { HelpError } from "./../errors/help-error";
import FormData from "form-data";
import colors from "colors/safe";
import { ApiConfig } from "./../config/api.config";

export class Bridge {

    public async store({ data, filename, envName, path, type }: IStoreArgs): Promise<void> {
        const formData = new FormData();
        formData.append("data", data, filename);
        formData.append("envName", envName);
        if (path) {
            formData.append("path", path);
        }
        if (type) {
            formData.append("type", type);
        }
        const { status } = await Axios.post(ApiConfig.resolveHostTo("/storage/file-data"), formData, {
            headers: formData.getHeaders(),
            maxContentLength: Infinity,
        });
        if (status !== 201) {
            throw new HelpError(colors.bgRed("Unexpected error with the confrage server"));
        }
    }

    public async retrieve({ envName, path, filename }: IRetrieveArgs): Promise<Buffer> {
        try {
            const { status, data } = await Axios.get(ApiConfig.resolveHostTo("/storage/file-data"), {
                params: { envName, path, filename },
                responseType: "blob",
                transformResponse: [],
            });
            if (status !== 200) {
                throw new HelpError(colors.bgRed("Unexpected error with the confrage server"));
            }
            return data;
        } catch (error) {
            const {response: { status }} = error;
            if (status === 404) {
                throw new HelpError(colors.bgYellow("No file was found"));
            } else {
                throw error;
            }
        }
    }

    public async lsEnvs({ name }: { name?: string }): Promise<ILsEnvsResponse> {
        const { status, data } = await Axios.get(ApiConfig.resolveHostTo("/storage/env/ls"), {
            params: {name}
        });
        if (status !== 200) {
            throw new HelpError(colors.bgRed("Unexpected error with the confrage server"));
        }
        return data;
    }

    public async lsFileData({env, filename, path}: {
        env?: string;
        filename?: string;
        path?: string;
    }): Promise<ILsFileDataResponse> {
        const { status, data } = await Axios.get(ApiConfig.resolveHostTo("storage/file-data/ls"), {
            params: {env, filename, path},
        });
        if (status !== 200) {
            throw new HelpError(colors.bgRed("Unexpected error with the confrage server"));
        }
        return data;
    }

    public async deleteEnv({env}: {env: string}): Promise<{deleted: number}> {
        const { status, data } = await Axios.delete(ApiConfig.resolveHostTo("storage/env"), {
            params: {env},
        });
        if (status !== 200) {
            throw new HelpError(colors.bgRed("Unexpected error with the confrage server"));
        }
        return data;
    }

    public async deleteFileData({env, filename, path}: {
        env: string;
        filename: string;
        path: string;
    }): Promise<{deleted: number}> {
        try {
            const { status, data } = await Axios.delete(ApiConfig.resolveHostTo("storage/file-data"), {
                params: {env, filename, path},
            });
            if (status !== 200) {
                throw new HelpError(colors.bgRed("Unexpected error with the confrage server"));
            }
            return data;
        } catch (error) {
            const { response: { status } } = error;
            if (status === 404) {
                throw new HelpError(colors.bgYellow("No environemnt was found by this name"));
            } else {
                throw error;
            }
        }
    }

}
