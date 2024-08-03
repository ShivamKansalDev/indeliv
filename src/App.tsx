// import { Provider } from "react-redux";
// import MyRouter from "./routes";
// import { store } from "./state/store";
import { createContext, useEffect, useState } from "react";
import { useGetUserMutation, useLogoutMutation } from "./state/slices/authApiSlice";
import { TOKEN_STORAGE } from "./utils/constants";
import RoutesSimple from "./routes_simple";

interface LoginUserContextType {
  authContext: string;
  emailOrPhone: string;
  loginUserData: {
    id?: number;
    name?: string;
    email?: string;
    role_name?: string;
    role?: any;
  };
  setLoginUserData: React.Dispatch<React.SetStateAction<{
    id?: number;
    name?: string;
    email?: string;
    role_name?: string;
  }>>;
  setAuthContext: (value: string) => void;
  setEmailOrPhone: (value: string) => void;
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
  const [emailOrPhone, setEmailOrPhone] = useState<string>("");
  const [loginUserData, setLoginUserData] = useState<User>({});
  const [getUser, { data, isSuccess }] = useGetUserMutation();
  const authToken = localStorage.getItem(TOKEN_STORAGE);
  const [logout] = useLogoutMutation();

  const fetchUser = async () => {
     const { error }: any = await getUser();
     if(error) {
      logout()
     }

  }
  useEffect(() => {
    if (Boolean(authToken) && !Boolean(loginUserData?.role_name)) {
      fetchUser();
    }
  }, [authToken])

  useEffect(() => {
    if (data && isSuccess) {
      setLoginUserData({ ...data });
    }
  }, [data])


  return (
    <div className="App">
      <LoginUserContext.Provider value={{ authContext, setAuthContext, emailOrPhone, setEmailOrPhone, loginUserData, setLoginUserData }}>
        {/* <MyRouter /> */}
        <RoutesSimple />
      </LoginUserContext.Provider>
    </div>
  );
}

export default App;
