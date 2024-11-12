import React, { useEffect, useState } from 'react';
import './group-managing.css';
import {
    CREATE_NEW_GROUP,
    DELETE_GROUP,
    GET_ALL_GROUPS,
    UPDATE_GROUP, UPDATE_GROUP_ADMIN,
} from '../../../config';
import GroupForm from "../group-form/group-form";
import Modal from "../modal";
import authFetch from "../../../utils/netUitls";
import Notification from "../../notification-component/notification";

const GroupManaging = () => {
    const [studyGroups, setStudyGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Количество элементов на странице
    const [totalPages, setTotalPages] = useState(1); // Общее количество страниц
    const [notification, setNotification] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isEditOnlyAdmin, setIsEditOnlyAdmin] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, [currentPage, pageSize]);

    const fetchGroups = async () => {
        setIsLoading(true);
        try {
            const response = await authFetch(`${GET_ALL_GROUPS}?page=${currentPage - 1}&size=${pageSize}`);
            const data = await response.json();

            setStudyGroups(data.body.content); // данные групп
            setTotalPages(data.body.totalPages); // обновляем общее количество страниц
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotification = (message, type) => {
        setNotification({ message, type });
    };

    const handleDelete = async (id) => {
        try {
            const response = await authFetch(`${DELETE_GROUP}/${id}`, { method: 'DELETE' });
            const data = await response.json();

            if (response.ok) {
                handleNotification(data.message, "success");
                fetchGroups();
            } else if (response.status === 403) {
                handleNotification(`Ошибка: ${data.message}`, "error");
            }
        } catch (error) {
            console.error("Ошибка при удалении:", error);
            handleNotification("Произошла ошибка при удалении", "error");
        }
    };

    const handleSave = async (newGroup) => {
        return await authFetch(`${CREATE_NEW_GROUP}`, {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(newGroup),
        });
    };

    const handleEdit = async (group) => {
        return await authFetch(`${UPDATE_GROUP}/${group.id}`, {
            method: 'PATCH',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(group),
        });
    };
    const handleEditAdminOnly = async (group, newAdmin) => {
        console.log("здесь пиздец")
        console.log(group, newAdmin);

        return await authFetch(`${UPDATE_GROUP_ADMIN}?groupId=${group.id}&adminId=${newAdmin.id}`, {
            method: 'PATCH',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(group)
        })
    }

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredGroups = studyGroups.filter(group =>
        group.name.toLowerCase().includes(filter.toLowerCase())
    );

    const handleFormClose = () => {
        setIsFormVisible(false);
        setSelectedGroup(null);
        setIsEdit(false);
        setIsEditOnlyAdmin(false);
        fetchGroups();
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prevPage => prevPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(prevPage => prevPage - 1);
    };



    const handleModalOpen = () => {
        if(isEdit && isEditOnlyAdmin) {
            return handleEditAdminOnly
        }
        if (isEdit && !isEditOnlyAdmin) {
            return handleEdit
        }else{
            return handleSave
        }

    }

    return (
        <div className="main-page">
            <h1>Список учебных групп</h1>

            <label>
                Элементов на странице:
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </label>

            <input
                type="text"
                placeholder="Поиск по имени группы"
                value={filter}
                onChange={handleFilterChange}
            />
            <button onClick={() => {
                setIsFormVisible(true);
                setSelectedGroup(null);
            }}>
                Добавить группу
            </button>

            {isLoading ? (
                <p>Загрузка...</p>
            ) : (
                <>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Количество студентов</th>
                            <th>Создатель</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredGroups.map(group => (
                            <tr key={group.id}>
                                <td>{group.id}</td>
                                <td>{group.name}</td>
                                <td>{group.studentsCount}</td>
                                <td>{group.groupAdmin.name}</td>
                                <td>
                                    <button onClick={() => {
                                        setIsEdit(true);
                                        setIsFormVisible(true);

                                        let foundGroup = studyGroups.find((study) => study.id === group.id);
                                        if(foundGroup) {
                                            setSelectedGroup(foundGroup);
                                        }else {
                                            setIsEdit(false);
                                            setSelectedGroup(null);
                                        }
                                    }}
                                    >
                                        Редактировать
                                    </button>
                                    <button onClick={() => {
                                        setIsEdit(true);
                                        setIsEditOnlyAdmin(true)
                                        setIsFormVisible(true);

                                        let foundGroup = studyGroups.find((study) => study.id === group.id);
                                        if(foundGroup) {
                                            setSelectedGroup(foundGroup);
                                        }else {
                                            setIsEdit(false);
                                            setIsEditOnlyAdmin(false)
                                            setSelectedGroup(null);
                                        }
                                    }} >Сменить админа</button>
                                    <button onClick={() => handleDelete(group.id)}>Удалить</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage === 1}>Назад</button>
                        <span>Страница {currentPage} из {totalPages}</span>
                        <button onClick={nextPage} disabled={currentPage === totalPages}>Вперед</button>
                    </div>
                </>
            )}

            <Modal isOpen={isFormVisible} onClose={handleFormClose}>
                <GroupForm
                    selectedGroup={selectedGroup}
                    onClose={handleFormClose}
                    onSubmit={handleModalOpen()}
                    editOnlyAdmin={isEditOnlyAdmin}
                    showNotification={handleNotification}
                />
            </Modal>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
}

export default GroupManaging;