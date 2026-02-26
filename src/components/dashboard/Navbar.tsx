import { useAuth } from "../../context/authContext"



const Navbar = () => {
    const {user, logout} = useAuth();


    return (
        <div className="flex justify-between h-12 bg-[#ff8349] px-5">
            <p>Welcome {user?.name}</p>
            <button className="px-4 py-1 bg-[#ff8349] hover:bg-[#ff8349]" onClick={logout}>Logout</button>
        </div>
    )
}

export default Navbar