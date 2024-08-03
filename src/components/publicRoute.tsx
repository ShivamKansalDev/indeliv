// src/components/RequireNoAuth.tsx
import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "@/utils/helper";

export default function PublicRoute({ children }: { children: ReactElement }) {
  if (isLoggedIn()) {
    return <Navigate to="/dashboard/batches" replace />;
  }

  return children;
}
