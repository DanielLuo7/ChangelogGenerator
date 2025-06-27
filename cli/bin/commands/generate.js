"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChangelog = generateChangelog;
const fs_1 = __importDefault(require("fs"));
const git_1 = require("../utils/git");
const publish_1 = require("../utils/publish");
const common_1 = require("../utils/common");
const simple_git_1 = __importDefault(require("simple-git"));
const git = (0, simple_git_1.default)();
async function generateChangelog(options) {
    const to = options.to || "HEAD";
    const from = options.from || await (0, publish_1.getLastPublished)();
    const commits = await (0, git_1.getCommitMessages)(from, to);
    if (commits === undefined || commits.length === 0) {
        console.log("No commits to read. Changelogs are up to date.");
        process.exit();
    }
    let changelog = `# Changelog\n\n## Changes ${from} to ${to}\n\n`;
    changelog += commits.join("\n");
    changelog = await (0, common_1.summarizeChangeLog)(changelog);
    if (options.output) {
        fs_1.default.writeFileSync(options.output, changelog, "utf-8");
    }
    else if (options.publish) {
        const latest = await git.revparse([to]);
        console.log("The following is a preview of your generated changelog.\n", changelog);
        const publish = ((await (0, common_1.prompt)("Would you like to publish your changelog? (y/N)")).toLowerCase() === "y");
        if (publish) {
            await (0, publish_1.publishChangeLog)(changelog, from, latest, commits);
        }
        process.exit();
    }
}
