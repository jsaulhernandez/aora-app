import { IUser } from "@/data/interfaces/user.interface";

export interface IGlobalContext {
  user: IUser | null;
  loading: boolean;
  isLogged: boolean;
  setUser: (payload: IUser | null) => void;
  setIsLogged: (payload: boolean) => void;
}
