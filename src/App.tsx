// import { Provider } from "react-redux";
// import MyRouter from "./routes";
// import { store } from "./state/store";
import { createContext, useEffect, useState } from "react";
import { useGetUserMutation } from "./state/slices/authApiSlice";
import { TOKEN_STORAGE } from "./utils/constants";
import RoutesSimple from "./routes_simple";

interface LoginUserContextType {
  authContext: string;
  loginUserData: {
    id?: number;
    name?: string;
    email?: string;
    role_name?: string;
  };
  setLoginUserData: React.Dispatch<React.SetStateAction<{
    id?: number;
    name?: string;
    email?: string;
    role_name?: string;
  }>>;
  setAuthContext: (value: string) => void;
}

interface User {
  id?: number;
  name?: string;
  email?: string;
  role_name?: string;
  isLogin?: boolean;
}

export const LoginUserContext = createContext<LoginUserContextType | undefined>(undefined);

function App() {
  const [authContext, setAuthContext] = useState<string>("");
  const [loginUserData, setLoginUserData] = useState<User>({});
  const [getUser, { data, isSuccess }] = useGetUserMutation();
  const authToken = localStorage.getItem(TOKEN_STORAGE);

  useEffect(() => {
    if (Boolean(authToken) && !Boolean(loginUserData?.role_name)) {
      getUser();
    }
  }, [authToken])

  useEffect(() => {
    if (data && isSuccess) {
      setLoginUserData({ ...data });
    }
  }, [data])


  return (
    <div className="App">
      <LoginUserContext.Provider value={{ authContext, setAuthContext, loginUserData, setLoginUserData }}>
        {/* <MyRouter /> */}
        <RoutesSimple />
      </LoginUserContext.Provider>
    </div>
  );
}

export default App;
