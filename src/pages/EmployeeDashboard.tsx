import { Outlet } from "react-router-dom"
import Navbar from "../components/dashboard/Navbar"
import EmpSidebar from "../components/empDashboard/EmpSidebar"
// import EmployeeOverview from "../components/empDashboard/EmpOverview"

const EmployeeDashboard = () => {

    return (
        <div className="flex">
            <EmpSidebar />
            <div className="flex-1 ml-64 bg-gray-100 h-screen">
                <Navbar />
                <Outlet />
                {/* <EmployeeOverview /> */}
            </div>
            
            
        </div>
    )
}

export default EmployeeDashboard