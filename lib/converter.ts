import { Models } from "react-native-appwrite";

export const convertDocument = <T>(doc: Models.Document): T => {
  const result: Partial<T> = {};

  for (const key in doc) {
    if (doc.hasOwnProperty(key)) result[key as keyof T] = doc[key];
  }

  return result as T;
};
