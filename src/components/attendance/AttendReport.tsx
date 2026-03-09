import axios from "axios";
import { useEffect, useState } from "react"

interface AttendanceRecord {
    employeeId: string;
    employeeName: string;
    departmentName: string;
    status: string;
}

interface GroupedReport {
    [date: string]: AttendanceRecord[];
}

const AttendReport = () => {
    const [report, setReport] = useState<GroupedReport>({});
    const [limit, setLimit] = useState<number>(10);
    const [skip, setSkip] = useState<number>(0);
    const [dateFilter, setDateFilter] = useState<string>("")
    const [loading, setLoading] = useState(false);

    console.log(setLimit)

    const fetchReport = async () => {
        
        const token = localStorage.getItem("token")
        try {
            setLoading(true)
            const query = new URLSearchParams({
                limit: limit.toString(),
                skip: skip.toString()
            });

            if(dateFilter) {
                query.append("date", dateFilter)
            }
            const response = await axios.get(`http://localhost:3000/api/attendance/report?${query.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log("response:", response.data)
            if(response.data.success) {
                
                if(skip === 0) {
                    setReport(response.data.groupData)
                } else {
                    setReport((prevData) => ({...prevData, ...response.data.groupData}))
                }
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            console.error(" Error:", error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    alert(error.response.data.error)
                }
        } 
    }

    useEffect(() => {
        fetchReport();
    }, [skip, dateFilter])

    const handleLoadmore = () => {
        setSkip((prevSkip) => prevSkip + limit)
    }

  return (
    <div className="min-h-screen p-10 bg-white">
      <h2 className="text-center text-2xl font-bold">Attendance Report</h2>

      <div>
        <h2 className="text-xl font-semibold">Filter by Date</h2>
        <input type="date" className="border bg-gray-100" onChange={(e) => {
            setDateFilter(e.target.value)
            setSkip(0)
        }}/>
      </div>
    
    {loading ? <div>Loading... </div> :
      Object.entries(report).map(([date, records]) => (
        <div className="mt-4 border-b" key={date}>
            <h2 className="text-xl font-semibold">{date}</h2>
        
      <table className="w-full mt-4" border={1} cellPadding={10}>
        <thead>
            <tr>
                <th>S No</th>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody >
            {records.map((data, i) => (
                
                    <tr key={data.employeeId} >
                        <td>{i + 1}</td>
                        
                        <td>{data.employeeId}</td>
                        <td>{data.employeeName}</td>
                        <td>{data.departmentName}</td>
                        <td>{data.status}</td>
                    </tr>
            
            ))}
        </tbody>
      </table>
      
      </div>
      ))}
      <button className="px-4 py-2 border bg-gray-100 text-lg font-semibold" onClick={handleLoadmore}>Load More</button>
    </div>
  )
}

export default AttendReport
