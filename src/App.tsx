import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import PrivateRoutes from './utils/PrivateRoutes'
import RoleBaseRoutes from './utils/RoleBaseRoutes'
import AdminOverview from './components/dashboard/AdminOverview'
import DepartmentList from './components/department/DepartmentList'
import AddDepartment from './components/department/AddDepartment'
import EditDepartment from './components/department/EditDepartment'
import ListEmployee from './components/employee/ListEmployee'
import AddEmployee from './components/employee/AddEmployee'
import ViewEmployee from './components/employee/ViewEmployee'
import EditEmployee from './components/employee/EditEmployee'
import AddSalary from './components/salary/AddSalary'
import ViewSalary from './components/salary/ViewSalary'
import EmployeeOverview from './components/empDashboard/EmpOverview'
import LeaveList from './components/leave/LeaveList'
import AddLeave from './components/leave/AddLeave'
import Setting from './components/empDashboard/Setting'
import LeaveTable from './components/leave/LeaveTable'
import ViewLeave from './components/leave/ViewLeave'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Navigate to="/admin-dashboard" />}></Route>

      <Route path='/login' element={<Login />}></Route>
      <Route path='/admin-dashboard' element={
        <PrivateRoutes>
          <RoleBaseRoutes requiredRole={["admin"]}>
        <AdminDashboard />
        </RoleBaseRoutes>
        </PrivateRoutes>
        }>

          <Route index element={<AdminOverview />}></Route>
          <Route path='/admin-dashboard/departments' element={<DepartmentList />}></Route>
          <Route path='/admin-dashboard/add-department' element={<AddDepartment />}></Route>
          <Route path='/admin-dashboard/department/:id' element={<EditDepartment />}></Route>

          <Route path='/admin-dashboard/employees' element={<ListEmployee />}></Route>
          <Route path='/admin-dashboard/add-employee' element={<AddEmployee />}></Route>
          <Route path='/admin-dashboard/employees/:id' element={<ViewEmployee />}></Route>
          <Route path='/admin-dashboard/employees/edit/:id' element={<EditEmployee />}></Route>

          <Route path='/admin-dashboard/leaves' element={<LeaveTable />}></Route>
          <Route path='/admin-dashboard/leaves/:id' element={<ViewLeave />}></Route>
          <Route path='/admin-dashboard/employees/leaves/:id' element={<LeaveList />}></Route>

          <Route path='/admin-dashboard/setting' element={<Setting />}></Route>

          <Route path='/admin-dashboard/add-salary' element={<AddSalary />}></Route>
          <Route path='/admin-dashboard/employees/salary/:id' element={<ViewSalary />}></Route>
        </Route>
      <Route path='/employee-dashboard' 
        element={<PrivateRoutes>
          <RoleBaseRoutes requiredRole={["admin", "employee"]}>
            <EmployeeDashboard />
          </RoleBaseRoutes>
      </PrivateRoutes>}>
      <Route index element={<EmployeeOverview />}></Route>
      <Route path='/employee-dashboard/profile/:id' element={<ViewEmployee />}></Route>
      <Route path='/employee-dashboard/leaves/:id' element={<LeaveList />}></Route>
      <Route path='/employee-dashboard/add-leave' element={<AddLeave />}></Route>
      <Route path='/employee-dashboard/salary/:id' element={<ViewSalary />}></Route>
      <Route path='/employee-dashboard/setting' element={<Setting />}></Route>
      </Route>
    </Routes>
      
      
    </BrowserRouter>
  )
}

export default App
