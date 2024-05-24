import { Outlet } from "react-router-dom";
import "./logo-layout.scss";
import { ReactElement } from "react";
import { ReactComponent as LogoSvg } from "@/assets/svgs/logo.svg";

export default function LogoLayout() {
  return (
    <div className="logo-layout-component">
      <div className="left-container">
        <div className="small-logo">
          <img
            className="d-none d-lg-block position-absolute top-0 start-0 "
            src={"/assets/image/Group 9580.svg"}
            alt=""
          />
        </div>
        <div className="large-logo">
          <LogoSvg />
        </div>
      </div>
      <div className="right-container">
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
