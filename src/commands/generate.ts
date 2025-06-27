import fs from "fs";
import { getCommitMessages } from "../utils/git";
import { getLastCommitHash, setLastCommitHash } from "../utils/cache";
import { publishChangeLog } from "../utils/publish";
import { summarizeChangeLog } from "../utils/common";
import simpleGit from "simple-git";

const git = simpleGit();

export async function generateChangelog( options: {
    from?: string;
    to?: string;
    output?: string;
    preview?: boolean;
    publish?: boolean;
}) {
    const to = options.to || "HEAD";
    const from = options.from || await getLastCommitHash();
    const commits = await getCommitMessages(from, to);
    let changelog = `# Changelog\n\n## Changes ${from} to ${to}\n\n`; 
    changelog += commits.join("\n");
    changelog = await summarizeChangeLog(changelog)

    if (options.output) {
        fs.writeFileSync(options.output, changelog, "utf-8");
    } else if (options.preview) {
        console.log(changelog)
    } else if (options.publish) {
        await publishChangeLog(changelog)
        const hash = (await git.revparse([to])).trim();
        setLastCommitHash(hash)
    }

}
