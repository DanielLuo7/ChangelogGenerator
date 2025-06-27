"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastCommitHash = getLastCommitHash;
exports.setLastCommitHash = setLastCommitHash;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const simple_git_1 = __importDefault(require("simple-git"));
const git = (0, simple_git_1.default)();
const CACHE_FILE = path_1.default.resolve(".changelogger");
async function getLastCommitHash() {
    console.log("we should be in here right");
    try {
        return fs_1.default.readFileSync(CACHE_FILE, "utf-8").trim();
    }
    catch {
        return (await git.raw(["rev-list", "--max-parents=0", "HEAD"])).trim();
    }
}
function setLastCommitHash(hash) {
    fs_1.default.writeFileSync(CACHE_FILE, hash);
}
