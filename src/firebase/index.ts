import {
  collection,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  Timestamp,
  updateDoc,
  where,
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

export const articlesPerPage = 5;

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

export const getOrdinal = async (): Promise<number> => {
  const coll = collection(db, "articles");
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
};

export const getArticlesByOrdinal = async (
  page: number,
  ordinal: number
): Promise<Article[]> => {
  const ref = collection(db, "articles");
  const q = query(
    ref,
    orderBy("ordinal", "desc"),
    where("ordinal", "<", ordinal - page * articlesPerPage),
    limit(articlesPerPage)
  );

  const documentSnapshots = await getDocs(q);
  return documentSnapshots.docs.map((doc) => ({
    id: doc.id,
    createdAt: doc.data().createdAt,
  }));
};
