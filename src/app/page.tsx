import ArticleCard from "@/components/ArticleCard";
import { getArticles } from "@/firebase";

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full font-mono text-sm flex flex-col gap-y-4 items-center">
        {articles.map(article => (<ArticleCard article={article} key={article.id} />))}
      </div>
    </main>
  );
}
