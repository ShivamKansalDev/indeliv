import React, { SetStateAction, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.scss";
import { useLogoutMutation } from "@/state/slices/authApiSlice";
import User from "@/types/User";
import {clearState} from "@/state/slices/invoices/invoicesSlice";
import {useAppDispatch} from "@/state/hooks";
import { LoginUserContext } from "@/App";

interface HeaderProps {
  isShow?: boolean;
  setIsShow: Function;
}
export default function Header({
  setOpenNav,
  setLoggedIn,
  user,
}: {
  setOpenNav: React.Dispatch<SetStateAction<boolean>>;
  setLoggedIn: React.Dispatch<SetStateAction<boolean>>;
  user?: any;
}) {
  const context = useContext(LoginUserContext)
  const [lgOpen, setLgOpen] = useState(false);
  const [logout, { isSuccess, isLoading, isError }] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <nav
      className={`header-component d-flex justify-content-between align-items-center header navbar-expand-lg  ${lgOpen && "lg-open"
        }`}
    >
      <Link className="navbar-brand" to="/dashboard">
        <img
          src={"/assets/image/Group 9580.svg"}
          alt="Logo"
          height="30"
          width="137"
        />
      </Link>
      <div
        className={`user-container ${lgOpen && "lg-open"}`}
        onClick={() => { setLgOpen((l) => !l); if (lgOpen) setOpenNav(false) }}
      >
        <div className="justify-content-between">
          <div className="d-flex gap-3 align-items-center">
            <img
              // src="/assets/image/user-smile.png"
              src={user?.image_path}
              alt="User Avatar"
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-organization">{user?.role_name}</span>
            </div>
          </div>
          {/* <img
            className="logout-arrow"
            src="/assets/Icon/Down Arrow.svg"
            alt="User Avatar"
          /> */}
          <svg className="logout-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5999 7.4585L11.1666 12.8918C10.5249 13.5335 9.4749 13.5335 8.83324 12.8918L3.3999 7.4585" stroke="#667085" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <button
          className="logout-btn"
          onClick={async () => {
            dispatch(clearState());
            localStorage.removeItem("scrollPosition");
            await logout();
            setLoggedIn(false);
            context?.setAuthContext("");
            context?.setLoginUserData({});
            navigate("/");
          }}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}
