import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, Briefcase, X, Clock, User, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../components/MainLayout';
import axios from 'axios';

// اللائحة ديال الأقسام لي جاب ليك الدري
const DEPARTMENTS = [
    "All Teams",
    "Manufacturing Engineering",
    "Production",
    "Logistics",
    "Finance",
    "QHSE",
    "HR",
    "Facilities",
    "R&D",
    "Maintenance"
];

// داتا مؤقتة باش نجربو الديزاين (من بعد غانجيبوها من Laravel)
const dummyEmployees = [
    { id: 1, name: "Amine Benali", position: "Maintenance Manager", dept: "Maintenance", email: "a.benali@mta.ma", ext: "1042", Image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, name: "Sara Rami", position: "HR Specialist", dept: "HR", email: "s.rami@mta.ma", ext: "2011", Image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 3, name: "Youssef Naciri", position: "Robotics Engineer", dept: "Manufacturing Engineering", email: "y.naciri@mta.ma", ext: "3055", Image: "https://randomuser.me/api/portraits/men/75.jpg" },
    { id: 4, name: "Meryem Tazi", position: "Quality Inspector", dept: "QHSE", email: "m.tazi@mta.ma", ext: "4100", Image: "https://randomuser.me/api/portraits/women/65.jpg" },
    { id: 5, name: "Karim Safwat", position: "Production Supervisor", dept: "Production", email: "k.safwat@mta.ma", ext: "5022", Image: "https://randomuser.me/api/portraits/men/22.jpg" },
    { id: 6, name: "Ayoub Drissi", position: "Senior Technician", dept: "Maintenance", email: "a.drissi@mta.ma", ext: "1045", Image: "https://randomuser.me/api/portraits/men/85.jpg" },
    { id: 7, name: "Fatima Zahra El Idrissi", position: "Financial Analyst", dept: "Finance", email: "f.elidrissi@mta.ma", ext: "6010", Image: "https://randomuser.me/api/portraits/women/12.jpg" },
    { id: 8, name: "Omar Chakir", position: "Logistics Coordinator", dept: "Logistics", email: "o.chakir@mta.ma", ext: "7033", Image: "https://randomuser.me/api/portraits/men/45.jpg" },
    { id: 9, name: "Hajar Moussaoui", position: "R&D Engineer", dept: "R&D", email: "h.moussaoui@mta.ma", ext: "8021", Image: "https://randomuser.me/api/portraits/women/28.jpg" },
    { id: 10, name: "Rachid Alami", position: "Facilities Manager", dept: "Facilities", email: "r.alami@mta.ma", ext: "9005", Image: "https://randomuser.me/api/portraits/men/58.jpg" },
    { id: 11, name: "Nadia Berrada", position: "HSE Officer", dept: "QHSE", email: "n.berrada@mta.ma", ext: "4115", Image: "https://randomuser.me/api/portraits/women/33.jpg" },
    { id: 12, name: "Hamza El Fassi", position: "Line Operator", dept: "Production", email: "h.elfassi@mta.ma", ext: "5040", Image: "https://randomuser.me/api/portraits/men/11.jpg" },
    { id: 13, name: "Layla Bennani", position: "Payroll Manager", dept: "Finance", email: "l.bennani@mta.ma", ext: "6025", Image: "https://randomuser.me/api/portraits/women/52.jpg" },
    { id: 14, name: "Mehdi Ouazzani", position: "Warehouse Supervisor", dept: "Logistics", email: "m.ouazzani@mta.ma", ext: "7050", Image: "https://randomuser.me/api/portraits/men/36.jpg" },
    { id: 15, name: "Salma Kettani", position: "Training Coordinator", dept: "HR", email: "s.kettani@mta.ma", ext: "2030", Image: "https://randomuser.me/api/portraits/women/71.jpg" },
    { id: 16, name: "Zakaria Tahiri", position: "Process Engineer", dept: "Manufacturing Engineering", email: "z.tahiri@mta.ma", ext: "3070", Image: "https://randomuser.me/api/portraits/men/67.jpg" },
    { id: 17, name: "Imane Chraibi", position: "R&D Project Lead", dept: "R&D", email: "i.chraibi@mta.ma", ext: "8040", Image: "https://randomuser.me/api/portraits/women/19.jpg" },
    { id: 18, name: "Adil Benhaddou", position: "Electrical Technician", dept: "Maintenance", email: "a.benhaddou@mta.ma", ext: "1060", Image: "https://randomuser.me/api/portraits/men/92.jpg" },
    { id: 19, name: "Kenza El Amrani", position: "Production Planner", dept: "Production", email: "k.elamrani@mta.ma", ext: "5055", Image: "https://randomuser.me/api/portraits/women/85.jpg" },
    { id: 20, name: "Taha Jalil", position: "Building Technician", dept: "Facilities", email: "t.jalil@mta.ma", ext: "9020", Image: "https://randomuser.me/api/portraits/men/48.jpg" },
];

const Departments = () => {
    const [activeTab, setActiveTab] = useState("All Teams");
    const [searchQuery, setSearchQuery] = useState("");

    // State جديد باش نتحكمو فالنافذة لي كتحل
    const [selectedUser, setSelectedUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('mta_token');
                if (!token) return;
                const res = await axios.get('http://127.0.0.1:8000/api/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUserProfile({
                    id: 'me',
                    name: `${res.data.first_name} ${res.data.last_name}`,
                    position: res.data.position || 'N/A',
                    dept: res.data.department?.name || 'Non assigné',
                    email: res.data.email,
                    ext: res.data.phone || '0000',
                    Image: res.data.avatar ? `http://127.0.0.1:8000/storage/${res.data.avatar}` : null,
                    isMe: true
                });
            } catch (error) {
                console.error("Impossible de récupérer les infos :", error);
            }
        };

        fetchUserData();
    }, []);

    // Add logged-in user to the top of the dummy employee list
    const allEmployees = userProfile
        ? [userProfile, ...dummyEmployees.filter(e => e.email !== userProfile.email)]
        : dummyEmployees;

    const filteredEmployees = allEmployees.filter(emp => {
        const matchDept = activeTab === "All Teams" || emp.dept === activeTab;
        const matchSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.position.toLowerCase().includes(searchQuery.toLowerCase());
        return matchDept && matchSearch;
    });

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50 p-8 lg:p-12 font-sans relative overflow-hidden">
                <div className="max-w-7xl mx-auto">

                    {/* Header & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Team Directory</h1>
                            <p className="text-gray-500">Connect with your colleagues across MTA Morocco.</p>
                        </div>

                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name or position..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Categories Tabs (Horizontal Scroll) */}
                    <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-10 pb-4">
                        {DEPARTMENTS.map((dept) => (
                            <button
                                key={dept}
                                onClick={() => setActiveTab(dept)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${activeTab === dept
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 transform scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>

                    {/* Employee Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredEmployees.map((emp) => (
                                <motion.div
                                    key={emp.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    // زدت ليك onClick و cursor-pointer هنا باش تحل النافذة
                                    onClick={() => setSelectedUser(emp)}
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all group cursor-pointer"
                                >
                                    <div className="flex items-start gap-4 mb-6">
                                        {/* Profile Image Placeholder */}
                                        <div className="w-16 h-16 min-w-[64px] min-h-[64px] rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-black text-xl shadow-inner group-hover:scale-110 transition-transform overflow-hidden border-2 border-white">
                                            {emp.Image ? (
                                                <img src={emp.Image} alt={emp.name} className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <span>{emp.name.charAt(0)}</span>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {emp.name}
                                            </h3>
                                            <p className="text-sm font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-md mt-1 mb-1">
                                                {emp.dept}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Briefcase size={14} /> {emp.position}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contact Info Footer */}
                                    <div className="pt-4 border-t border-gray-50 space-y-2">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Mail size={16} className="text-gray-400" />
                                            <span className="group-hover:text-blue-600 transition-colors">{emp.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Phone size={16} className="text-gray-400" />
                                            <span>Ext: <strong className="text-gray-900">{emp.ext}</strong></span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Empty State */}
                        {filteredEmployees.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="text-gray-400" size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">No team members found</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your search or selecting a different department.</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* --- النافذة الجانبية لي طلبتي (Slide-over Panel) --- */}
                <AnimatePresence>
                    {selectedUser && (
                        <>
                            {/* الخلفية الكحلة لي كتغطي الشاشة */}
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setSelectedUser(null)}
                                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
                            />

                            {/* النافذة لي كتخرج من اليمن */}
                            <motion.div
                                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-50 shadow-2xl flex flex-col"
                            >
                                {/* الهيدر ديال النافذة */}
                                <div className="p-8 pb-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                                    <div className="flex items-center gap-5">
                                        <div className="w-20 h-20 min-w-[80px] min-h-[80px] rounded-3xl bg-blue-100 flex items-center justify-center overflow-hidden shadow-lg border-2 border-white text-blue-600 font-black text-3xl">
                                            {selectedUser.Image ? (
                                                <img src={selectedUser.Image} alt={selectedUser.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{selectedUser.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900">{selectedUser.name}</h2>
                                            <p className="font-bold text-blue-600">{selectedUser.position}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedUser(null)} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition">
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* وسط النافذة (المعلومات) */}
                                <div className="p-8 overflow-y-auto flex-1 space-y-8">
                                    <section>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Information</h4>
                                        <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm">
                                            <div className="flex items-center gap-4 text-gray-700">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Mail size={18} /></div>
                                                <div><p className="text-xs text-gray-500">Email Address</p><p className="font-semibold">{selectedUser.email}</p></div>
                                            </div>
                                            <div className="flex items-center gap-4 text-gray-700">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Phone size={18} /></div>
                                                <div><p className="text-xs text-gray-500">Internal Extension</p><p className="font-semibold">{selectedUser.ext}</p></div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Work Details</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                                <Clock size={18} className="text-gray-400 mb-2" />
                                                <p className="text-xs text-gray-500 mb-1">Department</p>
                                                <p className="font-bold text-sm text-gray-900">{selectedUser.dept}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                                <User size={18} className="text-gray-400 mb-2" />
                                                <p className="text-xs text-gray-500 mb-1">System Status</p>
                                                <p className="font-bold text-sm text-green-600 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Active
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* زر الإيميل لتحت */}
                                <div className="p-6 border-t border-gray-100 bg-gray-50">
                                    <a href={`mailto:${selectedUser.email}`} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                        <Mail size={18} /> Send Message
                                    </a>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

            </div>
        </MainLayout>
    );
};

export default Departments;





// 2nd version

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Search, Mail, Phone, Briefcase, X, Clock, User, MapPin, ChevronDown } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import MainLayout from '../components/MainLayout';


// const Departments = () => {
//     const [employees, setEmployees] = useState([]); // Real data
//     const [activeTab, setActiveTab] = useState("All Teams");
//     const [searchQuery, setSearchQuery] = useState("");
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [visibleCount, setVisibleCount] = useState(12); // Start with 12 cards
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//     // 1. Fetch data from Laravel
//     useEffect(() => {
//         const fetchEmployees = async () => {
//             try {
//                 const token = localStorage.getItem('mta_token');
//                 const response = await axios.get('http://127.0.0.1:8000/api/employees', {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         Accept: 'application/json'
//                     }
//                 });
//                 setEmployees(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//                 setLoading(false);
//             }
//         };
//         fetchEmployees();
//     }, []);

//     // This resets the count to 12 every time you change the search or the department
//     useEffect(() => {
//         setVisibleCount(12);
//     }, [activeTab, searchQuery]);

//     // 2. Generate department list automatically from the data we received
//     const dynamicDepartments = [
//         "All Teams",
//         ...new Set(employees.map(emp => emp.department))
//     ].filter(Boolean);

//     // 3. الفلترة
//     const filteredEmployees = employees.filter(emp => {
//         const matchDept = activeTab === "All Teams" || emp.department === activeTab;
//         const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
//         const matchSearch = fullName.includes(searchQuery.toLowerCase()) ||
//             emp.position.toLowerCase().includes(searchQuery.toLowerCase());
//         return matchDept && matchSearch;
//     });

//     const getAvatar = (user) => {
//         return `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff&rounded=true`;
//     };

//     return (
//         <MainLayout>
//             <div className="min-h-screen bg-gray-50 p-8 lg:p-12 font-sans relative overflow-hidden">
//                 <div className="max-w-7xl mx-auto">

//                     {/* Header & Search */}
//                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
//                         <div>
//                             <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Team Directory</h1>
//                             <p className="text-gray-500">Connect with your colleagues across MTA Morocco.</p>
//                         </div>

//                         <div className="relative w-full md:w-96">
//                             <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
//                             <input
//                                 type="text"
//                                 placeholder="Search by name or position..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
//                             />
//                         </div>
//                     </div>

//                     {/* Categories Filter (Custom Dropdown) */}
//                     <div className="mb-10 flex flex-col md:flex-row items-center gap-4">
//                         <div className="w-full md:w-1/3 relative z-20"> {/* z-20 باش القائمة تطيح فوق الكارطات */}
//                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
//                                 Filter by Department
//                             </label>

//                             {/* Dropdown Button */}
//                             <div
//                                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                                 className="w-full bg-white border-2 border-gray-100 text-gray-800 py-3.5 pl-5 pr-5 rounded-2xl font-bold focus:outline-none hover:border-blue-200 transition-all shadow-sm cursor-pointer flex justify-between items-center"
//                             >
//                                 <span className="truncate">{activeTab}</span>
//                                 <ChevronDown
//                                     size={20}
//                                     className={`text-blue-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
//                                 />
//                             </div>

//                             {/* Dropdown Menu */}
//                             <AnimatePresence>
//                                 {isDropdownOpen && (
//                                     <motion.ul
//                                         initial={{ opacity: 0, y: -10 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         exit={{ opacity: 0, y: -10 }}
//                                         transition={{ duration: 0.2 }}
//                                         className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-64 overflow-y-auto hide-scrollbar py-2"
//                                     >
//                                         {dynamicDepartments.map((dept) => (
//                                             <li
//                                                 key={dept}
//                                                 onClick={() => {
//                                                     setActiveTab(dept);
//                                                     setVisibleCount(12);
//                                                     setIsDropdownOpen(false); // Close the dropdown when an item is selected
//                                                 }}
//                                                 className={`px-5 py-3 cursor-pointer transition-colors text-sm font-semibold flex items-center justify-between
//                                 ${activeTab === dept
//                                                         ? 'bg-blue-50 text-blue-600' // Selected department color
//                                                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' // Other departments color
//                                                     }`}
//                                             >
//                                                 {dept}
//                                                 {/* Blue dot to indicate the selected department */}
//                                                 {activeTab === dept && (
//                                                     <div className="w-2 h-2 rounded-full bg-blue-600 shadow-sm"></div>
//                                                 )}
//                                             </li>
//                                         ))}
//                                     </motion.ul>
//                                 )}
//                             </AnimatePresence>
//                         </div>
//                     </div>
//                     {/* Employee Cards Grid */}
//                     {loading ? (
//                         <div className="text-center py-20 text-gray-400 font-bold">Loading Team Data...</div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                             <AnimatePresence>
//                                 {filteredEmployees.slice(0, visibleCount).map((emp) => (
//                                     <motion.div
//                                         key={emp.id}
//                                         initial={{ opacity: 0, y: 20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         exit={{ opacity: 0, scale: 0.9 }}
//                                         transition={{ duration: 0.2 }}
//                                         onClick={() => setSelectedUser(emp)}
//                                         className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all group cursor-pointer"
//                                     >
//                                         <div className="flex items-start gap-4 mb-6">
//                                             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform overflow-hidden">
//                                                 <img src={getAvatar(emp)} alt={emp.firstName} loading="lazy" className="w-full h-full object-cover rounded-2xl" />
//                                             </div>

//                                             <div>
//                                                 <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
//                                                     {emp.firstName} {emp.lastName}
//                                                 </h3>
//                                                 <p className="text-sm font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-md mt-1 mb-1">
//                                                     {emp.department}
//                                                 </p>
//                                                 <p className="text-sm text-gray-500 flex items-center gap-1">
//                                                     <Briefcase size={14} /> {emp.position}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         <div className="pt-4 border-t border-gray-50 space-y-2">
//                                             <div className="flex items-center gap-3 text-sm text-gray-600">
//                                                 <Mail size={16} className="text-gray-400" />
//                                                 <span className="truncate group-hover:text-blue-600 transition-colors">{emp.email}</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 text-sm text-gray-600">
//                                                 <MapPin size={16} className="text-gray-400" />
//                                                 <span>Zone: <strong className="text-gray-900">{emp.zone}</strong></span>
//                                             </div>
//                                         </div>
//                                     </motion.div>
//                                 ))}
//                             </AnimatePresence>

//                             {filteredEmployees.length === 0 && (
//                                 <div className="col-span-full py-20 text-center">
//                                     <h3 className="text-xl font-bold text-gray-800">No team members found</h3>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//                 {/* "Show More" button appears only if there are hidden employees */}
//                 {visibleCount < filteredEmployees.length && (
//                     <div className="col-span-full flex justify-center py-10 mt-4 border-t border-gray-100">
//                         <button
//                             onClick={() => setVisibleCount(prev => prev + 12)}
//                             className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-bold shadow-sm hover:bg-blue-600 hover:text-white transition-all duration-300"
//                         >
//                             Load More Team Members
//                         </button>
//                     </div>
//                 )}

//                 {/* --- Slide-over Panel --- */}
//                 <AnimatePresence>
//                     {selectedUser && (
//                         <>
//                             <motion.div
//                                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//                                 onClick={() => setSelectedUser(null)}
//                                 className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
//                             />

//                             <motion.div
//                                 initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
//                                 transition={{ type: "spring", damping: 25, stiffness: 200 }}
//                                 className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-50 shadow-2xl flex flex-col"
//                             >
//                                 <div className="p-8 pb-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
//                                     <div className="flex items-center gap-5">
//                                         <div className="w-20 h-20 rounded-3xl bg-blue-100 shadow-lg overflow-hidden">
//                                             <img src={getAvatar(selectedUser)} alt={selectedUser.firstName} className="w-full h-full object-cover" />
//                                         </div>
//                                         <div>
//                                             <h2 className="text-2xl font-black text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</h2>
//                                             <p className="font-bold text-blue-600">{selectedUser.position}</p>
//                                         </div>
//                                     </div>
//                                     <button onClick={() => setSelectedUser(null)} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition">
//                                         <X size={20} />
//                                     </button>
//                                 </div>

//                                 <div className="p-8 overflow-y-auto flex-1 space-y-8">
//                                     <section>
//                                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Information</h4>
//                                         <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm">
//                                             <div className="flex items-center gap-4 text-gray-700">
//                                                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Mail size={18} /></div>
//                                                 <div><p className="text-xs text-gray-500">Email Address</p><p className="font-semibold">{selectedUser.email}</p></div>
//                                             </div>
//                                         </div>
//                                     </section>

//                                     <section>
//                                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Organization Details</h4>
//                                         <div className="grid grid-cols-2 gap-4">
//                                             <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
//                                                 <Clock size={18} className="text-gray-400 mb-2" />
//                                                 <p className="text-xs text-gray-500 mb-1">Cost Center</p>
//                                                 <p className="font-bold text-sm text-gray-900">{selectedUser.costCenter}</p>
//                                             </div>
//                                             <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
//                                                 <User size={18} className="text-gray-400 mb-2" />
//                                                 <p className="text-xs text-gray-500 mb-1">Zone</p>
//                                                 <p className="font-bold text-sm text-gray-900">{selectedUser.zone}</p>
//                                             </div>
//                                         </div>
//                                     </section>
//                                 </div>

//                                 <div className="p-6 border-t border-gray-100 bg-gray-50">
//                                     <a href={`mailto:${selectedUser.email}`} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
//                                         <Mail size={18} /> Send Message
//                                     </a>
//                                 </div>
//                             </motion.div>
//                         </>
//                     )}
//                 </AnimatePresence>
//             </div>
//         </MainLayout>
//     );
// };

// export default Departments;