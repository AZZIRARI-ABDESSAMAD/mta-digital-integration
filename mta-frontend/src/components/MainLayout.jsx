import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Users, LogOut, Home, UserCog, Calendar, User, ClipboardCheck } from 'lucide-react';
import api from '../api/axios'; // Import your axios instance for logout

const MainLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const userString = localStorage.getItem('mta_user');
    const userRole = userString ? JSON.parse(userString).role : null;

    const handleLogout = async () => {
        try {
            await api.post('/logout'); // Call Laravel logout
            localStorage.removeItem('mta_token');
            navigate('/login');
        } catch (err) {
            console.error("Logout failed");
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

            {/* 1. Sidebar (Fixed on the left) */}
            {/* Sidebar */}
            <aside className="w-64 bg-mtaBlue text-white flex flex-col shadow-xl">
                <div className="p-8 ml-12 text-2xl font-black border-b border-blue-400/30">MTA</div>
                <nav className="flex-1 p-6 space-y-4">
                    <Link to="/" className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${location.pathname === "/Home" ? "bg-white/10" : "hover:bg-white/10"}`}>
                        <Home size={20} />
                        <span className="font-semibold">Home</span>
                    </Link>
                    <Link to="/formations" className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${location.pathname === "/formations" ? "bg-white/10" : "hover:bg-white/10"}`}>
                        <BookOpen size={20} />
                        <span className="font-semibold">Formations</span>
                    </Link>
                    <Link to="/departments" className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${location.pathname === "/departments" ? "bg-white/10" : "hover:bg-white/10"}`}>
                        <Users size={20} />
                        <span className="font-semibold">Équipes & Départements</span>
                    </Link>
                    <Link to="/events" className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${location.pathname === "/events" ? "bg-white/10" : "hover:bg-white/10"}`}>
                        <Calendar size={20} />
                        <span className="font-semibold">Events</span>
                    </Link>
                    {userRole === 'admin' && (
                        <Link to="/user-management" className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${location.pathname === "/user-management" ? "bg-white/10" : "hover:bg-white/10"}`}>
                            <UserCog size={20} />
                            <span className="font-semibold">User Management</span>
                        </Link>
                    )}
                </nav>
                <Link to="/profile" className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${location.pathname === "/profile" ? "bg-white/10" : "hover:bg-white/10"}`}>
                    <User size={20} />
                    <span className="font-semibold">Profile</span>
                </Link>
                <div className="p-6 border-t border-blue-400/30">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-red-300 hover:text-white transition w-full">
                        <LogOut size={20} />
                        <span className="font-bold">Logout</span>
                    </button>
                </div>
            </aside>

            {/* 2. Main Content Area (Dynamic) */}
            <main className="flex-1 h-screen overflow-y-auto relative">
                {/* The Outlet is where <Dashboard /> or <Directory /> will be rendered */}
                <div className="min-h-full">
                    {children || <Outlet />}
                </div>
            </main>

        </div>
    );
};

export default MainLayout;