import "./dashboard.scss";
import Sidebar from "@/pages/dashboard/components/sidebar/sidebar";
import Header from "@/pages/dashboard/components/header/header";
import React, { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { isLoggedIn } from "@/utils/helper";
import { useGetUserMutation, useLogoutMutation } from "@/state/slices/authApiSlice";
import permissions from "@/ennum/permission";
import { TOKEN_STORAGE } from "@/utils/constants";
import { LoginUserContext } from "@/App";
import { ReactComponent as Loading } from "@/assets/svgs/loading.svg";
import { Helmet } from "react-helmet";

interface User {
  id?: number;
  name?: string;
  email?: string;
  role_name?: string;
  role?: any;
}
export default function Dashboard() {
  const context = useContext(LoginUserContext)
  const [openNav, setOpenNav] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn());
  const [getUser, { data, isSuccess }] = useGetUserMutation();
  const [userData, setUserData] = useState<User>({});
  const [logout, { isSuccess: logoutSuccess, isLoading, isError }] = useLogoutMutation();

  const location = useLocation()
  let navigate = useNavigate();
  // console.log(loggedIn, "login---->>>>")
  const authToken = localStorage.getItem(TOKEN_STORAGE);
  const checkAuth = async () => {
    if (!authToken) {
      // console.log("logout");
      await logout();
      context?.setAuthContext("");
      context?.setLoginUserData({});
      navigate("/");
    }
  };


  useEffect(() => {
    if (!Boolean(authToken)) {
      // console.log("runing........", authToken)
      // getUser();
      checkAuth();
    }
  }, [authToken]);

  useEffect(() => {
    if (context?.loginUserData && context?.loginUserData?.role_name) {
      setUserData({ ...context?.loginUserData }); // Update state when data is available
    }
  }, [context]);

  // router---
  useEffect(() => {
    // console.log(context?.loginUserData, location?.pathname, "called")
    if (userData?.role_name && (location?.pathname == "" || location?.pathname == "/dashboard")) {
      // console.log(userData?.role_name, "asff")
      if (userData?.role?.permissions?.every((per: any) => per?.name.includes(permissions?.delivery))) {
        // console.log(userData?.role_name, "batches")
        navigate("/dashboard/delivery/associates");
      }
      else if (userData?.role?.permissions?.every((per: any) => per?.name.includes(permissions?.collection))) {
        // console.log(userData?.role_name, "collcetion")
        navigate("/dashboard/collection/associates");
      }
      else if(userData?.role?.permissions?.some((per: any) => per?.name.includes("batches"))){
        // console.log(userData?.role_name, "invoices")
        navigate("/dashboard/batches");
      }
      else if(userData?.role?.permissions?.some((per: any) => per?.name.includes("invoice"))){
        // console.log(userData?.role_name, "invoices")
        navigate("/dashboard/invoices");
      }
      else if(userData?.role?.permissions?.some((per: any) => per?.name.includes("delivery"))){
        // console.log(userData?.role_name, "invoices")
        navigate("/dashboard/delivery/associates");
      }
      else if(userData?.role?.permissions?.some((per: any) => per?.name.includes("collection"))){
        // console.log(userData?.role_name, "invoices")
        navigate("/dashboard/collection/associates");
      }
      else{
        navigate("/dashboard");
      }
    }
  }, [userData?.role_name, location?.pathname]);

  // useEffect(() => {
  //   // console.log(context?.loginUserData, location?.pathname, "called")
  //   if (userData?.role_name && (location?.pathname == "" || location?.pathname == "/dashboard")) {
  //     // console.log(userData?.role_name, "asff")
  //     if (userData?.role?.permissions?.every((per: any) => per?.name.includes(permissions?.delivery))) {
  //       // console.log(userData?.role_name, "batches")
  //       navigate("/dashboard/batches/delivery_associates");
  //     }
  //     else if (userData?.role?.permissions?.every((per: any) => per?.name.includes(permissions?.collection))) {
  //       // console.log(userData?.role_name, "collcetion")
  //       navigate("/dashboard/batches/collections_associates");
  //     }
  //     else {
  //       // console.log(userData?.role_name, "invoices")
  //       navigate("/dashboard/invoices");
  //     }
  //   }
  // }, [userData?.role_name, location?.pathname]);
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];
  const formattedSubdomain = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
  return (
    <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>{ formattedSubdomain }</title>
    </Helmet>
      {
        userData?.role_name ?
          <div className={`dashboard-layout-component ${openNav && "open"}`}>
            {/* <div className="header"> */}
            <Header user={userData} setLoggedIn={setLoggedIn} setOpenNav={setOpenNav} />
            {/* </div> */}
            <div className="d-flex  ">
              {
                (Boolean(userData)) &&
                  userData?.role?.permissions?.every((per: any) => per?.name.includes(permissions?.delivery)) ||
                  userData?.role?.permissions?.every((per: any) => per?.name.includes(permissions?.collection))
                  ?
                  <></>
                  :
                  <div className="side-bar col-4">
                    <Sidebar setOpenNav={setOpenNav} />
                  </div>
              }
              <div
                className="flex-grow-1 dashboard-content-container"
                onMouseDown={() => setOpenNav(false)}
              >
                {
                  location?.pathname?.includes("otp_hold") || location?.pathname?.includes("upload_image") || location?.pathname?.includes("payment_collection") ?
                    <div className="">
                      <div className="">
                        <Outlet context={{ setOpenNav } satisfies ContextType} />
                      </div>
                    </div> :
                    <div className={`${location?.pathname?.includes("dashboard/employees/roles") ? "invoice-component border-0 bg-transparent shadow-none" : "invoice-component"}`}>
                      <div className="content">
                        <Outlet context={{ setOpenNav } satisfies ContextType} />
                      </div>
                    </div>
                }
              </div>
            </div>
          </div>
          : <>
            <div style={{ height: "100vh" }} className="d-flex justify-content-center align-items-center">
              <div>
                <Loading className="loadingCircle" />
              </div>
            </div>
          </>
      }
    </>
  );
}

type ContextType = {
  setOpenNav: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useSetOpenNav() {
  return useOutletContext<ContextType>();
}
