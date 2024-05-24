// src/components/PrivateRoute.tsx
import { ReactElement } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { isLoggedIn } from "@/utils/helper";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PrivateRoute({ children }: { children: ReactElement }) {
  // if (!isLoggedIn()) {
  //   return <Navigate to="/login" replace />;
  // }
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
}
