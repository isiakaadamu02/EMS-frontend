import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import type { Employee } from "../../interface";


const ViewEmployee = () => {
    const {id} = useParams();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);

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
        } finally {
                setLoading(false);
            }
    }
    fetchEmployees();
    }, [id])


 if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (!employee) {
        return <div className="text-center mt-10">Employee not found</div>;
    }

  return (
    <>{employee ? (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-8 text-center">Employee Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <img src={`http://localhost:3000/${employee.userId.profileImage}`} alt="profile" className="rounded-full border w-72"/>
            </div>
        </div>
      <div>
        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">Name: </p>
            <p className="font-medium">{employee.userId.name}</p>
        </div>

        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">Employee ID: </p>
            <p className="font-medium">{employee.employeeId}</p>
        </div>

        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">Date of Birth: </p>
            <p className="font-medium">{new Date(employee.dob).toLocaleDateString()}</p>
        </div>

        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">Gender: </p>
            <p className="font-medium">{employee.gender}</p>
        </div>

        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">Department: </p>
            <p className="font-medium">{employee.department.dep_name}</p>
        </div>

        <div className="flex space-x-3 mb-5">
            <p className="text-lg font-bold">Marital Status: </p>
            <p className="font-medium">{employee.maritalStatus}</p>
        </div>
      </div>
    </div>
    

    ): <div>Loading... </div> }</>
  )
}

export default ViewEmployee
