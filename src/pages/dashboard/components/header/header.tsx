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
  setLoggedIn,
  user,
}: {
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
      className={`header-component d-flex justify-content-between align-items-center header navbar-expand-lg  ${
        lgOpen && "lg-open"
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
        onClick={() => setLgOpen((l) => !l)}
      >
        <div>
          <img
            // src="/assets/image/user-smile.png"
            src={user?.image_path}
            alt="User Avatar"
            className="user-avatar"
          />
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-organization">Organization</span>
          </div>
          <img
            className="logout-arrow"
            src="/assets/Icon/Down Arrow.svg"
            alt="User Avatar"
          />
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
            navigate("/login");
          }}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}
