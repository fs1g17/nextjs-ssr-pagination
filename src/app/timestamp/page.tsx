import Link from "next/link";

import { getArticles, getArticlesByTimestamp } from "@/firebase";
import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/ArticleCard";
import { Timestamp } from "firebase/firestore";
import { redirect } from "next/navigation";

export default async function TimestampApproach({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  let seconds: number | undefined,
    nanoseconds: number | undefined,
    direction: "prev" | "next" | undefined;
  if (searchParams) {
    seconds = searchParams.seconds ? parseInt(searchParams.seconds) : undefined;
    nanoseconds = searchParams.nanoseconds
      ? parseInt(searchParams.nanoseconds)
      : undefined;
    direction =
      searchParams.direction === "prev"
        ? "prev"
        : searchParams.direction === "next"
        ? "next"
        : undefined;
  }

  const articles = await getArticlesByTimestamp(
    seconds && nanoseconds ? new Timestamp(seconds, nanoseconds) : undefined,
    direction
  );

  const firstArticleTimestamp: Timestamp | undefined = articles[0]?.createdAt;
  const lastArticleTimestamp: Timestamp | undefined =
    articles[articles.length - 1]?.createdAt;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full font-mono text-sm flex flex-col gap-y-4 items-center">
        {articles.map((article) => (
          <ArticleCard article={article} key={article.id} />
        ))}
      </div>
      <div className="flex mt-6">
        {firstArticleTimestamp && (
          <Link
            href={`/timestamp?seconds=${firstArticleTimestamp.seconds}&nanoseconds=${firstArticleTimestamp.nanoseconds}&direction=prev`}
            className="mr-12"
          >
            <Button>Prev</Button>
          </Link>
        )}
        {lastArticleTimestamp && (
          <Link
            href={`/timestamp?seconds=${lastArticleTimestamp.seconds}&nanoseconds=${lastArticleTimestamp.nanoseconds}&direction=next`}
          >
            <Button>Next</Button>
          </Link>
        )}
      </div>
    </main>
  );
}
