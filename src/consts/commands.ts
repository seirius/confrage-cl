import { OptionDefinition } from "command-line-args";

export const COMMANDS = {
    push: {
        description: "Pushes the file to the server",
    },
    pull: {
        description: "Pulls the file from the server",
    },
    ls: {
        description: "Lists files or environments stored in the server",
    },
    delete: {
        description: "Deletes an environment (and all of it's data) or an file data",
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
    {
        name: "envs",
        alias: "s",
        type: String,
    },
    {
        name: "print",
        alias: "r",
        type: Boolean,
    },
];
