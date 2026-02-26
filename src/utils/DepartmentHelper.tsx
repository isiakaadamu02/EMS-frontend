import axios from "axios";
import { useNavigate } from "react-router-dom"


export const columns = [
    {
        name: "S No",
        selector: (row: any) => row.sno,
    },
    {
        name: "Department Name",
        selector: (row: any) => row.dep_name,
        sortable: true,
    },
    {
        name: "Action",
        selector: (row: any) => row.action,
    }
]

export const DepartmentButtons = ({_id, onDepartmentDelete}: any) => {
    const navigate = useNavigate();

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("token")
        const confirmDelete = window.confirm("Are you sure you want to delete this department?")
        if(!confirmDelete) return;
        try {
            // Fetch department data from API and set it to state
            const response = await axios.delete(`http://localhost:3000/api/department/delete/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data)
            if(response.data.success) {
               onDepartmentDelete()
            }
        } catch (error) {
            console.log(error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        }
    }
    return (
        <div className="flex space-x-3">
            <button className="px-3 py-1 bg-teal-500 text-white rounded cursor-pointer" onClick={() => navigate(`/admin-dashboard/department/${_id}`)}>Edit</button>
            <button className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer" onClick={() => handleDelete(_id)}>Delete</button>
        </div>
    )
}