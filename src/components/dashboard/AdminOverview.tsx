import { FaBuilding, FaCheckCircle, FaFileAlt, FaHourglassHalf, FaTimesCircle, FaUsers } from "react-icons/fa"
import OverviewCard from "./OverviewCard"
import { useEffect, useState } from "react"
import axios from "axios"

interface dashboard {
    totalEmployees: number;
    totalDepartments: number;
    totalSalary: number;
    leaveSummary: {
        appliedFor: number
        approved: number
        pending: number
        rejected: number
    }
}


const AdminOverview = () => {
    const [summary, setSummary] = useState<dashboard>()

    useEffect(() => {
        const fetchSummary = async () => {
        const token = localStorage.getItem("token")
        try {
            const resp = await axios.get("https://ems-server-cyan.vercel.app/api/dashboard/summary", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(resp.data)
            setSummary(resp.data)       
        } catch (error) {
            console.log(error)
            if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                alert(error.response.data.error)
            }
        }
        }
        fetchSummary()
    }, [])

    if(!summary) {
        return <div>Loading... </div>
    }

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold">Dashboard Overview</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <OverviewCard icon={<FaUsers />} text="Total Employees" number= {summary.totalEmployees} color="bg-[#ff8349]"/>
                <OverviewCard icon={<FaBuilding />} text="Total Departments" number= {summary.totalDepartments} color="bg-yellow-600"/>
                <OverviewCard icon={<FaBuilding />} text="Monthly Payroll" number= {summary.totalSalary} color="bg-red-600"/>
            </div>

            <div className="mt-12">
                <h4 className="text-center text-2xl font-bold">Leave Details</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <OverviewCard icon={<FaFileAlt />} text="Leave Applied" number= {summary.leaveSummary.appliedFor} color="bg-[#030303]"/>
                <OverviewCard icon={<FaCheckCircle />} text="Leave Approved" number= {summary.leaveSummary.approved} color="bg-green-600"/>
                <OverviewCard icon={<FaHourglassHalf />} text="Leave Pending" number= {summary.leaveSummary.pending} color="bg-yellow-600"/>
                <OverviewCard icon={<FaTimesCircle />} text="Leave Rejected" number= {summary.leaveSummary.rejected} color="bg-red-600"/>
                </div>
            </div>
        </div>
    )
}

export default AdminOverview