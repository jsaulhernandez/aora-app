import { Models } from "react-native-appwrite";

export const convertDocument = <T>(doc: Models.Document): T => {
  const result: Partial<T> = {};

  for (const key in doc) {
    if (doc.hasOwnProperty(key)) result[key as keyof T] = doc[key];
  }

  return result as T;
};

export const convertMapDocuments = <T>(documents: Models.Document[]): T[] => {
  return documents.map((element) => {
    const result: Partial<T> = {};
    for (const key in element) {
      if (Object.prototype.hasOwnProperty.call(element, key))
        result[key as keyof T] = element[key];
    }

    return result as T;
  });
};
