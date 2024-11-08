import React, {useEffect, useState} from 'react';
import './person-managing.css';
import {CREATE_PERSON, DELETE_PERSON, GET_PERSONS, UPDATE_PERSON} from '../../../config';
import Modal from "../modal";
import PersonForm from "../person-form/person-form";
import authFetch from "../../../utils/netUitls";

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

    useEffect(() => {
        fetchPeople();
    }, [currentPage]);

    const fetchPeople = async () => {
        setIsLoading(true);
        try {
            const response = await authFetch(`${GET_PERSONS}`);
            const data = await response.json();
            console.log(data);

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
                await fetch(`${DELETE_PERSON}/${id}`, {
                    method: 'DELETE'
                });
                fetchPeople(); // Обновляем список людей
            } catch (error) {
                console.error("Error deleting person:", error);
            }
        }
    };

    const handleEdit = async (updatedPerson) => {

        return await fetch(
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
                        <th>ID</th>
                        <th>Name</th>
                        <th>Eye Color</th>
                        <th>Hair Color</th>
                        <th>Height</th>
                        <th>Weight</th>
                        <th>Passport ID</th>
                        <th>Actions</th>
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
                            <td>
                                <button onClick={() => {
                                    setIsEdit(true)
                                    setIsFormVisible(true);
                                    let foundPerson = people.find(person => person.id === pers.id);
                                    if(foundPerson) {
                                        console.log(foundPerson);
                                        setSelectedPerson(foundPerson)
                                    }else {
                                        console.error("Impossible person with id: ", pers.id);
                                        setIsEdit(false);
                                        setSelectedPerson(null);
                                    }
                                }
                                }>Изменить данные
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
                />
            </Modal>
        </div>
    );
}

export default PersonManaging;