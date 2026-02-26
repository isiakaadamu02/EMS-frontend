import { useEffect, useState } from "react"
import { fetchDepartments } from "../../utils/EmployeeHelper"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import type { EmployeeFormData } from "../../interface"


const AddEmployee = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState<any[]>([])
    const [formData, setFormData] = useState<EmployeeFormData>({
        name: "",
    email: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    designation: "",
    department: "",
    salary: "",
    password: "",
    role: "",
    image:  null,
    })

    useEffect(() => {
        const getDepartments = async () => {
            const departments = await fetchDepartments();
            console.log("🔍 Fetched departments:", departments);
            setDepartments(departments || [])
        }
        getDepartments()
    }, [])


    const handleChange = (e: any) => {
        const {name, value, files} = e.target
        if(name === "image") {
            setFormData((prevData) => ({...prevData, [name] : files[0]}))
        } else {
            setFormData((prevData) => ({...prevData, [name] : value}))
        }
    }

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value } = e.target;
        
    //     // Type guard for file input
    //     if (e.target instanceof HTMLInputElement && e.target.type === "file") {
    //         const files = e.target.files;
    //         if (files && files.length > 0) {
    //             setFormData((prevData) => ({ ...prevData, [name]: files[0] }))
    //         }
    //     } else {
    //         setFormData((prevData) => ({ ...prevData, [name]: value }))
    //     }
    // }

    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formDataObj = new FormData()

        // Object.keys(formData).forEach((key) => {
        //     formDataObj.append(key, formData[key])
        // })

         // Properly handle FormData appending
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (value instanceof File) {
                    formDataObj.append(key, value)
                } else {
                    formDataObj.append(key, String(value))
                }
            }
        })

        const token = localStorage.getItem("token")
            try {
                const response = await axios.post("http://localhost:3000/api/employee/add", formDataObj, {
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
    }

    // console.log("🎯 Current departments:", departments); // Debug log

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
        <form action="" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* name */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" onChange={handleChange} placeholder="Insert Name" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            {/* email */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" onChange={handleChange} placeholder="Insert Email" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            {/* date of birth */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" name="dob" onChange={handleChange} placeholder="DOB" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            {/* Gender */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Gender</label>
                <select name="gender" onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>

            {/* marital status */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Marital Status</label>
                <select name="maritalStatus" onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required>
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                </select>
            </div>

            {/* Designation */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Designation</label>
                <input type="text" name="designation"  onChange={handleChange} placeholder=" Designation" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            {/* Department */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Department</label>
                <select name="department" id="" onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required>
                    <option value="">Select Department</option>
                    {departments.map(dep => (
                        <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                    ))}
                    
                </select>
            </div>

            {/* Salary */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Salary</label>
                <input type="number" name="salary" onChange={handleChange} placeholder="Salary" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            {/* password */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="password" onChange={handleChange} placeholder="*****" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            {/* Role */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Role</label>
                <select name="role" onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required>
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                </select>
            </div>

            {/* image upload */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Upload Image</label>
                <input type="file" name="image" onChange={handleChange} placeholder="Upload Image" accept="image/*" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            </div>

            <button type="submit" className="mt-6 bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 font-bold py-2 ">Add Employee</button>

        </form>
      
    </div>
  )
}

export default AddEmployee
