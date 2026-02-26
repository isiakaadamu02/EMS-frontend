export interface UserProps {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    role: "admin" | "employee";
}

export interface RoleBaseRoutesProps {
    children: React.ReactNode;
    requiredRole: string[];
}

export interface SummaryCardProps {
    icon: React.ReactNode;
    text: string;
    number: number;
    color: string;
}

export interface EmployeeFormData {
    name: string;
    email: string;
    dob: string;
    gender: string;
    maritalStatus: string;
    designation: string;
    department: string;
    salary: string;
    password: string;
    role: string;
    image: File | null;
    [key: string]: any; // This allows string indexing
}

export interface Employee {
    _id: string;
    employeeId: string;
    dob: string;
    gender: string;
    maritalStatus: string;
    designation: string;
    salary: number;
    userId: {
        _id: string;
        name: string;
        email: string;
        profileImage: string;
    };
    department: {
        _id: string;
        dep_name: string;
    };
}

export interface Salary{
    _id: string;
     employeeId: {
        _id: string;
        employeeId: string;
        userId: {
            name: string;
        };
    };
    // employeeId: string;
    basicSalary: number; 
    allowances: number;
    deductions: number;
    payDate: string;
    netSalary: number;
}

export interface Leave{
    _id: string;
     employeeId: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
    basicLeave: string;
    status: string;
    appliedAt: string;
}