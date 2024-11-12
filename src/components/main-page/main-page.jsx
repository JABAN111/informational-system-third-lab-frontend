import React, { useState } from 'react';
import './mainPage.css';
import GroupManaging from "./groups-managing/group-managing";
import PersonManaging from "./person-managing/person-managing";
import AdminPanel from "./admin-panel/admin-panel";
import FeaturesPanel from "./features/features-panel";

const MainPage = () => {
    const [activeTab, setActiveTab] = useState('groupManagement'); // По умолчанию выбран раздел управления группами

    const renderContent = () => {
        switch (activeTab) {
            case 'admin':
                return <AdminPanel/>;
            case 'groupManagement':
                return <GroupManaging />;
            case 'personManagement':
                return <PersonManaging />;
            case 'features':
                return <>
                    <FeaturesPanel/></>
            default:
                return <GroupManaging/>;
        }
    };

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
                    </ul>
                </nav>
            </header>

            <main>
                {renderContent()} {/* Отображаем контент в зависимости от выбранной вкладки */}
            </main>
        </div>
    );
};

export default MainPage;