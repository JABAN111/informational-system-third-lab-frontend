import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AuthComponent from "./components/auth-registration/AuthComponent";
import Home from "./components/home/home";
import MainPage from "./components/main-page/main-page";
import GroupManaging from "./components/main-page/groups-managing/group-managing";
import FeaturesPanel from "./components/main-page/features/features-panel";
import AdminPanel from "./components/main-page/admin-panel/admin-panel";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/auth" element={<AuthComponent/>} />
            <Route path="/main-page" element={<MainPage/>} />
            {/*<Route path="/group-management" element={<GroupManaging/>} />*/}
            {/*<Route path="/admin-panel" element={<AdminPanel/>} />*/}
            {/*<Route path="/features-panel" element={FeaturesPanel} />*/}
        </Routes>
    </BrowserRouter>

  // <React.StrictMode>
  // {/*//   <App />*/}
  // {/*// </React.StrictMode>*/}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
