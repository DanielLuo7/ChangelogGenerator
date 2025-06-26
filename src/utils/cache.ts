import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

const git = simpleGit();

const CACHE_FILE = path.resolve(".changelogger");
export async function getLastCommitHash(): Promise<string> {
    try {
        return fs.readFileSync(CACHE_FILE, "utf-8").trim();
    } catch {
        return (await git.raw(["rev-list", "--max-parents=0", "HEAD"])).trim();
    }
}

export function setLastCommitHash(hash: string): void {
    fs.writeFileSync(CACHE_FILE, hash);
}
