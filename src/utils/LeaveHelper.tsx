import { useNavigate } from "react-router-dom"

export const leaveColumns = [
    {
        name: "S No",
        selector: (row: any) => row.sno,
        width: "70px"
    },
     {
        name: "Emp ID",
        selector: (row: any) => row.employeeId,
        sortable: true,
        width: "120px"
    },
    {
        name: "Name",
        selector: (row: any) => row.name,
        sortable: true,
        width: "120px"
    },
     {
        name: "Leave Type",
        selector: (row: any) => row.leaveType,
        sortable: true,
        width: "140px"
    },
    {
        name: "Department",
        selector: (row: any) => row.department,
        width: "170px"
    },
    {
        name: "Days",
        selector: (row: any) => row.days,
        sortable: true,
        width: "80px"
    },
    {
        name: "Status",
        selector: (row: any) => row.status,
        width: "120px"
    },
    {
        name: "Action",
        selector: (row: any) => row.action,
        center: true,
    }
]


export const LeaveButtons = ({Id}: { Id: string | number }) => {
    const navigate = useNavigate();

    const handleView = (id: any) => {
        navigate(`/admin-dashboard/leaves/${id}`);
    }

    return (
        <button className="px-2 py-1 bg-teal-700 text-white hover:bg-teal-700 rounded-md cursor-pointer" onClick={() => handleView(Id)}>View</button>
    )
}