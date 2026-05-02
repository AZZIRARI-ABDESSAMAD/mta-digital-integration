import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('mta_token');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
