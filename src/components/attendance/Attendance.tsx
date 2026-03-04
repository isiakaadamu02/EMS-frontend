import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import DataTable from "react-data-table-component"
import AttendanceHelper, { attColumns } from "../../utils/AttendanceHelper"

const Attendance = () => {
    const [attendance, setAttendance] = useState<any[]>([])
    const [loading, setLoading] = useState(false);
    const [filterAttendance, setFilterAttendance] = useState<any[]>([])

    const statusChange = () => {
        fetchAttendance()
    }

    const fetchAttendance = async () => {
        setLoading(true);
        const token = localStorage.getItem("token")
        try {
            // Fetch department data from API and set it to state
            const response = await axios.get("http://localhost:3000/api/attendance", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data)
            if(response.data.success) {
                let sno = 1;
                const data = await response.data.attendance?.map((att: any) => (
                    {
                        employeeId: att.employeeId.employeeId,
                        sno: sno++,
                        dep_name: att.employeeId.department?.dep_name || "Null",
                        name: att.employeeId.userId.name,
                        action: (<AttendanceHelper status={att.status} employeeId={att.employeeId.employeeId} statusChange={statusChange}/>),
                    }
                ))
                setAttendance(data)
                setFilterAttendance(data)
            }
        } catch (error) {
            console.log(error)
            console.error(" Error:", error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
    
    fetchAttendance();
    }, [])

    //to filter data on search based on dept name
    const handleFilterAttendance = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        const filteredData = attendance.filter(att => att.name.toLowerCase().includes(value))
        setFilterAttendance(filteredData)
    }

  return (
    <>
        {loading ? <p>Loading...</p> :
    <div className="p-5">
            <div className="text-center mb-2">
                <h3 className="text-2xl font-bold">Manage Attendance</h3>
            </div>

            <div className="flex justify-between items-center">
                <input type="text" placeholder="Search by Employee Name" onChange={handleFilterAttendance} className="px-4 py-0.5 border" />

                <p className="text-2xl">
                    Mark Employees for <span className="font-bold">{new Date().toISOString().split("T")[0]}{" "}</span>
                </p>

                <Link to="/admin-dashboard/attendance-report" className="px-4 py-1 bg-[#ff8349] rounded text-white">Attendance Report</Link>
            </div>

            <div className="mt-6">
                <DataTable columns={attColumns} data={filterAttendance.length > 0 ? filterAttendance : filterAttendance} pagination/>
            </div>
        </div>
}
</>
  )
}


export default Attendance
