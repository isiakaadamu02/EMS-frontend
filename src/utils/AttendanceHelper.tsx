import axios from "axios";

interface AttendanceHelperProps {
  status: string | null;
  employeeId: string;
  statusChange: () => void;
  date: string
}

export const attColumns = [
    {
        name: "S No",
        selector: (row: any) => row.sno,
        width: "70px"
    },
    {
        name: "Name",
        selector: (row: any) => row.name,
        sortable: true,
        width: "150px"
    },
    {
        name: "Emp ID",
        selector: (row: any) => row.employeeId,
        sortable: true,
        width: "100px"
    },
    {
        name: "Department",
        selector: (row: any) => row.dep_name,
        sortable: true,
        width: "180px"
    },
    { 
        name: 'Clock In', 
        selector: (row: any) => row.clockIn, 
        width: '100px' 
    },
    { 
        name: 'Clock Out', 
        selector: (row: any) => row.clockOut, 
        width: '100px' 
    },
    { 
        name: 'Total Hours', 
        selector: (row: any) => row.totalHours, 
        width: '100px' },
    {
        name: "Action",
        selector: (row: any) => row.action,
        center: true,
    }
]


const AttendanceHelper = ({ status, employeeId, statusChange, date }: AttendanceHelperProps) => {

    const markEmployee = async (status: string, employeeId: string, date: string) => {
        const token = localStorage.getItem("token")
        try {
            const response = await axios.put(`http://localhost:3000/api/attendance/update/${employeeId}`, {status, date}, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data.success);
            if(response.data.success) {
            // notify parent that status has changed
            statusChange();
            }
        } catch (error) {
            console.log(error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        }
    }

    
  return (
    <div>
      {status == null || status === "Not Marked" ? (
        <div className="gap-2 flex">
            <button onClick={() => markEmployee("present", employeeId, date)} className="px-4 py-2 bg-green-500 text-white rounded-md cursor-pointer">Present</button>
            <button onClick={() => markEmployee("absent", employeeId, date)} className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer">Absent</button>
            <button onClick={() => markEmployee("sick", employeeId, date)} className="px-4 py-2 bg-gray-500 text-white rounded-md cursor-pointer">Sick</button>
            <button onClick={() => markEmployee("leave", employeeId, date)} className="px-4 py-2 bg-yellow-500 text-white rounded-md cursor-pointer">Leave</button>
        </div>
      ) : (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            status === 'Present' ? 'bg-green-100 text-green-700' :
            status === 'Absent' ? 'bg-red-100 text-red-700' :
            status === 'Sick' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
                {status}
            </span>
      )}
    </div>
  )
}

export default AttendanceHelper
