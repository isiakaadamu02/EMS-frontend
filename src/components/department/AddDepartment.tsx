import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

const AddDepartment = () => {

    const [department, setDepartment] = useState({
        dep_name: "",
        description: ""
    })

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setDepartment({...department, [name]: value})
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(department);

         const token = localStorage.getItem("token")
            try {
                const response = await axios.post("https://ems-server-cyan.vercel.app/api/department/add", department, {
                    headers: {
                        "Authorization" : `Bearer ${token}` 
                    }
                })
                if(response.data.success) {
                    navigate("/admin-dashboard/departments")
                }
            } catch (error) {
                console.log(error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        }
    }
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">

        <h2 className="text-2xl font-bold mb-6">Add Department</h2>

        <form action="" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="dep_name" className="text-sm font-medium text-gray-700">Department Name</label>
                <input type="text" name="dep_name" placeholder="Enter Dept Name" onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
            </div>

            <div className="mt-3">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" placeholder="Description" onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" rows={4}/>
            </div>

            <button type="submit" className="w-full mt-6 hover:bg-[#ff8349] text-white font-bold py-2 px-4 rounded-md">Add Department</button>
        </form>
      
    </div>
  )
}

export default AddDepartment

