import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

const EditDepartment = () => {
    const {id} = useParams(); //to get id from URL
    const [department, setDepartment] = useState<{ dep_name?: string; description?: string } | null>(null)
    const [depLoading, setDepLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
    const fetchDepartments = async () => {
        setDepLoading(true);
        const token = localStorage.getItem("token")
        try {
            // Fetch department data from API and set it to state
            const response = await axios.get(`https://ems-server-cyan.vercel.app/api/department/get/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data)
            if(response.data.success) {
               setDepartment(response.data.department)
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
    fetchDepartments();
    }, [])

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setDepartment({...department, [name]: value})
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(department);
    const token = localStorage.getItem("token")
        try {
            const response = await axios.put(`https://ems-server-cyan.vercel.app/api/department/edit/${id}`, department, {
                headers: {
                    "Authorization" : `Bearer ${token}`,
                },
        });
        if (response.data.success) {
            navigate("/admin-dashboard/departments");
        }
     } catch (error) {
            if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        }
    }

  return (
    <>
    {depLoading ? <p>Loading...</p> :
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">

        <h2 className="text-2xl font-bold mb-6">Edit Department</h2>

        <form action="" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="dep_name" className="text-sm font-medium text-gray-700">Department Name</label>
                <input type="text" name="dep_name" placeholder="Enter Dept Name" onChange={handleChange} value={department?.dep_name || ""} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
            </div>

            <div className="mt-3">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" placeholder="Description" onChange={handleChange} value={department?.description || ""} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" rows={4}/>
            </div>

            <button type="submit" className="w-full mt-6 hover:bg-[#ff8349] text-white font-bold py-2 px-4 rounded-md">Edit Department</button>
        </form>
      
    </div>
}
    </>
  )
}

export default EditDepartment
