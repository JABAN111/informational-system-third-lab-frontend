import React, {useEffect, useState} from 'react';
import './mainPage.css';
import GroupManaging from "./groups-managing/group-managing";
import PersonManaging from "./person-managing/person-managing";
import AdminPanel from "./admin-panel/admin-panel";
import FeaturesPanel from "./features/features-panel";
import OptionalTask from "./optional-task/optional-task";
import {Link, useNavigate} from "react-router-dom";
import authFetch from "../../utils/netUitls";
import ListToDownload from "./list-files/ListToDownload";

const MainPage = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('groupManagement');
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState(null);

    const roles = {
        ROLE_USER: "Обычный пользователь",
        ROLE_ADMIN: "Администратор"
    };

    useEffect(() => {
        getUserName()
        getUserRole()
    }, []);


    const getUserName = () => {
        authFetch(`http://localhost:8080/api/v1/auth/get-username`,
            {method: "GET"}).then((response) => {
            response.json().then((data) => {
                setUsername(data.body);
            }).catch((error) => {
                console.error('Error getting user role:', error);
            })
        })
    }
    const getUserRole = () => {
        authFetch(
            "http://localhost:8080/api/v1/auth/get-role",
            {method: "GET"}
        ).then((response) => {
            response.json().then((data) => {
                setRole(roles[data.body])
            }).catch((error) => {
                console.error('Error getting user role:', error);
            })
        })
    }


    const renderContent = () => {
        switch (activeTab) {
            case 'admin':
                return <AdminPanel />;
            case 'groupManagement':
                return <GroupManaging />;
            case 'personManagement':
                return <PersonManaging />;
            case 'features':
                return <>
                    <FeaturesPanel /></>
            case 'extra-task':
                return <>
                    <OptionalTask />
                </>
            case 'operations':
                return <ListToDownload/>
            default:
                return <GroupManaging/>;
        }
    };

    function leaveAcc() {
        sessionStorage.clear();
        navigate("/auth");
    }

    return (
        <div className="main-page">
            <header className="header">
                <nav>
                    <ul>
                        <li
                            className={activeTab === 'admin' ? 'active' : ''}
                            onClick={() => setActiveTab('admin')}
                        >
                            Админка
                        </li>
                        <li
                            className={activeTab === 'groupManagement' ? 'active' : ''}
                            onClick={() => setActiveTab('groupManagement')}
                        >
                            Управление группами
                        </li>
                        <li
                            className={activeTab === 'personManagement' ? 'active' : ''}
                            onClick={() => setActiveTab('personManagement')}
                        >
                            Управление людьми
                        </li>
                        <li
                            className={activeTab === 'features' ? 'active' : ''}
                            onClick={() => setActiveTab('features')}
                        >
                            Дополнительный функционал
                        </li>
                        <li
                            className={activeTab === 'extra-task' ? 'active' : ''}
                            onClick={() => setActiveTab('extra-task')}
                        >
                            Опциональное задание
                        </li>
                        <li
                            className={activeTab === 'operations' ? 'active' : ''}
                            onClick={() => setActiveTab('operations')}
                            >
                            Операции
                        </li>
                    </ul>
                </nav>
                <div id="account-data">
                    <label htmlFor='username'>Текущий пользователь:</label>
                    <p  id='username'>{username || 'Загрузка'}</p>
                    <label htmlFor={"current-role"}>Текущая роль:</label>
                    <p id="current-role"> {role || 'Загрузка'}</p>
                    <div id={"button-to-leave"}>
                        <button onClick={leaveAcc}>Выйти из аккаунта</button>
                    </div>
                </div>
            </header>

            <main>
                {renderContent()} {/* Отображаем контент в зависимости от выбранной вкладки */}
            </main>
        </div>
    );
};

export default MainPage;