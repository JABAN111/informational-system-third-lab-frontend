import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthComponent from "./components/auth-registration/AuthComponent";
import MainPage from "./components/main-page/main-page";
import PrivateRoute from "./components/auth-registration/private-root";
import Home from "./components/home/home";  // Ваш компонент PrivateRoute

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthComponent />} />
            {/* Защищенный маршрут для /main-page */}
            <Route
                path="/main-page"
                element={<PrivateRoute element={<MainPage />} />}
            />
        </Routes>
    </BrowserRouter>
);