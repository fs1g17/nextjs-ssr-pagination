import {
  collection,
  endBefore,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import { db } from "./init";
import { Article } from "@/types/Article";

export async function getArticles(): Promise<Article[]> {
  const data = await getDocs(collection(db, "articles"));
  return data.docs.map((doc) => ({
    id: doc.id,
    createdAt: doc.data().createdAt,
  }));
}

const articlesPerPage = 5;

export const getArticlesByTimestamp = async (
  timestamp?: Timestamp,
  direction?: "prev" | "next"
): Promise<Article[]> => {
  const ref = collection(db, "articles");
  const constraints: QueryConstraint[] = [
    orderBy("createdAt", "desc"),
    limit(articlesPerPage),
  ];

  if (timestamp && direction)
    constraints.push(
      direction === "prev" ? endBefore(timestamp) : startAfter(timestamp)
    );

  const documentSnapshots = await getDocs(query(ref, ...constraints));
  return documentSnapshots.docs.map((doc) => ({
    id: doc.id,
    createdAt: doc.data().createdAt,
  }));
};
