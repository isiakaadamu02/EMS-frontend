import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper"
import { useEffect, useState } from "react"
import axios from "axios"


const DepartmentList = () => {
    const [departments, setDepartments] = useState<any[]>([]) // Placeholder for department data
    const [depLoading, setDepLoading] = useState(false);
    const [filteredDepartments, setFilteredDepartments] = useState<any[]>([])

    //function to filter data after delete or edit
    // const onDepartmentDelete = async (id: string) => {
    //     const data = departments.filter(dep => dep._id !== id);
    //     setDepartments(data);
    // }

     const onDepartmentDelete = () => {
       fetchDepartments()
    }

    const fetchDepartments = async () => {
        setDepLoading(true);
        const token = localStorage.getItem("token")
        try {
            // Fetch department data from API and set it to state
            const response = await axios.get("http://localhost:3000/api/department", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if(response.data.success) {
                let sno = 1;
                const data = await response.data.departments?.map((dep: any) => (
                    {
                        _id: dep._id,
                        sno: sno++,
                        dep_name: dep.dep_name,
                        action: (<DepartmentButtons _id={dep._id} onDepartmentDelete={onDepartmentDelete} />),
                    }
                ))
                setDepartments(data)
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

    useEffect(() => {
  
    fetchDepartments();
    }, [])

    //to filter data on search based on dept name
    const filterDepartments = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        const filteredData = departments.filter(dep => dep.dep_name.toLowerCase().includes(value))
        setFilteredDepartments(filteredData)
    }
    return (
        <>
        {depLoading ? <p>Loading...</p> :
        <div className="p-5">
            <div className="text-center">
                <h3 className="text-2xl font-bold">Manage Departments</h3>
            </div>

            <div className="flex justify-between items-center">
                <input type="text" placeholder="Search by Dept Name" className="px-4 py-0.5 border" onChange={filterDepartments}/>
                <Link to="/admin-dashboard/add-department" className="px-4 py-1 bg-[#ff8349] rounded text-white">Add New Department</Link>
            </div>

            <div className="mt-5">
                <DataTable columns={columns} data={filteredDepartments.length > 0 ? filteredDepartments : departments} pagination/>
            </div>
        </div>
}
</>
    )
}

export default DepartmentList