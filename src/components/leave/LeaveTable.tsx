//from the admin
import axios from "axios"
import { useEffect, useState } from "react"
// import { Link } from "react-router-dom"
import type { Leave } from "../../interface"
import { LeaveButtons, leaveColumns } from "../../utils/LeaveHelper"
import DataTable from "react-data-table-component"

const LeaveTable = () => {
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [filteredLeaves, setFilteredLeaves] = useState<Leave[]>([])

    const fetchLeaves = async () => {
        const token = localStorage.getItem("token")
         try {
            
            const response = await axios.get("https://ems-server-cyan.vercel.app/api/leave", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data)
            if(response.data.success) {
                let sno = 1;
                const data = await response.data.leaves?.map((leave: any) => (
                    {
                        _id: leave._id,
                        sno: sno++,
                        employeeId: leave.employeeId.employeeId,
                        name: leave.employeeId.userId.name,
                        leaveType: leave.leaveType,
                        department: leave.employeeId.department.dep_name,
                        days: new Date(leave.startDate).getDate() - new Date(leave.endDate).getDate(),
                        status: leave.status,
                        action: (<LeaveButtons Id={leave._id} />),
                    }
                ))
                setLeaves(data)
                setFilteredLeaves(data)
            }
        } catch (error) {
            console.log(error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        } 
    }

    useEffect(() => {
        fetchLeaves();
    }, [])

    const filterByInput = (e: any) =>  {
        const data = leaves.filter(leave => leave.employeeId.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredLeaves(data)
    };

    const filterByButton = (status: string) =>  {
        const data = leaves.filter(leave => leave.status.toLowerCase().includes(status.toLowerCase())
    );
    setFilteredLeaves(data)
    };


  return (
    <>
    {filteredLeaves ? (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Leaves</h3>
      </div>

      <div className="flex justify-between items-center">
        <input type="text" placeholder="Search by ID" className="px-4 py-0.5 border" onChange={filterByInput}/>

        <div className="space-x-3">
            <button className="px-2 py-1 bg-teal-700 text-white hover:bg-teal-700 rounded-md cursor-pointer" onClick={() => filterByButton("Pending")}>Pending</button>
            <button className="px-2 py-1 bg-teal-700 text-white hover:bg-teal-700 rounded-md cursor-pointer" onClick={() => filterByButton("Approved")}>Approved</button>
            <button className="px-2 py-1 bg-teal-700 text-white hover:bg-teal-700 rounded-md cursor-pointer" onClick={() => filterByButton("Rejected")}>Rejected</button>
        </div>
        {/* <Link to="/employee-dashboard/add-leave" className="px-4 py-1 bg-[#ff8349] rounded text-white">Add New Leave</Link> */}
        </div>

        <div className="mt-3">
        <DataTable columns={leaveColumns} data={filteredLeaves} pagination />
        </div>
    </div>
    ) : <div>Loading... </div>}
    </>
  )
}

export default LeaveTable
