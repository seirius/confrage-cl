import * as env from "env-var";
import { resolve } from "url";

export class ApiConfig {
    public static get HOST(): string {
        return env.get("CONFRAGE_API_HOST", "http://localhost:3000").asString();
    }

    public static resolveHostTo(path: string): string {
        return resolve(ApiConfig.HOST, path);
    }
}
