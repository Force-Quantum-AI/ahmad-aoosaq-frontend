// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAppSelector } from "../store/hook";
// import { selectUser, selectToken } from "../store/features/auth/auth.slice";

// const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
//     const user = useAppSelector(selectUser);
//     console.log("user in---fo:",user);
    
//     const token = useAppSelector(selectToken);
//     const location = useLocation();
//     if (!user || !token) {
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }
    
    
//     if (children) {
//     return children;
//   }
//     return <Outlet />;
// };

// export default ProtectedRoute;

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hook";
import { selectUser, selectToken } from "../store/features/auth/auth.slice";

const ProtectedRoute = ({
  children,
  requireSuperAdmin = false,
}: {
  children?: React.ReactNode;
  requireSuperAdmin?: boolean;
}) => {
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const location = useLocation();

  //  Not logged in
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  //  SUPER ADMIN CHECK
  if (requireSuperAdmin && !user?.is_super_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  //  If user is super admin and accessing a regular protected route, redirect them to /super-admin
  if (!requireSuperAdmin && user?.is_super_admin && !location.pathname.startsWith("/super-admin")) {
    return <Navigate to="/super-admin" replace />;
  }

  if (children) return children;

  return <Outlet />;
};

export default ProtectedRoute;