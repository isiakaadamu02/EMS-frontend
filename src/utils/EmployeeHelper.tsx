import axios from "axios"
import { useNavigate } from "react-router-dom"

export const empColumns = [
    {
        name: "S No",
        selector: (row: any) => row.sno,
        width: "70px"
    },
    {
        name: "Name",
        selector: (row: any) => row.name,
        sortable: true,
        width: "100px"
    },
    {
        name: "Image",
        selector: (row: any) => row.profileImage,
        sortable: true,
        width: "90px"
    },
    {
        name: "Department",
        selector: (row: any) => row.dep_name,
        sortable: true,
        width: "120px"
    },
    {
        name: "DOB",
        selector: (row: any) => row.dob,
        sortable: true,
        width: "130px"
    },
    {
        name: "Action",
        selector: (row: any) => row.action,
        center: true,
    }
]

export const fetchDepartments = async () => {
    let departments
        const token = localStorage.getItem("token")
        try {
            // Fetch department data from API and set it to state
            const response = await axios.get("https://ems-server-cyan.vercel.app/api/department", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if(response.data.success) {
                return response.data.departments
            }
            // return [] //Return empty array if not success
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && !error.response.data.error) {
                alert(error.response.data.error)
            }
            // return []
        } 
        return departments;
    }

// employees for salary form
export const fetchEmployees = async (id: any) => {
    let employees
        const token = localStorage.getItem("token")
        try {
            // Fetch department data from API and set it to state
            const response = await axios.get(`http://localhost:3000/api/employee/department/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if(response.data.success) {
                return response.data.employees
            }
            
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && !error.response.data.error) {
                alert(error.response.data.error)
            }
          
        } 
        return employees;
    }

export const EmployeeButtons = ({_id}: any) => {
    const navigate = useNavigate();

    return (
        <div className="flex space-x-3">
            <button className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer" onClick={() => navigate(`/admin-dashboard/employees/${_id}`)}>View</button>
            <button className="px-3 py-1 bg-teal-500 text-white rounded cursor-pointer" onClick={() => navigate(`/admin-dashboard/employees/edit/${_id}`)}>Edit</button>
            <button className="px-3 py-1 bg-yellow-500 text-white rounded cursor-pointer" onClick={() => navigate(`/admin-dashboard/employees/salary/${_id}`)}>Salary</button>
            <button className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer" onClick={() => navigate(`/admin-dashboard/employees/leaves/${_id}`)}>Leave</button>
        </div>
    )
}