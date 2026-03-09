import type { AttendanceRecord } from "../interface";

export const clockColumns = [
        {
            name: 'Date',
            selector: (row: AttendanceRecord) => row.date,
            format: (row: AttendanceRecord) => formatDate(new Date(row.date)),
            sortable: true,
            width: '150px'
        },
        {
            name: 'Clock In',
            selector: (row: AttendanceRecord) => row.clockIn,
            format: (row: AttendanceRecord) => row.clockIn ? formatTime(row.clockIn) : 'N/A',
            width: '120px'
        },
        {
            name: 'Clock Out',
            selector: (row: AttendanceRecord) => row.clockOut,
            format: (row: AttendanceRecord) => row.clockOut ? formatTime(row.clockOut) : 'N/A',
            width: '120px'
        },
        {
            name: 'Total Hours',
            selector: (row: AttendanceRecord) => row.totalHours,
            format: (row: AttendanceRecord) => (
                <span className="font-bold text-blue-600">
                    {row.totalHours.toFixed(2)} hrs
                </span>
            ),
            sortable: true,
            width: '130px'
        },
        {
            name: 'Status',
            selector: (row: AttendanceRecord) => row.status,
            format: (row: AttendanceRecord) => (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    row.status === 'Present' ? 'bg-green-100 text-green-700' :
                    row.status === 'Absent' ? 'bg-red-100 text-red-700' :
                    row.status === 'Sick' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                }`}>
                    {row.status || 'N/A'}
                </span>
            ),
            width: '120px'
        }
    ];


export const formatTime = (date: string | null) => {
        if (!date) return "Not clocked";
        return new Date(date).toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

export const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };