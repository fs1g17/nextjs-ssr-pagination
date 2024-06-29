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
  where,
} from "firebase/firestore";
import { db } from "./init";
import { Article } from "@/types/Article";

export async function getArticles(): Promise<Article[]> {
  return getDocs(collection(db, "articles")).then((data) =>
    data.docs.map((doc) => ({
      id: doc.id,
      createdAt: doc.data().createdAt,
    }))
  );
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

  return getDocs(query(ref, ...constraints)).then((docuemtnSnapshots) =>
    docuemtnSnapshots.docs.map((doc) => ({
      id: doc.id,
      createdAt: doc.data().createdAt,
    }))
  );
};

export const getOrdinal = () =>
  getCountFromServer(collection(db, "articles")).then(
    (snapshot) => snapshot.data().count
  );

export const getArticlesByOrdinal = async (
  page: number,
  ordinal: number
): Promise<Article[]> =>
  getDocs(
    query(
      collection(db, "articles"),
      orderBy("ordinal", "desc"),
      where("ordinal", "<", ordinal - page * articlesPerPage),
      limit(articlesPerPage)
    )
  ).then((documentSnapshots) =>
    documentSnapshots.docs.map((doc) => ({
      id: doc.id,
      createdAt: doc.data().createdAt,
    }))
  );
