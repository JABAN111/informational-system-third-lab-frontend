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
    const [peoplePerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isEdit, setIsEdit] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchPeople();
    }, [currentPage]);

    const fetchPeople = async () => {
        setIsLoading(true);
        try {
            const response = await authFetch(`${GET_PERSONS}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setPeople(data);
                setTotalPages(Math.ceil(data.length / peoplePerPage));
            } else {
                console.error("Полученные данные не являются массивом:", data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
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

    const handleDelete = async (id) => {
        if (window.confirm("А ТЫ УВЕРЕН, ЧТО НЕ ПРОМАХНУЛСЯ, СУКА?")) {
            try {
                await authFetch(`${DELETE_PERSON}/${id}`, {
                    method: 'DELETE'
                });
                fetchPeople(); // Обновляем список людей
            } catch (error) {
                console.error("Error deleting person:", error);
            }
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
        fetchPeople(); // Обновляем список после изменений
    };

    return (
        <div className="main-page">
            <h1>Управление людьми</h1>
            <div id="manage-page">
                <button onClick={() => {
                    setIsFormVisible(true);
                    setSelectedPerson(null);
                }}>
                    Добавить человека
                </button>
            </div>
            <input
                type="text"
                placeholder="Поиск по имени"
                value={filter}
                onChange={handleFilterChange}
            />

            {isLoading ? (
                <p>Загрузка...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ИД</th>
                        <th>Имя</th>
                        <th>Цвет глаз</th>
                        <th>Цвет волос</th>
                        <th>Рост</th>
                        <th>Вес</th>
                        <th>Паспорт ИД</th>
                        <th>Локация</th>
                        <th>Создал</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPeople.map(pers => (
                        <tr key={pers.id}>
                            <td>{pers.id}</td>
                            <td>{pers.name}</td>
                            <td>{pers.eyeColor}</td>
                            <td>{pers.hairColor}</td>
                            <td>{pers.height}</td>
                            <td>{pers.weight}</td>
                            <td>{pers.passportID}</td>
                            <td>{pers.location.name}</td>
                            <td>{pers.creator.username}</td>
                            <td>
                                <button onClick={() => {
                                    setIsEdit(true);
                                    setIsFormVisible(true);
                                    setSelectedPerson(pers);
                                }}>
                                    Изменить данные
                                </button>
                                <button onClick={() => handleDelete(pers.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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