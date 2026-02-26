import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext"


const PrivateRoutes = ({children}: any) => {
    const {user, loading} = useAuth();

    if(loading) {
        <div>Loading... </div>
    }

    return user ? children : <Navigate to="/login" />
}

export default PrivateRoutes