//employee list
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { useAuth } from "../../context/authContext";
import type { Leave } from "../../interface";



const LeaveList = () => {
    // const [loading, setLoading] = useState(true);
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const {user} = useAuth();
    // const {empId} = useParams();
    const {id} = useParams();
    // const id = user?.role === "admin" ? user._id : empId
    // Use id from URL if exists (admin view), otherwise user._id (employee view)
    const targetId = id || user?._id;

    const fetchLeaves = async () => {
         if (!targetId) {
            console.log(" No target ID available");
            return;
        }

        // setLoading(true);
        const token = localStorage.getItem("token")
        try {
            // Fetch employee data from API and set it to state
            const response = await axios.get(`http://localhost:3000/api/leave/${targetId}/${user?.role}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
             console.log("Leave data:", response.data)
            console.log(response.data)
            if(response.data.success) {
               setLeaves(response.data.leaves)
            //    setFilteredLeaves(response.data.leaves)
            }
        } catch (error) {
            console.log(error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        } 
        // finally {
        //     setLoading(false); 
        // }

    }

    useEffect(() => {
        fetchLeaves();
    }, [id]);

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Leaves</h3>
      </div>

      <div className="flex justify-between items-center">
        <input type="text" placeholder="Search by Dep Name" className="px-4 py-0.5 border"/>
        {user?.role === "employee" && 
        <Link to="/employee-dashboard/add-leave" className="px-4 py-1 bg-[#ff8349] rounded text-white">Add New Leave</Link>
        }
        </div>

        <table className="w-full text-sm text-left text-gray-500 mt-6">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
                    <tr>
                        <th className="px-6 py-3">SNO</th>
                        <th className="px-6 py-3">LEAVE TYPE</th>
                        <th className="px-6 py-3">FROM</th>
                        <th className="px-6 py-3">TO</th>
                        <th className="px-6 py-3">DESCRIPTION</th>
                        <th className="px-6 py-3">APPLIED DATE</th>
                        <th className="px-6 py-3">STATUS</th>
                    </tr>
                </thead>

                <tbody>
                    {leaves.map((leave, index) => (
                        <tr key={leave._id} className="bg-white norder-b dark:bg-gray-800 dark:border-gray-700">
                            {/* <td className="px-6 py-3">{sno++}</td> */}
                            <td className="px-6 py-3">{index + 1}</td>
                            {/* <td className="px-6 py-3">{leave.employeeId}</td> */}
                           <td className="px-6 py-3">{leave.leaveType}</td>
                           
                            <td className="px-6 py-3">{new Date(leave.startDate).toLocaleDateString()}</td>
                            <td className="px-6 py-3">{new Date(leave.endDate).toLocaleDateString()}</td>
                            <td className="px-6 py-3">{leave.reason}</td>
                            <td className="px-6 py-3">{new Date(leave.appliedAt).toLocaleDateString()}</td>
                            <td className="px-6 py-3">{leave.status}</td>
                           
                        </tr>
                    ))}
                </tbody>
            </table>
      
    </div>
  )
}

export default LeaveList;
