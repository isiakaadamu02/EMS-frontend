import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import type { Salary } from "../../interface";
import { useAuth } from "../../context/authContext";



const ViewSalary = () => {
    const [salaries, setSalaries] = useState<Salary[]>([]);
    const [filteredSalaries, setFilteredSalaries] = useState<Salary[]>([]);
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const {user} = useAuth()
    // let sno = 1;

    const fetchSalaries = async () => {
        setLoading(true);
        const token = localStorage.getItem("token")
        try {
            // Fetch employee data from API and set it to state
            const response = await axios.get(`http://localhost:3000/api/salary/${id}/${user?.role}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
             console.log("Salary data:", response.data)
            console.log(response.data)
            if(response.data.success) {
               setSalaries(response.data.salaries)
               setFilteredSalaries(response.data.salaries)
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

    useEffect(() => {
        fetchSalaries();
    }, [id]);

    // const filterSalaries = (q: any) => {
    //     const filteredRecords = salaries.filter((leave) => leave.employeeId.toLocaleLowerCase().includes(q.toLocaleLowerCase()));
    //     setFilteredSalaries(filteredRecords);
    // }

    const filterSalaries = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        const filteredRecords = salaries.filter((salary) =>
            salary.employeeId.employeeId.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSalaries(filteredRecords);
    }

    //  if (salaries.length === 0) {
    //     return <div className="text-center mt-10">Loading...</div>
    // }

     if (loading) {
        return <div className="text-center mt-10">Loading...</div>
    }

  return (
    <>
  
    <div className="overflow-x-auto p-5">
        <div className="text-center">
            <h2 className="text-2xl font-bold">Salary History</h2>
        </div>

        <div>
            <input type="text" placeholder="Search by Empl ID" className="border px-2 rounded-md py-0.5 border-gray-300" onChange={filterSalaries}/>
        </div>

        {filteredSalaries && filteredSalaries.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
                    <tr>
                        <th className="px-6 py-3">SNO</th>
                        <th className="px-6 py-3">Emp ID</th>
                        <th className="px-6 py-3">Salary</th>
                        <th className="px-6 py-3">Allowances</th>
                        <th className="px-6 py-3">Deduction</th>
                        <th className="px-6 py-3">Total</th>
                        <th className="px-6 py-3">Pay Date</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredSalaries.map((salary, index) => (
                        <tr key={salary._id} className="bg-white norder-b dark:bg-gray-800 dark:border-gray-700">
                            {/* <td className="px-6 py-3">{sno++}</td> */}
                            <td className="px-6 py-3">{index + 1}</td>
                            <td className="px-6 py-3">{salary.employeeId.employeeId}</td>
                           <td className="px-6 py-3">${salary.basicSalary}</td>
                                <td className="px-6 py-3">${salary.allowances}</td>
                                <td className="px-6 py-3">${salary.deductions}</td>
                                <td className="px-6 py-3">${salary.netSalary}</td>
                            <td className="px-6 py-3">{new Date(salary.payDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ): <div>No Records</div>}
      
    </div>
   
    </>
  )
}

export default ViewSalary
