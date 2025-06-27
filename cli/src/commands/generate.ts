import fs from "fs";
import { getCommitMessages } from "../utils/git";
import { getLastPublished, publishChangeLog } from "../utils/publish";
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
    const from = options.from || await getLastPublished();
    const commits = await getCommitMessages(from, to);

    if ( commits === undefined || commits.length === 0 ) {
        console.log("No commits to read. Changelogs are up to date.");
        process.exit();
    }

    let changelog = `# Changelog\n\n## Changes ${from} to ${to}\n\n`; 
    changelog += commits.join("\n");
    changelog = await summarizeChangeLog(changelog)

    if (options.output) {
        fs.writeFileSync(options.output, changelog, "utf-8");
    } else if (options.preview) {
        console.log(changelog)
    } else if (options.publish) {
        const latest = await git.revparse([to]);
        await publishChangeLog(changelog, from, latest, commits)
    }

}
