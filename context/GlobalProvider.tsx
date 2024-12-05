import { IUser } from "@/data/interfaces/user.interface";
import { getCurrentUser } from "@/lib/appwrite";
import React, { createContext, useContext, useEffect, useState } from "react";
import { IGlobalContext } from "./interface/global-context.interface";

const GlobalContext = createContext<IGlobalContext>({
  isLogged: false,
  loading: false,
  setIsLogged: (payload: boolean) => {},
  setUser: (payload: IUser | null) => {},
  user: null,
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        console.log(res);
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isLogged, setIsLogged, user, setUser, loading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
