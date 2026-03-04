import axios from "axios";

interface AttendanceHelperProps {
  status: string | null;
  employeeId: string;
  statusChange: () => void;
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
        width: "200px"
    },
    {
        name: "Emp ID",
        selector: (row: any) => row.employeeId,
        sortable: true,
        width: "200px"
    },
    {
        name: "Department",
        selector: (row: any) => row.dep_name,
        sortable: true,
        width: "200px"
    },
    
    {
        name: "Action",
        selector: (row: any) => row.action,
        center: true,
    }
]


const AttendanceHelper = ({ status, employeeId, statusChange }: AttendanceHelperProps) => {

    const markEmployee = async (status: string, employeeId: string) => {
        const token = localStorage.getItem("token")
        try {
            const response = await axios.put(`http://localhost:3000/api/attendance/update/${employeeId}`, {status}, {
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
      {status == null ? (
        <div className="gap-2 flex">
            <button onClick={() => markEmployee("present", employeeId)} className="px-4 py-2 bg-green-500 text-white rounded-md cursor-pointer">Present</button>
            <button onClick={() => markEmployee("absent", employeeId)} className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer">Absent</button>
            <button onClick={() => markEmployee("sick", employeeId)} className="px-4 py-2 bg-gray-500 text-white rounded-md cursor-pointer">Sick</button>
            <button onClick={() => markEmployee("leave", employeeId)} className="px-4 py-2 bg-yellow-500 text-white rounded-md cursor-pointer">Leave</button>
        </div>
      ) : (
        <p>{status}</p>
      )}
    </div>
  )
}

export default AttendanceHelper
