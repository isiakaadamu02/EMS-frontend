import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Employee } from "../../interface";
import axios from "axios";
import { fetchDepartments } from "../../utils/EmployeeHelper";


const EditEmployee = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [departments, setDepartments] = useState<any[]>([])
    // const [loading, setLoading] = useState(true);

     useEffect(() => {
            const getDepartments = async () => {
                const departments = await fetchDepartments();
                console.log("🔍 Fetched departments:", departments);
                setDepartments(departments || [])
            }
            getDepartments()
        }, [])

      useEffect(() => {
        const fetchEmployees = async () => {
        
        const token = localStorage.getItem("token")
        try {
            // Fetch employee data from API and set it to state
            const response = await axios.get(`http://localhost:3000/api/employee/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data)
            if(response.data.success) {
               setEmployee(response.data.employee)
            }
        } catch (error) {
            console.log(error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        } 
    }
    fetchEmployees();
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target
        
        if (!employee) return;

        // Handle nested userId fields (name)
        if (name === "name") {
            setEmployee({
                ...employee,
                userId: {
                    ...employee.userId,
                    name: value
                }
            });
        } 
          //Handle department specially to maintain object structure
        else if (name === "department") {
            setEmployee({
                ...employee,
                department: {
                    ...employee.department,
                    _id: value
                }
            });
        } else {
            // Handle top-level employee fields
            setEmployee({
                ...employee,
                [name]: value
            });
        }
        
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!employee) return;

        const updateData = {
            name: employee.userId.name,
            maritalStatus: employee.maritalStatus,
            designation: employee.designation,
            salary: employee.salary,
            department: employee.department._id
        }

        console.log("Sending update data:", updateData);

        const token = localStorage.getItem("token")
            try {
                const response = await axios.put(`http://localhost:3000/api/employee/${id}`, updateData, {
                    headers: {
                        "Authorization" : `Bearer ${token}` 
                    }
                })
                if(response.data.success) {
                    navigate("/admin-dashboard/employees")
                }
            } catch (error) {
                console.log(error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        } 
        // finally {
        //         setLoading(false)
        //     }
    }

    // if (loading) {
    //     return <div className="text-center mt-10">Loading...</div>
    // }

    if (!employee) {
        return <div className="text-center mt-10">Employee not found</div>
    }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>
        <form action="" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* name */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" value={employee?.userId.name || ""} onChange={handleChange} placeholder="Insert Name" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            {/* marital status */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Marital Status</label>
                <select name="maritalStatus" value={employee?.maritalStatus || ""} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required>
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                </select>
            </div>

            {/* Designation */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Designation</label>
                <input type="text" name="designation" value={employee?.designation || ""} onChange={handleChange} placeholder=" Designation" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            {/* Salary */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Salary</label>
                <input type="number" name="salary" value={employee?.salary || ""} onChange={handleChange} placeholder="Salary" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            {/* Department */}
            <div className="col-span-2">
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Department</label>
                <select name="department" id="" value={employee.department._id} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required>
                    <option value="">Select Department</option>
                    {departments.map(dep => (
                        <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                    ))}
                    
                </select>
            </div>

            </div>

            <button type="submit" className="mt-6 bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 font-bold py-2 ">Edit Employee</button>

        </form>
      
    </div>
  )
}

export default EditEmployee
