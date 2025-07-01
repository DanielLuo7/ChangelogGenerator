"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitMessages = getCommitMessages;
exports.getRepoUrl = getRepoUrl;
exports.getRepoName = getRepoName;
const simple_git_1 = __importDefault(require("simple-git"));
const git = (0, simple_git_1.default)();
async function getCommitMessages(from, to) {
    try {
        const range = `${from}..${to}`;
        const log = await git.log([range]);
        return log.all.map(entry => `- ${entry.message} (${entry.hash.slice(0, 7)})`);
    }
    catch (err) {
        console.error(`Failing from ${from} to ${to}`, err);
        return [];
    }
}
async function getRepoUrl() {
    const remotes = await git.getRemotes(true);
    const origin = remotes.find(remote => remote.name == "origin");
    let url = origin?.refs.fetch || "unknown";
    if (url === "unknown") {
        console.error("Could not find repo url");
        process.exit();
    }
    return normalizeRepoUrl(url);
}
const normalizeRepoUrl = (url) => {
    if (url.startsWith("git@github.com:")) {
        return url.replace("git@github.com:", "https://github.com/").replace(/\.git$/, "");
    }
    return url;
};
async function getRepoName() {
    const url = await getRepoUrl();
    const match = url.match(/([^\/:]+\/[^\/\.]+)(\.git)?$/);
    return match ? match[1] : "unknown";
}
