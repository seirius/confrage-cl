import * as env from "env-var";

export class ApiConfig {
    public static get HOST(): string {
        return env.get("CONFRAGE_API_HOST", "http://localhost:3000").asString();
    }
}
