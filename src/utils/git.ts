import simpleGit from "simple-git";

const git = simpleGit()

export async function getCommitMessages(from: string, to: string): Promise<string[]> {
    try {
        const range = `${from}..${to}`;
        const log = await git.log([range]);
        return log.all.map(entry => `- ${entry.message} (${entry.hash.slice(0, 7)})`)
    } catch (err) {
        console.error(`Failing from ${from} to ${to}`, err);
        return [];
    }
}
