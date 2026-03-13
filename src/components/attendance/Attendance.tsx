import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import DataTable from "react-data-table-component"
import AttendanceHelper, { attColumns } from "../../utils/AttendanceHelper"

const Attendance = () => {
    const [attendance, setAttendance] = useState<any[]>([])
    const [loading, setLoading] = useState(false);
    const [filterAttendance, setFilterAttendance] = useState<any[]>([])
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const statusChange = () => {
        fetchAttendance()
    }

    const fetchAttendance = async () => {
        setLoading(true);
        const token = localStorage.getItem("token")
        try {
            // Fetch department data from API and set it to state
            const response = await axios.get(`https://ems-server-cyan.vercel.app/api/attendance?date=${selectedDate}`, {
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
                        clockIn: att.clockIn ? new Date(att.clockIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                        clockOut: att.clockOut ? new Date(att.clockOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                        totalHours: att.totalHours ? `${att.totalHours.toFixed(2)} hrs` : '0.00 hrs',
                        shiftStart: att.employeeId?.shiftStartTime || 'N/A',
                    shiftEnd: att.employeeId?.shiftEndTime || 'N/A',
                    estimatedHours: att.employeeId?.estimatedWorkHours ? `${att.employeeId.estimatedWorkHours.toFixed(2)} hrs` : '0.00 hrs',
                    
                    difference: att.totalHours && att.employeeId?.estimatedWorkHours 
                        ? ((att.totalHours - att.employeeId.estimatedWorkHours >= 0 ? '+' : '') + 
                           (att.totalHours - att.employeeId.estimatedWorkHours).toFixed(2) + ' hrs')
                        : '0.00 hrs',
                        action: (<AttendanceHelper status={att.status} employeeId={att.employeeId.employeeId} statusChange={statusChange} date={selectedDate}/>),
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
    }, [selectedDate])

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

                {/* Date Picker */}
                <div className="flex items-center gap-3">
                    <label className="font-semibold text-gray-700">Select Date:</label>
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border rounded"
                    />
                </div>

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
