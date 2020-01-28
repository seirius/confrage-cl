"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getLastDirectory(fullDirectory) {
    return fullDirectory.match(/([^\/]*)\/*$/)[1];
}
exports.getLastDirectory = getLastDirectory;
//# sourceMappingURL=dirs.js.map