import type { NextApiRequest, NextApiResponse } from "next";
import supabase from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const {
        repoName,
        repoUrl,
        from,
        to,
        summary,
        rawCommits,
    } = req.body;

    if (!repoName || !from || !to || !summary) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const {error} = await supabase.from("changelogs").insert([{
        repo_name: repoName,
        repo_url: repoUrl,
        from_commit: from,
        to_commit: to,
        summary,
        raw_commits: rawCommits || []
    }]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(201).json({ message: "Changelog published successfully" });

}
