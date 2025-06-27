import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { repo } = req.query;

  if (typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid `repo` query parameter' });
  }

  const { data, error } = await supabase
    .from('changelogs')
    .select('to_commit')
    .eq('repo_name', repo)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  if (!data) return res.status(404).json({ error: 'No changelogs found for this repo' });

  return res.status(200).json({ to_commit: data.to_commit });
}
