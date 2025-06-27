import { GetServerSideProps } from "next";
import supabase from "@/lib/supabase";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChangelogEntry = {
  from_commit: string;
  to_commit: string;
  summary: string;
  published_at: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const repoName = context.params?.repo as string;
  const { data, error } = await supabase
    .from("changelogs")
    .select("*")
    .eq("repo_name", repoName)
    .order("published_at", { ascending: false });

  return {
    props: {
      repoName,
      changelogs: data || [],
    },
  };
};

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
        <div key={i} className="mb-10">
          <div className="text-3xl font-bold mb-6">
            {new Date(log.published_at).toLocaleDateString()}
          </div>

          <div className="overflow-x-auto border rounded-xl shadow-sm">
            <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      ul: ({ children }) => (
                        <ul className="grid gap-2 list-disc list-inside">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="bg-gray-50 border border-gray-200 rounded-md p-2 shadow-sm">
                          {children}
                        </li>
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-base font-bold mt-4 mb-2" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="text-sm leading-relaxed" {...props} />
                      ),
                    }}
                  >
                    {log.summary}
                  </ReactMarkdown>
                </div>
              </div>
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
