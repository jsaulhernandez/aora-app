export interface IPost {
  title: string;
  thumbnail: string;
  prompt: string;
  video: string;
  $id: string;
  creator: {
    username: string;
    avatar: string;
  };
}
