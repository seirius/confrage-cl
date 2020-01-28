export function getLastDirectory(fullDirectory: string): string {
    return fullDirectory.match(/([^\/]*)\/*$/)[1];
}