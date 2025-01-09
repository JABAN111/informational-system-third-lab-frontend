import React, { useEffect, useState } from 'react';
import './person-managing.css';
import { CREATE_PERSON, DELETE_PERSON, GET_PERSONS, UPDATE_PERSON } from '../../../config';
import Modal from "../modal";
import PersonForm from "../person-form/person-form";
import authFetch from "../../../utils/netUitls";
import Notification from "../../notification-component/notification";

const PersonManaging = () => {
    const [people, setPeople] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedPerson, setSelectedPerson] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isEdit, setIsEdit] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchPeople();
    }, [currentPage, pageSize]);

    const fetchPeople = async () => {
        setIsLoading(true); // Показываем индикатор загрузки
        let message = ": ";
        try {
            // Запрос данных
            const response = await authFetch(`${GET_PERSONS}?page=${currentPage - 1}&size=${pageSize}`);
            const data = await response.json();

            message += data.message; // Добавляем сообщение

            if (data && data.body) {
                // Обновляем общее количество страниц
                setTotalPages(data.body.totalPages || 1);

                const username = localStorage.getItem('username') || '';
                const role = localStorage.getItem('role') || '';
                let isAdmin = false;

                if (role !== '') {
                    isAdmin = 'ROLE_ADMIN' === localStorage.getItem('role');
                    console.log(isAdmin);
                }

                const updatedPeople = data.body.content.map((person) => {
                    const creatorUsernameOfCurrentPerson = person.creator?.username || '';

                    let canEdit;

                    // Логика для определения права редактировать
                    if (!isAdmin) {
                        canEdit = creatorUsernameOfCurrentPerson === username;
                    } else {
                        canEdit = true;
                    }

                    return {
                        ...person,
                        canEdit,
                    };
                });
                setPeople(updatedPeople); // Обновляем состояние с учетом canEdit
            }
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
            handleNotification("Ошибка при получении данных " + (message.length > 2 ? message : ''), "error");
        } finally {
            setIsLoading(false); // Останавливаем индикатор загрузки
        }
    };

    const handleNotification = (message, type) => {
        setNotification({ message, type });
    };

    const handleSave = async (newPerson) => {
        return await authFetch(
            `${CREATE_PERSON}`,
            {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(newPerson),
            }
        )
    };

    const handleDelete = async (passportId) => {
        try {
            const response = await authFetch(`${DELETE_PERSON}/${passportId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (response.ok) {
                handleNotification(`${data.message}`, "success");
                fetchPeople();
            } else if(response.status === 403) {
                handleNotification(`Ошибка: ${data.message}`, "error");
            }
        } catch (error) {
            console.error("Ошибка при удалении:", error);
            handleNotification("Произошла ошибка при удалении", "error");
        }
    };

    const handleEdit = async (updatedPerson) => {
        return await authFetch(
            `${UPDATE_PERSON}`,
            {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(updatedPerson),
            }
        )
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
    );

    const handleFormClose = () => {
        setIsFormVisible(false);
        setSelectedPerson(null);
        setIsEdit(false);
        fetchPeople();
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="main-page">
            <h1>Управление людьми</h1>

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
                placeholder="Поиск по имени"
                value={filter}
                onChange={handleFilterChange}
            />
            <button onClick={() => {
                setIsFormVisible(true);
                setSelectedPerson(null);
            }}>
                Добавить человека
            </button>

            {isLoading ? (
                <p>Загрузка...</p>
            ) : (
                <>
                    <table>
                        <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Цвет глаз</th>
                            <th>Цвет волос</th>
                            <th>Рост</th>
                            <th>Вес</th>
                            <th>Паспорт ИД</th>
                            <th>Локация</th>
                            {/*<th>Создал</th>*/}
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPeople.map(person => (
                            <tr key={person.passportID}>
                                <td>{person.name}</td>
                                <td>{person.eyeColor}</td>
                                <td>{person.hairColor}</td>
                                <td>{person.height}</td>
                                <td>{person.weight}</td>
                                <td>{person.passportID}</td>
                                <td>{person.location.name}</td>
                                {person.canEdit ?
                                    <td>
                                        <button onClick={() => {
                                            setIsEdit(true);
                                            setIsFormVisible(true);
                                            setSelectedPerson(person);
                                        }}>
                                            Изменить данные
                                        </button>
                                        <button onClick={() => handleDelete(person.passportID)}>Удалить</button>
                                    </td> :
                                    <>
                                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <img src="/never.gif" alt="вы не можете редактировать этот объект"
                                                 width={50} height={50}/>
                                        </div>
                                    </>

                                }
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage === 1}>
                            Назад
                        </button>
                        <span>Страница {currentPage} из {totalPages}</span>
                        <button onClick={nextPage} disabled={currentPage === totalPages}>
                            Вперед
                        </button>
                    </div>
                </>
            )}

            <Modal isOpen={isFormVisible} onClose={handleFormClose}>
                <PersonForm
                    selectedPerson={selectedPerson}
                    onClose={handleFormClose}
                    onSubmit={isEdit ? handleEdit : handleSave}
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
};

export default PersonManaging;