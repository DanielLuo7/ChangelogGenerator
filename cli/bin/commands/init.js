"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const common_1 = require("../utils/common");
async function writeToShellConfig(key, value) {
    const shell = process.env.SHELL || "";
    const home = os_1.default.homedir();
    const targetFile = shell.includes("zsh") ? path_1.default.join(home, ".zshrc") : path_1.default.join(home, ".bashrc");
    const keyValue = `export ${key}=${value}`;
    const contents = fs_1.default.readFileSync(targetFile, "utf-8");
    if (!contents.includes(keyValue)) {
        fs_1.default.appendFileSync(targetFile, `\n${keyValue}\n`);
        console.log(`Added ${key}=${value} to ${targetFile}`);
    }
    else {
        console.log(`${key} already exists in ${targetFile}`);
    }
    console.log(`To use API key, run: source ${targetFile}`);
}
function appendToGitIgnore(file) {
    const gitIgnorePath = path_1.default.resolve(".gitignore");
    if (fs_1.default.existsSync(gitIgnorePath)) {
        const current = fs_1.default.readFileSync(gitIgnorePath, "utf-8");
        if (!current.includes(file)) {
            fs_1.default.appendFileSync(gitIgnorePath, `\n${file}\n`);
            console.log(`Wrote ${file} to gitignore.`);
        }
    }
    else {
        fs_1.default.writeFileSync(gitIgnorePath, `${file}\n`);
        console.log(`Created gitignore and added ${file}.`);
    }
}
async function init() {
    console.log("Initializing requirements for your changelogger...");
    const apiKey = await (0, common_1.prompt)("Enter your OpenRouter API key: ");
    const storeGlobally = ((await (0, common_1.prompt)("Set your API key globally in shell config? (y/N)")).toLowerCase() === "y");
    if (storeGlobally) {
        await writeToShellConfig("API_KEY", apiKey);
    }
    else {
        const envPath = path_1.default.resolve(".env");
        fs_1.default.writeFileSync(envPath, `API_KEY=${apiKey}\n`);
        appendToGitIgnore(".env");
        console.log("API key written to .env file and added to .gitignore");
    }
}
