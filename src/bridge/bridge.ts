import Axios from "axios";
import { IStoreArgs, IRetrieveArgs } from "./bridge.dto";
import { HelpError } from "./../errors/help-error";
import FormData from "form-data";

export class Bridge {

    public async store({data, filename, envName, path, type}: IStoreArgs): Promise<void> {
        const formData = new FormData();
        formData.append("data", data, filename);
        formData.append("envName", envName);
        formData.append("path", path);
        formData.append("type", type);
        const { status } = await Axios.post("http://localhost/storage/file-data", formData, {
            headers: formData.getHeaders(),
            maxContentLength: Infinity,
        });
        if (status !== 200) {
            throw new HelpError("Unexpected error with the confrage server".bgRed);
        }
    }

    public async retrieve({envName, path, type}: IRetrieveArgs): Promise<Buffer> {
        const { status, data } = await Axios.get("http://localhost/storage/file-data", {
            params: {envName, path, type},
            responseType: "blob",
        });
        if (status === 404) {
            throw new HelpError("File wasn't found".bgYellow);
        } else if (status !== 200) {
            throw new HelpError("Unexpected error with the confrage server".bgRed);
        }
        return data;
    }

}
