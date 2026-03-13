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
    const [loading, setLoading] = useState(true);

    const [estimatedHours, setEstimatedHours] = useState<number>(8);

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
            const response = await axios.get(`https://ems-server-cyan.vercel.app/api/employee/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data)
            if(response.data.success) {
               setEmployee(response.data.employee)

               // ✅ Calculate initial estimated hours if shift times exist
                    if (response.data.employee.shiftStartTime && response.data.employee.shiftEndTime) {
                        const hours = calculateHours(
                            response.data.employee.shiftStartTime,
                            response.data.employee.shiftEndTime
                        );
                        setEstimatedHours(hours);
                    }
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
    fetchEmployees();
    }, [])

    // Calculate hours when shift times change
    useEffect(() => {
        if (employee?.shiftStartTime && employee?.shiftEndTime) {
            const hours = calculateHours(employee.shiftStartTime, employee.shiftEndTime);
            setEstimatedHours(hours);
        }
    }, [employee?.shiftStartTime, employee?.shiftEndTime]);

    // Helper function to calculate hours
    const calculateHours = (startTime: string, endTime: string): number => {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        
        let diffMinutes = endMinutes - startMinutes;
        if (diffMinutes < 0) {
            diffMinutes += 24 * 60; // Handle overnight shifts
        }
        
        return diffMinutes / 60;
    };

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
            department: employee.department._id,
             shiftStartTime: employee.shiftStartTime, 
            shiftEndTime: employee.shiftEndTime, 
        }

        console.log("Sending update data:", updateData);

        const token = localStorage.getItem("token")
            try {
                const response = await axios.put(`https://ems-server-cyan.vercel.app/api/employee/${id}`, updateData, {
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
            <div className="">
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Department</label>
                <select name="department" id="" value={employee.department?._id} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required>
                    <option value="">Select Department</option>
                    {departments.map(dep => (
                        <option key={dep._id} value={dep._id}>{dep?.dep_name}</option>
                    ))}
                    
                </select>
            </div>

            {/* Shift Start Time */}
             <div>
                 <label className="block text-sm font-medium text-gray-700">Shift Start Time </label>
                 <input 
                     type="time" 
                     name="shiftStartTime" 
                     value={employee?.shiftStartTime}
                     onChange={handleChange} 
                     className="mt-1 p-2 block w-full border border-gray-300 rounded-md" 
                     required 
                 />
             </div>

            {/* Shift End Time */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Shift End Time</label>
                <input 
                    type="time" 
                    name="shiftEndTime" 
                    value={employee.shiftEndTime}
                    onChange={handleChange} 
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md" 
                    required 
                />
            </div>

            {/* Estimated Hours (Disabled) */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Work Hours </label>
                <input 
                    type="text" 
                    value={`${estimatedHours.toFixed(2)} hours`}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-mbg-gray-100" 
                    disabled 
                />
            </div>

            </div>

            <button type="submit" disabled={loading} className="mt-6 bg-[#ff8349] hover:bg-[#ff8349] text-white p-2 rounded-md font-bold py-2 cursor-pointer">{loading ? "Loading" : "Edit Employee"}</button>

        </form>
      
    </div>
  )
}

export default EditEmployee
