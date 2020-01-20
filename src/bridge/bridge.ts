import Axios from "axios";
import { IStoreArgs, IRetrieveArgs } from "./bridge.dto";
import { HelpError } from "./../errors/help-error";
import FormData from "form-data";
import colors from "colors/safe";
import { resolve } from "url";
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
        const { status } = await Axios.post(resolve(ApiConfig.HOST, "/storage/file-data"), formData, {
            headers: formData.getHeaders(),
            maxContentLength: Infinity,
        });
        if (status !== 201) {
            throw new HelpError(colors.bgRed("Unexpected error with the confrage server"));
        }
    }

    public async retrieve({ envName, path, filename }: IRetrieveArgs): Promise<Buffer> {
        const { status, data } = await Axios.get(resolve(ApiConfig.HOST, "/storage/file-data"), {
            params: { envName, path, filename },
            responseType: "blob",
            transformResponse: [],
        });
        if (status === 404) {
            throw new HelpError(colors.bgYellow("File wasn't found"));
        } else if (status !== 200) {
            throw new HelpError(colors.bgRed("Unexpected error with the confrage server"));
        }
        return data;
    }

}
