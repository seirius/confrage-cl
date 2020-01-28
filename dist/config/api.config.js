"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const env = __importStar(require("env-var"));
const url_1 = require("url");
class ApiConfig {
    static get HOST() {
        return env.get("CONFRAGE_API_HOST", "http://localhost:3000").asString();
    }
    static resolveHostTo(path) {
        return url_1.resolve(ApiConfig.HOST, path);
    }
}
exports.ApiConfig = ApiConfig;
//# sourceMappingURL=api.config.js.map