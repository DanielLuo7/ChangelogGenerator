"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishChangeLog = publishChangeLog;
exports.getLastPublished = getLastPublished;
const git_1 = require("../utils/git");
const simple_git_1 = __importDefault(require("simple-git"));
const git = (0, simple_git_1.default)();
const BASE_URL = "https://changelogger-lemon.vercel.app";
async function publishChangeLog(changelog, from, to, commits) {
    const payload = {
        repoName: await (0, git_1.getRepoName)(),
        repoUrl: await (0, git_1.getRepoUrl)(),
        from,
        to,
        summary: changelog,
        rawCommits: commits
    };
    const response = await fetch(`${BASE_URL}/api/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (response.status === 201) {
        console.log("Changelog successfully published");
    }
    else {
        const error = await response.json();
        console.error("Failed to publish changelog:", error.error);
    }
}
async function getLastPublished() {
    const repoName = await (0, git_1.getRepoName)();
    const res = await fetch(`${BASE_URL}/api/latest?repo=${encodeURIComponent(repoName)}`);
    if (res.status === 500) {
        throw new Error("Internal server error. Could not find last published commit.");
    }
    else if (res.status === 404) {
        return (await git.raw(["rev-list", "--max-parents=0", "HEAD"])).trim();
    }
    const json = await res.json();
    return json.to_commit;
}
