import { OptionDefinition } from "command-line-args";

export const COMMANDS = {
    push: {
        description: "Pushes the file to the server",
    },
    pull: {
        description: "Pulls the file from the server",
    },
};

export const COMMAND_DEFINITIONS: OptionDefinition[] = [
    {
        name: "env",
        alias: "e",
        type: String,
    },
    {
        name: "path",
        alias: "p",
        type: String,
    },
    {
        name: "file",
        alias: "f",
        type: String,
    },
    {
        name: "type",
        alias: "t",
        type: String,
    },
    {
        name: "output_dir",
        alias: "o",
        type: String,
    },
];
