"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitMessages = getCommitMessages;
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
