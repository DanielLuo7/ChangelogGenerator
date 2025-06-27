"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChangelog = generateChangelog;
const fs_1 = __importDefault(require("fs"));
const git_1 = require("../utils/git");
const cache_1 = require("../utils/cache");
const publish_1 = require("../utils/publish");
const common_1 = require("../utils/common");
const simple_git_1 = __importDefault(require("simple-git"));
const git = (0, simple_git_1.default)();
async function generateChangelog(options) {
    const to = options.to || "HEAD";
    const from = options.from || await (0, cache_1.getLastCommitHash)();
    const commits = await (0, git_1.getCommitMessages)(from, to);
    let changelog = `# Changelog\n\n## Changes ${from} to ${to}\n\n`;
    changelog += commits.join("\n");
    changelog = await (0, common_1.summarizeChangeLog)(changelog);
    if (options.output) {
        fs_1.default.writeFileSync(options.output, changelog, "utf-8");
    }
    else if (options.preview) {
        console.log(changelog);
    }
    else if (options.publish) {
        await (0, publish_1.publishChangeLog)(changelog);
        const hash = (await git.revparse([to])).trim();
        (0, cache_1.setLastCommitHash)(hash);
    }
}
