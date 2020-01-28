"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const help_error_1 = require("./../errors/help-error");
const form_data_1 = __importDefault(require("form-data"));
const safe_1 = __importDefault(require("colors/safe"));
const api_config_1 = require("./../config/api.config");
class Bridge {
    store({ data, filename, envName, path, type }) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new form_data_1.default();
            formData.append("data", data, filename);
            formData.append("envName", envName);
            if (path) {
                formData.append("path", path);
            }
            if (type) {
                formData.append("type", type);
            }
            const { status } = yield axios_1.default.post(api_config_1.ApiConfig.resolveHostTo("/storage/file-data"), formData, {
                headers: formData.getHeaders(),
                maxContentLength: Infinity,
            });
            if (status !== 201) {
                throw new help_error_1.HelpError(safe_1.default.bgRed("Unexpected error with the confrage server"));
            }
        });
    }
    retrieve({ envName, path, filename }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, data } = yield axios_1.default.get(api_config_1.ApiConfig.resolveHostTo("/storage/file-data"), {
                    params: { envName, path, filename },
                    responseType: "blob",
                    transformResponse: [],
                });
                if (status !== 200) {
                    throw new help_error_1.HelpError(safe_1.default.bgRed("Unexpected error with the confrage server"));
                }
                return data;
            }
            catch (error) {
                const { response: { status } } = error;
                if (status === 404) {
                    throw new help_error_1.HelpError(safe_1.default.bgYellow("No file was found"));
                }
                else {
                    throw error;
                }
            }
        });
    }
    lsEnvs({ name }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, data } = yield axios_1.default.get(api_config_1.ApiConfig.resolveHostTo("/storage/env/ls"), {
                params: { name }
            });
            if (status !== 200) {
                throw new help_error_1.HelpError(safe_1.default.bgRed("Unexpected error with the confrage server"));
            }
            return data;
        });
    }
    lsFileData({ env, filename, path }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, data } = yield axios_1.default.get(api_config_1.ApiConfig.resolveHostTo("storage/file-data/ls"), {
                params: { env, filename, path },
            });
            if (status !== 200) {
                throw new help_error_1.HelpError(safe_1.default.bgRed("Unexpected error with the confrage server"));
            }
            return data;
        });
    }
    deleteEnv({ env }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, data } = yield axios_1.default.delete(api_config_1.ApiConfig.resolveHostTo("storage/env"), {
                params: { env },
            });
            if (status !== 200) {
                throw new help_error_1.HelpError(safe_1.default.bgRed("Unexpected error with the confrage server"));
            }
            return data;
        });
    }
    deleteFileData({ env, filename, path }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, data } = yield axios_1.default.delete(api_config_1.ApiConfig.resolveHostTo("storage/file-data"), {
                    params: { env, filename, path },
                });
                if (status !== 200) {
                    throw new help_error_1.HelpError(safe_1.default.bgRed("Unexpected error with the confrage server"));
                }
                return data;
            }
            catch (error) {
                const { response: { status } } = error;
                if (status === 404) {
                    throw new help_error_1.HelpError(safe_1.default.bgYellow("No environemnt was found by this name"));
                }
                else {
                    throw error;
                }
            }
        });
    }
}
exports.Bridge = Bridge;
//# sourceMappingURL=bridge.js.map