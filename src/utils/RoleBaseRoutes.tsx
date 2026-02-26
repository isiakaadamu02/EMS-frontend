import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import type { RoleBaseRoutesProps } from "../interface";


const RoleBaseRoutes = ({children, requiredRole}: RoleBaseRoutesProps) => {
    const {user, loading} = useAuth();

    if(loading) {
        return <div>Loading... </div>
    }

     // Check if user exists first
    if (!user) {
        return <Navigate to="/login" />
    }


    if(!requiredRole.includes(user.role)) {
        return <Navigate to="/unauthorized" />
    }

    return <>{children}</>
}

export default RoleBaseRoutes