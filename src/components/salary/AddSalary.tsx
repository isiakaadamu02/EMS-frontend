import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { fetchDepartments, fetchEmployees } from "../../utils/EmployeeHelper";
import axios from "axios";

interface SalaryDepartment {
    _id: string;
    dep_name: string;
}

interface SalaryEmployee {
    _id: string;
    employeeId: string;
    userId: {
        name: string;
    };
}

const AddSalary = () => {
    const [salary, setSalary] = useState({
        employeeId: "",
        basicSalary: 0,
        allowances: 0,
        deductions: 0,
        payDate: "",
    });

    const [departments, setDepartments] = useState<SalaryDepartment[]>([]);
    const [employees, setEmployees] = useState<SalaryEmployee[]>([]);
    const navigate = useNavigate();

    //for fetching existing departments
    useEffect(() => {
        const getDepartments = async () => {
            const departments = await fetchDepartments();
            console.log("🔍 Fetched departments:", departments);
                setDepartments(departments || [])
        }
            getDepartments()
    }, []);

    //Fetch employees when department is selected
    const handleDepartment = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const departmentId = e.target.value;
        if (!departmentId) {
            setEmployees([]);
            return;
        }
        const empls = await fetchEmployees(departmentId)
        setEmployees(empls || [])
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setSalary((prevData) => ({...prevData, [name]: value}))
    }
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const token = localStorage.getItem("token")
            try {
                const response = await axios.post(`https://ems-server-cyan.vercel.app/api/salary/add`, salary, {
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


  return (
    <>
    {departments.length > 0 ? (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6">Add New Salary</h2>
        <form action="" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* department */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Department</label>
                <select name="department" id="" onChange={handleDepartment} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required disabled={departments.length === 0}>
                    <option value="">Select Department</option>
                    {departments.map(dep => (
                        <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                    ))}
                    
                </select>
            </div>

            {/* Employee */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Employee</label>
                <select name="employeeId" onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required value={salary.employeeId} disabled={employees.length === 0}>
                    <option value="">Select Employee</option>
                    {employees.map(empl => (
                        <option key={empl._id} value={empl._id}>{empl.employeeId}</option>
                    ))}
                    
                </select>
            </div>

            {/* salary amount */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Basic Salary </label>
                <input type="number" name="basicSalary" value={salary.basicSalary} onChange={handleChange} placeholder="Insert Salary Amount" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Allowances</label>
                <input type="number" name="allowances" value={salary.allowances} onChange={handleChange} placeholder="Allowances" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Deductions</label>
                <input type="number" name="deductions" value={salary.deductions} onChange={handleChange} placeholder="Deductions" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            {/* payment date */}
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Payment Date</label>
                <input type="date" name="payDate" value={salary.payDate} onChange={handleChange} placeholder="Payment Date" className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required/>
            </div>

            </div>

            <button type='submit' className='mt-6 bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 font-bold py-2'>Add Salary Record</button>

        </form>
    </div>
    ) : <div>Loading... </div>}
    </>
    
  )
}

export default AddSalary
