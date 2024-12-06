import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from "react-native-appwrite";
// interfaces
import { ISignUp } from "@/data/interfaces/sign-up.interface";
import { ISignIn } from "@/data/interfaces/sign-in.interface";
import { IUser } from "@/data/interfaces/user.interface";
// lib
import { convertDocument, convertMapDocuments } from "./converter";
import { IPost } from "@/data/interfaces/post.interface";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.devjs.aora",
  projectId: "6750d5820028d2107a26",
  databaseId: "6750d9c500274b4b6f9f",
  userCollectionId: "6750d9e50035ccd12895",
  videoCollectionId: "6750da04002f37f0235b",
  storageId: "6750dbbd00322ba7e1c0",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(endpoint) // Your Appwrite Endpoint
  .setProject(projectId) // Your project ID
  .setPlatform(platform); // Your application ID or bundle ID.

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register User
export const createUser = async ({
  email,
  password,
  username,
}: ISignUp): Promise<IUser> => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn({ email, password });

    const createdUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return convertDocument<IUser>(createdUser);
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new Error(error);
  }
};

// Sign In
export const signIn = async ({ email, password }: ISignIn) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    console.error("Error sign in:", error);
    throw new Error(error);
  }
};

// Sign Out
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    console.error("Error sign out:", error);
    throw new Error(error);
  }
};

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error: any) {
    console.error("Error get account:", error);
    throw new Error(error);
  }
}

// Get Current User
export const getCurrentUser = async (): Promise<IUser | null> => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return convertDocument<IUser>(currentUser.documents[0]);
  } catch (error) {
    console.error("Error get current user:", error);
    return null;
  }
};

// Get all video Posts
export const getAllPosts = async (): Promise<IPost[]> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);

    return convertMapDocuments<IPost>(posts.documents);
  } catch (error: any) {
    console.error("Error get all posts:", error);
    throw new Error(error);
  }
};

// Get latest created video posts
export const getLatestPosts = async (): Promise<IPost[]> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(7),
    ]);

    return convertMapDocuments<IPost>(posts.documents);
  } catch (error: any) {
    console.error("Error get latests posts:", error);
    throw new Error(error);
  }
};

// Get video posts that matches search query
export const searchPosts = async (query: string): Promise<IPost[]> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);

    if (!posts) throw new Error("Something went wrong");

    return convertMapDocuments<IPost>(posts.documents);
  } catch (error: any) {
    console.error("Error search posts:", error);
    throw new Error(error);
  }
};

// Get video posts created by user
export const getUserPosts = async (userId: string): Promise<IPost[]> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
    ]);

    return convertMapDocuments<IPost>(posts.documents);
  } catch (error: any) {
    console.error("Error user posts:", error);
    throw new Error(error);
  }
};

// Create Video Post
export async function createVideoPost(form: any) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error: any) {
    console.error("Error create video post:", error);
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file: any, type: any) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error: any) {
    console.error("Error upload file:", error);
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId: any, type: any) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error: any) {
    console.error("Error get file preview:", error);
    throw new Error(error);
  }
}
