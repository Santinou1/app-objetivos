import { Navigate, Outlet } from "react-router-dom"

export function ProtectedRoute({children, isAllowed}){
    if (!isAllowed){
        return <Navigate to={"/"}></Navigate>;
    }
    return children ? children : <Outlet /> 
}