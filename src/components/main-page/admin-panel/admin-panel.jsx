import React, { useEffect, useState } from 'react';
import authFetch from "../../../utils/netUitls";
import { APPROVE_ADMIN, GET_ALL_ADMINS, REJECT_ADMIN } from "../../../config";
import Notification from "../../notification-component/notification";

const AdminPanel = () => {
    const [potentialAdmins, setPotentialAdmins] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);
    const [pageSize, setPageSize] = useState(5); // Количество элементов на странице

    useEffect(() => {
        fetchAdmins();
    }, [currentPage, pageSize]); // Обновляем данные при смене страницы или размера страницы

    const fetchAdmins = () => {
        authFetch(`${GET_ALL_ADMINS}?page=${currentPage - 1}&size=${pageSize}`, {
            method: 'GET',
        })
            .then((res) => res.json())
            .then((data) => {
                setPotentialAdmins(data.body.content); // Данные для текущей страницы
                setTotalPages(data.body.totalPages); // Общее количество страниц
                setFilteredUsers(data.body.content); // Устанавливаем в filteredUsers для поиска
            })
            .catch((err) => console.log(err));
    };

    const handleNotification = (message, type) => {
        setNotification({ message, type });
    };

    // Обработчик поиска
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = potentialAdmins.filter(user =>
            user.username.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
        setCurrentPage(1); // Сбрасываем на первую страницу после поиска
    };

    // Обработчики кнопок "Подтвердить" и "Отклонить"
    const handleApprove = (potentialAdminId) => {
        let messageFromServer;

        const adminToApprove = chosenPotentialAdminForAction(potentialAdminId);
        const userToApprove = adminToApprove.user;
        const body = {
            id: potentialAdminId,
            user: {
                id: userToApprove.id,
                username: userToApprove.username,
                role: "ROLE_USER"
            },
            wantedRole: "ROLE_ADMIN"
        };

        authFetch(`${APPROVE_ADMIN}/${adminToApprove.id}`, {
            method: 'PATCH',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then(res => res.json())
            .then(data => {
                messageFromServer = data.message;
                setPotentialAdmins(potentialAdmins.filter(user => user.id !== potentialAdminId));
                setFilteredUsers(filteredUsers.filter(user => user.id !== potentialAdminId));
                handleNotification(messageFromServer, "success");
            })
            .catch(err => handleNotification(messageFromServer || "Ошибка при одобрении", "error"));
    };

    const chosenPotentialAdminForAction = (id) => {
        return potentialAdmins.find(admin => admin.id === id);
    };

    const handleReject = (potentialAdminId) => {
        let messageFromServer;

        const adminToReject = chosenPotentialAdminForAction(potentialAdminId);
        const userForRejecting = adminToReject.user;

        const potentialAdminToReject = {
            id: potentialAdminId,
            user: {
                id: userForRejecting.id,
                username: userForRejecting.username,
            }
        };

        authFetch(`${REJECT_ADMIN}`, {
            method: 'DELETE',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(potentialAdminToReject),
        })
            .then(res => res.json())
            .then((data) => {
                messageFromServer = data.message;
                handleNotification(messageFromServer, "success");
                setPotentialAdmins(potentialAdmins.filter(user => user.id !== potentialAdminId));
                setFilteredUsers(filteredUsers.filter(user => user.id !== potentialAdminId));
            })
            .catch(err => handleNotification(`${messageFromServer || "ошибка операции"}`, "error"));
    };

    // Переход на другую страницу
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Отображение текущих пользователей на странице
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="admin-panel">
            <h2>Запросы на роль администратора</h2>

            {/* Переключатель для количества элементов на странице */}
            <label>
                Элементов на странице:
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={100}>100</option>
                </select>
            </label>

            <input
                type="text"
                placeholder="Поиск по имени или email"
                value={searchQuery}
                onChange={handleSearch}
            />

            <table>
                <thead>
                <tr>
                    <th>Имя пользователя</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                {currentUsers.map((potentialAdmin) => (
                    <tr key={potentialAdmin.id}>
                        <td>{potentialAdmin.user.username}</td>
                        <td>
                            <button onClick={() => handleApprove(potentialAdmin.id)}>Подтвердить</button>
                            <button onClick={() => handleReject(potentialAdmin.id)}>Отклонить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Назад
                </button>
                <span>Страница {currentPage} из {totalPages}</span>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                    Вперед
                </button>
            </div>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default AdminPanel;