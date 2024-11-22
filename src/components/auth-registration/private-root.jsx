import React, {useState, useEffect} from 'react';
import {Navigate} from "react-router-dom";
import authFetch from "../../utils/netUitls";

const isAuthenticated = async () => {
    const sessionId = sessionStorage.getItem('sessionId');

    if (!sessionId) {
        return false;
    }

    try {
        const response = await authFetch('http://localhost:8080/api/v1/auth/is-token-valid', {

            method: 'GET',

        });

        await localStorage.setItem('role', await response.text())

        return response.ok;
    } catch (error) {
        console.error('Error checking authentication status:', error);
        return false;
    }
};


const PrivateRoute = ({element}) => {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await isAuthenticated();
            setAuthenticated(authStatus);
        };

        checkAuth();
    }, []);

    if (authenticated === null) {
        return <div>Loading...</div>; // Пока проверяем, показываем загрузку
    }

    return authenticated ? element : <Navigate to="/auth" replace/>;
};

export default PrivateRoute;