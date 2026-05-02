import { Navigate } from 'react-router-dom';

const EngineerRoute = ({ children }) => {
    const token = localStorage.getItem('mta_token');
    const userString = localStorage.getItem('mta_user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token || !user || !['engineer', 'admin'].includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default EngineerRoute;
