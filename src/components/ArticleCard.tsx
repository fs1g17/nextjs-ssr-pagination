import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Article } from "@/types/Article";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{article.id}</CardTitle>
        <CardDescription>
          Created At: {article.createdAt.toDate().toDateString()}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
