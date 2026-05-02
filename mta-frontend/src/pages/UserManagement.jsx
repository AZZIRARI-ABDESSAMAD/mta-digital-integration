import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import MainLayout from '../components/MainLayout';
import { Edit, Power, CheckCircle } from 'lucide-react'; // تأكد بلي راك داير npm install lucide-react


const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    // State to control the signature window
    const [signatureModal, setSignatureModal] = useState({ isOpen: false, url: null });
    // The backend URL where Laravel serves storage files
    const backendUrl = "http://localhost:8000";

    // States for Edit Mode
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Initial form state
    const initialFormState = {
        first_name: '',
        last_name: '',
        user_type: 'operator',
        email: '',
        cin: '',
        department_id: '',
        position: '',
        end_date: ''
    };
    const [formData, setFormData] = useState(initialFormState);
    // ... (Your other states: users, loading, etc.)

    // States for Search & Debounce
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce: wait 300ms after user stops typing before filtering
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Filter users by name, department, and CIN only
    const filteredUsers = users.filter((user) => {
        const s = debouncedSearch.toLowerCase();
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();

        return (
            (user.firstName || '').toLowerCase().includes(s) ||
            (user.lastName || '').toLowerCase().includes(s) ||
            fullName.includes(s) ||
            (user.department || '').toLowerCase().includes(s) ||
            (user.cin || '').toLowerCase().includes(s)
        );
    });

    // Hardcoded main departments
    const departments = [
        { id: 1, name: 'Manufacturing Engineering' },
        { id: 2, name: 'Production' },
        { id: 3, name: 'Logistics' },
        { id: 4, name: 'Finance' },
        { id: 5, name: 'QHSE' },
        { id: 6, name: 'HR' },
        { id: 7, name: 'Facilities' },
        { id: 8, name: 'R&D' },
        { id: 9, name: 'Maintenance' }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/employees');
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Open Add Modal
    const handleOpenAdd = () => {
        setFormData(initialFormState);
        setIsEditMode(false);
        setSelectedUserId(null);
        setIsModalOpen(true);
    };

    // Open Edit Modal and pre-fill data
    const handleOpenEdit = (user) => {
        // Find department ID if backend only returns department name
        const deptId = user.department_id || departments.find(d => d.name === user.department)?.id || '';

        setFormData({
            first_name: user.firstName || '',
            last_name: user.lastName || '',
            user_type: user.userType || 'operator',
            email: user.email || '',
            cin: user.cin || '',
            department_id: deptId,
            position: user.position || '',
            end_date: user.end_date || '' // Make sure backend sends this if stagiaire
        });
        setIsEditMode(true);
        setSelectedUserId(user.id);
        setIsModalOpen(true);
    };

    // Handle Deactivate / Activate (Soft Delete)
    const handleToggleStatus = async (id, currentStatus) => {
        const action = currentStatus ? "deactivate" : "activate";
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            // Send PATCH request to a dedicated toggle endpoint
            await api.patch(`/employees/${id}/toggle-status`, { is_active: !currentStatus });
            fetchUsers();
        } catch (error) {
            console.error(`Error trying to ${action} user:`, error);
            alert(`Failed to ${action} user. Check console.`);
        }
    };

    // Success Credentials state
    const [credentials, setCredentials] = useState(null);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);

    // Auto-generate email: [first_letter_of_first_name].[last_name]@mta.ma
    useEffect(() => {
        // get the first name and last name (we made probabilities of the names that can be named in the state)
        const prenom = formData.first_name || formData.firstName || formData.prenom || '';
        const nom = formData.last_name || formData.lastName || formData.nom || '';

        // make sure the last name is written and the user is not a visitor
        if (nom && formData.user_type !== 'visitor') {
            // remove spaces from the last name and make it lowercase
            const cleanLastName = nom.toLowerCase().replace(/\s+/g, '');

            // first condition: if the user is an admin
            if (formData.user_type === 'admin') {
                setFormData(prev => ({
                    ...prev,
                    email: `admin.${cleanLastName}@mta.ma`
                }));
            }
            // second condition: if the user is an operator or stagiaire (and the name is written)
            else if (prenom && (formData.user_type === 'operator' || formData.user_type === 'stagiaire')) {
                const firstLetter = prenom.charAt(0).toLowerCase();
                setFormData(prev => ({
                    ...prev,
                    email: `${firstLetter}.${cleanLastName}@mta.ma`
                }));
            }
        }
        // third condition: if the user is a visitor
        else if (formData.user_type === 'visitor') {
            setFormData(prev => ({ ...prev, email: '' }));
        }

        // this line below tells React to re-run this code every time the name, last name, or user type changes
    }, [formData.first_name, formData.firstName, formData.prenom, formData.last_name, formData.lastName, formData.nom, formData.user_type]);

    // Handle form submission (Both Add and Edit)
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setSubmitLoading(true);

    //     try {
    //         if (isEditMode) {
    //             // Update existing user
    //             await api.put(`/employees/${selectedUserId}`, formData);
    //         } else {
    //             // Create new user (Backend generates password & final email)
    //             const response = await api.post('/employees', formData);

    //             // If it's an operator or intern, show the generated credentials
    //             if (formData.user_type !== 'visitor' && response.data.plain_password) {
    //                 setCredentials({
    //                     email: response.data.generated_email || response.data.user.email,
    //                     password: response.data.plain_password
    //                 });
    //                 setShowCredentialsModal(true);
    //             } else if (formData.user_type === 'visitor') {
    //                 alert(`Visiteur créé. Accès via CIN: ${formData.cin}`);
    //             }
    //         }

    //         fetchUsers();
    //         setIsModalOpen(false);
    //         if (!showCredentialsModal) setFormData(initialFormState);
    //     } catch (error) {
    //         console.error("Error saving user:", error.response?.data || error.message);
    //         alert("Erreur lors de l'enregistrement de l'utilisateur.");
    //     } finally {
    //         setSubmitLoading(false);
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            if (isEditMode) {
                // 1. تحديث مستخدم موجود
                await api.put(`/employees/${selectedUserId}`, formData);
                setIsModalOpen(false); // نسدوا المودال نيشان فـ التعديل
            } else {
                // 2. إنشاء مستخدم جديد (الباكاند كيصايب المودپاس والإيميل)
                const response = await api.post('/employees', formData);
                const data = response.data;

                // اللوجيك الجديد: أي واحد ماشي زائر (آدمن، أوبراتور، سطاجير) خاصنا نوريوه المودپاس
                if (formData.user_type !== 'visitor' && data.plain_password) {
                    setCredentials({
                        email: data.generated_email || data.user.email,
                        password: data.plain_password
                    });

                    // هنا كنحلوا المودال ديال الكريدنشلز
                    setShowCredentialsModal(true);

                    // ⚠️ مهم: ما نسدوش الفورم دابا باش ما تضيعش لينا الداتا تالين يقرأ الآدمن المودپاس
                    setIsModalOpen(false);
                }
                else if (formData.user_type === 'visitor') {
                    alert(`Visiteur créé. Accès via CIN: ${formData.cin}`);
                    setIsModalOpen(false);
                }
            }

            fetchUsers(); // تحديث الجدول

            // ريزيتي الفورم غير إيلا ما كانش غيتفتح المودال ديال المودپاس
            // (باش الداتا تبقى باينة كـ مرجع إيلا وقع مشكل)
            setFormData(initialFormState);

        } catch (error) {
            console.error("Error saving user:", error.response?.data || error.message);
            // إيلا كان كاين ميساج ديال الخطر من الباكاند (بحال إيميل ديجا كاين) نبينوه
            const errorMsg = error.response?.data?.message || "Erreur lors de l'enregistrement.";
            alert(errorMsg);
        } finally {
            setSubmitLoading(false);
        }
    };


    return (
        <MainLayout>
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                        <p className="text-sm text-gray-500">Manage admins, operators, stagiaires, and visitors.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Search Input */}
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search by name, cin, dept..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg pl-3 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                            />
                        </div>

                        <button
                            onClick={handleOpenAdd}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                        >
                            + Add User
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-sm">
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 font-semibold">Department</th>
                                <th className="p-4 font-semibold">Position / CIN</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Formation completed</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">Loading data...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm ${!user.isActive && 'opacity-60'}`}>
                                    <td className="p-4 font-medium text-gray-800">
                                        {user.firstName} {user.lastName}
                                        <div className="text-xs text-gray-500 font-normal">{user.email || 'No Email'}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase
                                            ${user.userType === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                                user.userType === 'operator' ? 'bg-green-100 text-green-700' :
                                                    user.userType === 'stagiaire' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-orange-100 text-orange-700'}`}
                                        >
                                            {user.userType}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">{user.department}</td>
                                    <td className="p-4 text-gray-600">
                                        {user.userType === 'visitor' ? `CIN: ${user.cin}` : user.position}
                                    </td>
                                    <td className="p-4">
                                        {user.isActive ? (
                                            <span className="text-green-600 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div> Active
                                            </span>
                                        ) : (
                                            <span className="text-red-600 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div> Inactive
                                            </span>
                                        )}
                                    </td>
                                    {/* Formation Completed Column */}
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {user.completed_modules && user.completed_modules.length > 0 ? (
                                                user.completed_modules.map((mod, idx) => {
                                                    // الباكاند دابا خاصو يصيفط الداتا كـ Object (فيه slug و signature)
                                                    const slug = typeof mod === 'string' ? mod : mod.module_slug;
                                                    const signaturePath = typeof mod === 'string' ? null : mod.signature;

                                                    const badgeColors = {
                                                        reglement: "bg-green-100 text-green-700 border-green-200",
                                                        assemblage: "bg-blue-100 text-blue-700 border-blue-200",
                                                        tracabilite: "bg-purple-100 text-purple-700 border-purple-200",
                                                        kaizen: "bg-yellow-100 text-yellow-700 border-yellow-200",
                                                        quiz: "bg-pink-100 text-pink-700 border-pink-200",
                                                    };
                                                    // HSE slugs (hse_operator, hse_visitor, hse…) → orange
                                                    const badgeStyle = slug.startsWith('hse')
                                                        ? "bg-orange-100 text-orange-700 border-orange-200"
                                                        : (badgeColors[slug] ?? "bg-teal-100 text-teal-700 border-teal-200");

                                                    // إيلا كانت عندو سينيـاتور، كنردوه clickable
                                                    const isClickable = signaturePath != null;

                                                    return (
                                                        <span
                                                            key={idx}
                                                            onClick={() => {
                                                                if (isClickable) {
                                                                    setSignatureModal({
                                                                        isOpen: true,
                                                                        url: `${backendUrl}/storage/${signaturePath}`
                                                                    });
                                                                }
                                                            }}
                                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-wider shadow-sm transition-all
                                                            ${badgeStyle} 
                                                            ${isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-md ring-2 ring-transparent hover:ring-green-400' : ''}
                                                        `}
                                                            title={isClickable ? "Cliquez pour voir la signature" : ""}
                                                        >
                                                            <CheckCircle size={10} strokeWidth={3} />
                                                            {slug}
                                                        </span>
                                                    );
                                                })
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">Aucun module</span>
                                            )}
                                        </div>
                                    </td>
                                    {/* Actions Column */}
                                    <td className="p-4 flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => handleOpenEdit(user)}
                                            className="text-blue-500 hover:text-blue-700 transition-colors"
                                            title="Edit User"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(user.id, user.isActive)}
                                            className={`${user.isActive ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} transition-colors`}
                                            title={user.isActive ? "Deactivate User" : "Activate User"}
                                        >
                                            <Power size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add/Edit User Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">

                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h2 className="text-lg font-bold text-gray-800">
                                    {isEditMode ? 'Edit User' : 'Add New User'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500 font-bold">
                                    ✕
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">

                                {/* User Type Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                                    <select
                                        name="user_type"
                                        value={formData.user_type}
                                        onChange={handleChange}
                                        disabled={isEditMode}
                                        className={`w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    >
                                        <option value="admin" className="font-bold text-blue-600">Administrateur (Admin)</option>
                                        <option value="operator">Operator (Permanent)</option>
                                        <option value="stagiaire">Stagiaire (Temporary)</option>
                                        <option value="visitor">Visitor (Daily)</option>
                                    </select>
                                </div>

                                {/* Name Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input required type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input required type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                </div>


                                {/* Visitor logic */}
                                {formData.user_type === 'visitor' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CIN (Identity Card)</label>
                                        <input required type="text" name="cin" value={formData.cin} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. K123456" />
                                    </div>
                                )}

                                {/* Operator/stagiaire logic */}
                                {formData.user_type !== 'visitor' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Automatique)</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email || ''}
                                                onChange={handleChange}
                                                readOnly={!isEditMode && formData.user_type !== 'visitor'}
                                                className={`w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${!isEditMode && formData.user_type !== 'visitor' ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                                <select required name="department_id" value={formData.department_id} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                                    <option value="">Select Dept...</option>
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                                <input required type="text" name="position" value={formData.position} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Stagiaire logic */}
                                {formData.user_type === 'stagiaire' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                        <input required type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitLoading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        {submitLoading ? 'Saving...' : (isEditMode ? 'Update User' : 'Save User')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Credentials Success Modal */}
                {showCredentialsModal && credentials && (
                    <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-in fade-in duration-300">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
                            <div className="bg-green-600 p-8 text-white text-center relative">
                                <div className="absolute top-4 right-4">
                                    <button onClick={() => { setShowCredentialsModal(false); setFormData(initialFormState); }} className="text-white/80 hover:text-white transition">✕</button>
                                </div>
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                                    <CheckCircle size={40} strokeWidth={3} />
                                </div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tight">Compte Créé !</h2>
                                <p className="opacity-90 font-medium">L'utilisateur a été ajouté avec succès.</p>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Identifiant (Email)</p>
                                            <p className="font-mono text-sm text-gray-800 truncate select-all font-bold">{credentials.email}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all">
                                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Mot De Passe Temporaire</p>
                                            <p className="font-mono text-lg text-gray-900 truncate select-all font-black tracking-widest">{credentials.password}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                                    <div className="text-amber-600 shrink-0 mt-0.5">⚠️</div>
                                    <p className="text-xs text-amber-800 font-bold leading-relaxed">
                                        Veuillez copier ces informations maintenant. Pour des raisons de sécurité, le mot de passe ne sera plus affiché.
                                    </p>
                                </div>

                                <button
                                    onClick={() => { setShowCredentialsModal(false); setFormData(initialFormState); }}
                                    className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] uppercase tracking-wider"
                                >
                                    C'est Compris
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal ديال Signature */}
                {signatureModal.isOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300"
                        onClick={() => setSignatureModal({ isOpen: false, url: null })} // ملي يكليكي برا تسد
                    >
                        {/* كديرو e.stopPropagation() باش يلا كليكا على التصويرة لداخل ماتسدش النافذة */}
                        <div
                            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden transform animate-in zoom-in-95 duration-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle className="text-green-500" size={20} />
                                    Signature Électronique
                                </h3>
                                <button
                                    onClick={() => setSignatureModal({ isOpen: false, url: null })}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-4 flex justify-center items-center min-h-[200px]">
                                    <img
                                        src={signatureModal.url}
                                        alt="Signature de l'employé"
                                        className="max-h-48 w-full object-contain filter contrast-125"
                                    />
                                </div>
                                <p className="text-center text-xs font-bold text-slate-400 uppercase mt-4">
                                    Document officiel interne - MTA Morocco
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default UserManagement;