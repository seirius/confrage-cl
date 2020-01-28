"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HelpError extends Error {
    constructor(message) {
        if (typeof message === "string") {
            super(message);
            this.messages = [message];
        }
        else {
            super();
            this.messages = message;
        }
    }
}
exports.HelpError = HelpError;
//# sourceMappingURL=help-error.js.map