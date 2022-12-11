import './App.css';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ResetPassword from './pages/auth/reset-password';
import FilesList from './pages/dashboard/filesList';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route index path="/" element={<FilesList />} />
        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
