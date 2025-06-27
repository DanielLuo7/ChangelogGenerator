import { GetServerSideProps } from "next";
import supabase from "@/lib/supabase"
import Head from "next/head"
import ReactMarkdown from "react-markdown";

type ChangelogEntry = {
    from_commit: string;
    to_commit: string;
    summary: string;
    published_at: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const repoName = context.params?.repo as string;
    const { data, error } = await supabase.from("changelogs").select("*").eq("repo_name", repoName)
    return {
        props: {
            repoName,
            changelogs: data || []
        }
    }
}

export default function RepoChangelogsPage({
    repoName,
    changelogs,
}: {
    repoName: string;
    changelogs: ChangelogEntry[];
}) {
    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Head>
            <title>{repoName} – Changelog</title>
          </Head>
    
          <h1 className="text-3xl font-bold mb-6">{repoName} – Changelog</h1>
    
          {changelogs.map((log, i) => (
            <div key={i} className="mb-8">
              <div className="text-xs text-gray-500 mb-1">
                {new Date(log.published_at).toLocaleDateString()}
              </div>
    
              <div className="bg-white border rounded p-4 shadow-sm">
                <div className="prose prose-sm">
                  <ReactMarkdown>{log.summary}</ReactMarkdown>
                </div>


              </div>
            </div>
          ))}
    
          {changelogs.length === 0 && (
            <p className="text-gray-500">No changelogs published yet.</p>
          )}
        </div>
    ); 
}
