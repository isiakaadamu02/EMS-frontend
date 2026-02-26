import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/authContext";
import { useState } from "react";
import axios from "axios";


const Setting = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [setting, setSetting] = useState({
        userId: user?._id,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setSetting({...setting, [name]: value})
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (setting.newPassword !== setting.confirmPassword) {
            setError("Password not matched")
        } else {
            const token = localStorage.getItem("token")
            try {
                 const response = await axios.put(`https://ems-server-cyan.vercel.app/api/setting/change-password`, setting, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
             console.log(response.data)
            if(response.data.success) {
               navigate("/employee-dashboard");
               setError("")
            }
            } catch (error) {
                 console.log(error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
            }
        }
    }
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Change Password</h2>
        <p className="text-red-500">{error}</p>
        <form action="" onSubmit={handleSubmit}>
            
            
            {/* old password */}
           
            <div>
                <label htmlFor="" className=" text-sm font-medium text-gray-700">Old Password</label>
                <input type="password" name="oldPassword" onChange={handleChange} placeholder="*****" className="mt-1 p-2  w-full border border-gray-300 rounded-md" required/>
            </div>
          

            {/* new password */}
            <div>
                <label htmlFor="" className=" text-sm font-medium text-gray-700">New Password</label>
                <input type="password" name="newPassword" onChange={handleChange} placeholder="*****" className="mt-1 p-2  w-full border border-gray-300 rounded-md" required/>
            </div>

            {/* confirm password */}
            <div>
                <label htmlFor="" className=" text-sm font-medium text-gray-700">Comfirm Password</label>
                <input type="password" name="confirmPassword" onChange={handleChange} placeholder="*****" className="mt-1 p-2  w-full border border-gray-300 rounded-md" required/>
            </div>
           

            <button type="submit" className="mt-6 bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 font-bold py-2 px-4">Change Password</button>

        </form>
      
    </div>
  )
}

export default Setting
