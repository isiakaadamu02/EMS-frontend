//employee
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { formatDate, formatTime } from "../../utils/ClockHelper";
import type { AttendanceStatus } from "../../interface";

const ClockInOut = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState<AttendanceStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);

    // Fetch today's attendance status
    const fetchTodayAttendance = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("http://localhost:3000/api/attendance/today", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setAttendance(response.data.attendance);
            }
        } catch (error) {
            console.error("Error fetching today attendance:", error);
            if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                alert(error.response.data.error)
            }
        }
    };

    useEffect(() => {
        fetchTodayAttendance();
    }, []);

    const handleClockIn = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post("http://localhost:3000/api/attendance/clock-in", {}, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.data.success) {
                alert("Clocked in Successfully!");
                fetchTodayAttendance();
            }
        } catch (error) {
            console.error("Error clocking in:", error);
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data.error || "Failed to clock in");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleClockOut = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post("http://localhost:3000/api/attendance/clock-out", {}, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (response.data.success) {
                alert(` Clocked out successfully! Total hours: ${response.data.totalHours.toFixed(2)}`);
                fetchTodayAttendance();
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data.error || "Failed to clock out");
            }
        } finally {
            setLoading(false);
        }
    };

    

    const calculateWorkingTime = () => {
        if (!attendance?.clockIn) return "00:00:00"

        const start = new Date(attendance.clockIn);
        const end = attendance.clockOut ? new Date(attendance.clockOut) : currentTime;
        const diff = end.getTime() - start.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white mb-6">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
            <p className="text-lg">{formatDate(currentTime)}</p>
            <p className="text-4xl font-mono mt-2">{currentTime.toLocaleTimeString('en-US')}</p>
        </div>

        {/* Clock Status Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Today's Attendance</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Clock In Status */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Clock In</p>
                        <p className="text-2xl font-bold text-green-700">
                            {formatTime(attendance?.clockIn || null)}
                        </p>
                </div>

                {/* Clock Out Status */}
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Clock Out</p>
                    <p className="text-2xl font-bold text-red-700">
                        {formatTime(attendance?.clockOut || null)}
                    </p>
                </div>

                {/* Working Time */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Working Time</p>
                    <p className="text-2xl font-bold text-blue-700 font-mono">
                        {calculateWorkingTime()}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={handleClockIn}
                    disabled={loading || !!attendance?.clockIn}
                    className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                        attendance?.clockIn
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                    }`}
                    >
                        {loading ? 'Processing...' : attendance?.clockIn ? '✓ Clocked In' : '🕐 Clock In'}
                </button>

                <button
                    onClick={handleClockOut}
                    disabled={loading || !attendance?.clockIn || !!attendance?.clockOut}
                    className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                        !attendance?.clockIn || attendance?.clockOut
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
                    }`}
                    >
                        {loading ? 'Processing...' : attendance?.clockOut ? '✓ Clocked Out' : '🕐 Clock Out'}
                </button>
            </div>

            {/* Status Message */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    {!attendance?.clockIn && (
                        <p className="text-gray-600">👋 Click "Clock In" to start your work day</p>
                    )}
                    {attendance?.clockIn && !attendance?.clockOut && (
                        <p className="text-green-600">✅ You're clocked in. Have a productive day!</p>
                    )}
                    {attendance?.clockOut && (
                        <p className="text-blue-600">
                            ✅ Work day complete! Total hours worked: <span className="font-bold">{attendance.totalHours.toFixed(2)} hours</span>
                        </p>
                    )}
                </div>
        </div>


    </div>
  )
}

export default ClockInOut
