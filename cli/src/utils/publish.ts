import { getRepoName, getRepoUrl } from "../utils/git"
import simpleGit from "simple-git";

const git = simpleGit()
const BASE_URL = "https://changelogger-lemon.vercel.app";

export async function publishChangeLog(changelog: string, from: string, to: string, commits: string[]) {
    const payload = {
        repoName: await getRepoName(),
        repoUrl: await getRepoUrl(),
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

}

export async function getLastPublished(): Promise<string> {
    const repoName = await getRepoName();

    const res = await fetch(`${BASE_URL}/api/latest?repo=${encodeURIComponent(repoName)}`);

    if (res.status === 500) {
        throw new Error("Internal server error. Could not find last published commit.")
    } else if (res.status === 404) {
        return (await git.raw(["rev-list", "--max-parents=0", "HEAD"])).trim();
    }

    const json = await res.json();
    return json.to_commit

}
