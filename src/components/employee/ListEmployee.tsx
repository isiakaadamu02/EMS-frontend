import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { empColumns, EmployeeButtons } from "../../utils/EmployeeHelper"
import DataTable from "react-data-table-component"

const ListEmployee = () => {
    const [employees, setEmployees] = useState<any[]>([])
    const [depLoading, setDepLoading] = useState(false);
    const [filterEmployee, setFilterEmployee] = useState<any[]>([])

    useEffect(() => {
    const fetchEmployees = async () => {
        setDepLoading(true);
        const token = localStorage.getItem("token")
        try {
            // Fetch department data from API and set it to state
            const response = await axios.get("http://localhost:3000/api/employee", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data)
            if(response.data.success) {
                let sno = 1;
                const data = await response.data.employees?.map((empl: any) => (
                    {
                        _id: empl._id,
                        sno: sno++,
                        dep_name: empl.department.dep_name,
                        name: empl.userId.name,
                        dob: new Date(empl.dob).toDateString(),
                        profileImage: <img width={40} className="rounded-full" src={`http://localhost:3000/${empl.userId.profileImage}`} /> , 
                        action: (<EmployeeButtons _id={empl._id} />),
                    }
                ))
                setEmployees(data)
                setFilterEmployee(data)
            }
        } catch (error) {
            console.log(error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        } finally {
            setDepLoading(false);
        }
    }
    fetchEmployees();
    }, [])

    //to filter data on search based on dept name
    const handleFilterEmployee = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        const filteredData = employees.filter(empl => empl.name.toLowerCase().includes(value))
        setFilterEmployee(filteredData)
    }

  return (
    <>
        {depLoading ? <p>Loading...</p> :
    <div className="p-5">
            <div className="text-center">
                <h3 className="text-2xl font-bold">Manage Employees</h3>
            </div>

            <div className="flex justify-between items-center">
                <input type="text" placeholder="Search by Employee Name" onChange={handleFilterEmployee} className="px-4 py-0.5 border" />
                <Link to="/admin-dashboard/add-employee" className="px-4 py-1 bg-[#ff8349] rounded text-white">Add New Employee</Link>
            </div>

            <div className="mt-6">
                <DataTable columns={empColumns} data={filterEmployee.length > 0 ? filterEmployee : filterEmployee} pagination/>
            </div>
        </div>
}
</>
  )
}

export default ListEmployee
