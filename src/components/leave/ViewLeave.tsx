//from the admin
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import type { Leave } from "../../interface";

interface LeaveDetail {
    _id: string;
    employeeId: {
        _id: string;
        employeeId: string;
        userId: {
            name: string;
            profileImage: string;
        };
        department: {
            dep_name: string;
        };
    };
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: string;
}

const ViewLeave = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [leave, setLeave] = useState<LeaveDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchLeave = async () => {
        
        const token = localStorage.getItem("token")
        try {
            // Fetch leave data from API and set it to state
            const response = await axios.get(`http://localhost:3000/api/leave/detail/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data)
            if(response.data.success) {
               setLeave(response.data.leave)
            }
        } catch (error) {
            console.log(error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        } finally {
                setLoading(false);
            }
    }
    fetchLeave();
    }, [id])

    const changeStatus = async (id: string, status: any)  => {
        try {
             const token = localStorage.getItem("token")
            const response = await axios.put(`http://localhost:3000/api/leave/${id}`, {status}, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data)
            if(response.data.success) {
               navigate("/admin-dashboard/leaves")
            }
        } catch (error) {
             console.log(error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        }
    }


 if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (!leave) {
        return <div className="text-center mt-10">Employee not found</div>;
    }

  return (
     <>{leave ? (
     <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-8 text-center">Employee Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <img src={`http://localhost:3000/${leave.employeeId.userId.profileImage}`} alt="profile" className="rounded-full border w-72"/>
            </div>
        </div>
      <div>
        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">Name: </p>
            <p className="font-medium">{leave.employeeId.userId.name}</p>
        </div>

        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">Employee ID: </p>
            <p className="font-medium">{leave.employeeId.employeeId}</p>
        </div>

        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">Leave Type: </p>
            <p className="font-medium">{leave.leaveType}</p>
        </div>

        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">Reason: </p>
            <p className="font-medium">{leave.reason}</p>
        </div>

        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">Department: </p>
            <p className="font-medium">{leave.employeeId.department.dep_name}</p>
        </div>

        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">Start Date: </p>
            <p className="font-medium">{new Date(leave.startDate).toLocaleDateString()}</p>
        </div>

        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">End Date: </p>
            <p className="font-medium">{new Date(leave.endDate).toLocaleDateString()}</p>
        </div>

        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">{leave.status === "Pending" ? "Action" : "Status: "} </p>
            <p className="font-medium">{leave.status === "Pending" ? (
                <div className="flex space-x-2">
                    <button className="px-2 py-0.5 bg-teal-300 hover:bg-teal-400 rounded-md cursor-pointer" onClick={() => changeStatus(leave._id, "Approved")}>Approve</button>
                    <button className="px-2 py-0.5 bg-red-300 hover:bg-red-400 rounded-md cursor-pointer" onClick={() => changeStatus(leave._id, "Rejected")}>Reject</button>
            </div>) : 
            <span>{leave.status}</span>
            }</p>
        </div>
        
      </div>
    </div>
    ): <div>Loading... </div> }</>
  )
}

export default ViewLeave
