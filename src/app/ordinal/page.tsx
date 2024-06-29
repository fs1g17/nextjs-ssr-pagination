import Link from "next/link";

import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/ArticleCard";
import { articlesPerPage, getArticlesByOrdinal, getOrdinal } from "@/firebase";

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page =
    typeof searchParams?.page === "string" ? parseInt(searchParams?.page) : 0;
  const ordinal = await getOrdinal();
  const articles = await getArticlesByOrdinal(page, ordinal);

  return (
    <main className="h-full w-full">
      <div className="flex flex-col space-y-4 h-full items-center pt-4 w-[95vw] sm:w-[80vw] md:[w-60vw] mx-auto">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
        <div className="flex">
          {page > 0 && (
            <Link href={`/ordinal/?page=${page - 1}`} className="mr-4">
              <Button>Prev</Button>
            </Link>
          )}
          {(page + 1) * articlesPerPage < ordinal && (
            <Link href={`/ordinal/?page=${page + 1}`}>
              <Button>Next</Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
