//employee
import { useEffect, useState } from "react";
import type { AttendanceRecord } from "../../interface";
import axios from "axios";
import DataTable from "react-data-table-component";
import { clockColumns } from "../../utils/ClockHelper.tsx";

const AttendanceHistory = () => {
    const [history, setHistory] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("http://localhost:3000/api/attendance/history", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setHistory(response.data.attendance);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                alert(error.response.data.error || "Error fetching attendance history")
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // Calculate statistics
    const totalDays = history.length;
    const totalHoursWorked = history.reduce((sum, record) => sum + record.totalHours, 0);
    const averageHours = totalDays > 0 ? totalHoursWorked / totalDays : 0;
  return (
    <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Attendance History</h2>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Days Worked</p>
                <p className="text-3xl font-bold text-blue-700">{totalDays}</p>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Hours Worked</p>
                <p className="text-3xl font-bold text-green-700">{totalHoursWorked.toFixed(1)} hrs</p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Average Hours/Day</p>
                <p className="text-3xl font-bold text-purple-700">{averageHours.toFixed(1)} hrs</p>
            </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow">
            {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : history.length > 0 ? (
                    <DataTable
                        columns={clockColumns}
                        data={history}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 20, 30, 50]}
                        highlightOnHover
                        striped
                    />
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        No attendance history found
                    </div>
                )}
        </div>
    </div>
  )
}

export default AttendanceHistory
