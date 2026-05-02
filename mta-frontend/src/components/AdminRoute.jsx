import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('mta_token');

    // getting the user data to check the role
    // (make sure of the name used when saving the user in localStorage, whether it's 'user' or another name)
    const userString = localStorage.getItem('mta_user');
    const user = userString ? JSON.parse(userString) : null;

    // if there is no token, or no user, or the user's role is not admin -> redirect them!
    if (!token || !user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // if everything is fine, let them see the page
    return children;
};

export default AdminRoute;