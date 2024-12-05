import { IUser } from "./user.interface";

export interface IPost {
  title: string;
  thumbnail: string;
  prompt: string;
  video: string;
  $id: string;
  creator: IUser;
}
