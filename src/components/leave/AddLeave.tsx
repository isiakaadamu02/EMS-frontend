//added in employee
import { useState } from "react"
import { useAuth } from "../../context/authContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"


const AddLeave = () => {
    const {user} = useAuth()
    // const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [leave, setLeave] = useState({
        userId: user?._id
    })

    const targetId = user?._id;

    const handleChange = (e: any) => {
        const {name, value} = e.target
        setLeave((prevState) => ({...prevState, [name] : value}))
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

         const token = localStorage.getItem("token")
        try {
            // Fetch employee data from API and set it to state
            const response = await axios.post(`http://localhost:3000/api/leave/add`, leave, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data)
            if(response.data.success) {
               navigate(`/employee-dashboard/leaves/${targetId}`)
            }
        } catch (error) {
            console.log(error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        }
    }
    
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Request for Leave</h2>
      <form action="" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Leave Type</label>
                <select name="leaveType" onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md" required>
                    <option value="">Select Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Annual Leave">Annual Leave</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="" className="block text-sm font-medium text-gray-700">From Date</label>
                    <input type="date" name="startDate" onChange={handleChange} className="w-full border border-gray-300 rounded-md"/>
                </div>

                <div>
                    <label htmlFor="" className="block text-sm font-medium text-gray-700">To Date</label>
                    <input type="date" name="endDate" onChange={handleChange} className="w-full border border-gray-300 rounded-md"/>
                </div>

            </div>

            <div>
                <label htmlFor="" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="reason" id="" placeholder="Reason" onChange={handleChange} className="w-full border border-gray-300 rounded-md"></textarea>
            </div>
        </div>

        <button type="submit" className="w-full mt-6 bg-[#ff8349] hover:bg-[#ff8349] text-white font-bold py-2 px-4 rounded-md">Add Leave</button>
      </form>
    </div>
  )
}

export default AddLeave
