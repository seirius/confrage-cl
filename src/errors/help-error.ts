export class HelpError extends Error {
    messages: string[];

    constructor(message: string | string[]) {
        if (typeof message === "string") {
            super(message);
            this.messages = [message];
        } else {
            super();
            this.messages = message;
        }
    }
}
