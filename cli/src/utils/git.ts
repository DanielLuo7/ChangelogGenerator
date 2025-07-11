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

export async function getRepoUrl() {
    const remotes = await git.getRemotes(true);
    const origin = remotes.find(remote => remote.name == "origin");
    let url = origin?.refs.fetch || "unknown";
    if (url === "unknown") {
        console.error("Could not find repo url");
        process.exit();
    }
    return normalizeRepoUrl(url); 
}

const normalizeRepoUrl = (url: string): string => {
    if (url.startsWith("git@github.com:")) {
      return url.replace("git@github.com:", "https://github.com/").replace(/\.git$/, "");
    }
    return url;
  };


export async function getRepoName() {
    const url = await getRepoUrl();
    const match = url.match(/([^\/:]+\/[^\/\.]+)(\.git)?$/);
    return match ? match[1] : "unknown";
}
