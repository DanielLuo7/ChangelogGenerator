import supabase from "@/lib/supabase"
import Link from "next/link";

export async function getServerSideProps() {
    const { data } = await supabase.from("changelogs").select("repo_name").order("published_at", {ascending: false});
    const repoNames = Array.from(new Set((data || []).map(c => c.repo_name)));

    return { props: { repoNames }};
}

export default function repoList({ repoNames }: { repoNames: string[] }) {
    return (
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Published Repos</h1>
          <ul>
            {repoNames.map(name => (
              <li key={name}>
                <Link href={`/repos/${encodeURIComponent(name)}`}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
}
