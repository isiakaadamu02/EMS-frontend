import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://ems-server-cyan.vercel.app/api/auth/login", {email, password});
            if(response.data.success) {
                console.log("Successfully Logged In")
                login(response.data.user)
                console.log(response.data.user)
                localStorage.setItem("token", response.data.token);
                if(response.data.user.role === "admin") {
                    navigate("/admin-dashboard")
                } else {
                    navigate("/employee-dashboard")
                }
                
            }
            console.log(response)
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error) && error.response && !error.response.data.success) {
                setError(error.response.data.error)
            } else {
                setError("Server Error")
            }
        }
    }
    return (
        <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-[#ff8349] from-50% to-gray-500 to-50% space-y-6 ">
            <h2 className="text-3xl text-white">Employee Management System</h2>

<div className="border shadow p-6 w-80 bg-white">
    <h2 className="text-2xl font-bold mb-4">Login</h2>
    {error && <p className="text-red-500">{error}</p>}
            <form action="" onSubmit={handleSubmit}>
                <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">Email:</label>
                <input type="email" id="email" name="email" className="w-full px-3 py-2 border" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} required/>
                </div>

                <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">Password:</label>
                <input type="password" id="password" name="password" className="w-full px-3 py-2 border" placeholder="******" onChange={(e) => setPassword(e.target.value)} required/>
                </div>

                <div className="mb-4 flex items-center justify-between">
                <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="ml-2 text-gray-700">Remember me</span>
                </label>
                <a href="#" className="text-[#ff8349] cursor-pointer">Forgot Password?</a>
                
                </div>

                <button type="submit" className="w-full bg-[#ff8349] text-white py-2 cursor-pointer">Login</button>
            </form>
            </div>
        </div>
    )
}

export default Login