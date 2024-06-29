import { Timestamp } from "firebase/firestore";

export interface Article {
  id: string;
  createdAt: Timestamp;
}
