import React, {useEffect, useState} from 'react';
import './group-managing.css';
import {
    CREATE_NEW_GROUP,
    DELETE_GROUP,
    GET_ALL_GROUPS,
    UPDATE_GROUP,
} from '../../../config';
import GroupForm from "../group-form/group-form";
import Modal from "../modal";
import authFetch from "../../../utils/netUitls";
import PersonForm from "../person-form/person-form";

const GroupManaging = () => {
    const [studyGroups, setStudyGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [groupsPerPage] = useState(10);
    const [pageSize, setPageSize] = useState(10);      // Количество элементов на странице
    const [totalPages, setTotalPages] = useState(1);   // Общее количество страниц

    const [isEdit, setIsEdit] = useState(false);


    // useEffect(() => {
    //     fetchGroups(currentPage, groupsPerPage);
    // }, [currentPage]);

    useEffect(() => {
        fetchGroups();
    }, [currentPage, pageSize]); // Обновляем данные при смене страницы или размера страницы

    const fetchGroups = async () => {
        setIsLoading(true);
        try {
            const response = await authFetch(
                `${GET_ALL_GROUPS}`)
            const data = await response.json();
            //
            setStudyGroups(data); // Предположим, что сервер возвращает группы под ключом 'groups'
            // setTotalPages(data.totalPages); // Предположим, что сервер возвращает общее количество страниц
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Вы уверены, что хотите удалить эту группу?")) {
            try {
                await authFetch(`${DELETE_GROUP}/${id}`, {method: 'DELETE'});
                fetchGroups(currentPage, groupsPerPage);
            } catch (error) {
                console.error("Ошибка при удалении группы:", error);
            }
        }
    };

    const handleSave = async (newGroup) => {
        return await authFetch(
            `${CREATE_NEW_GROUP}`,
            {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(newGroup),
            }
        )
    };

    const handleEdit = async (group) => {
        return await authFetch(
            `${UPDATE_GROUP}/${group.id}`,
            {
                method: 'PATCH',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(group)
            }
        )
    };

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
        fetchGroups(currentPage, groupsPerPage);
    };

    const nextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="main-page">
            <h1>Список учебных групп</h1>

            {/* Поле для выбора количества элементов на странице */}
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
                                    <button onClick={() =>
                                    {
                                        setIsEdit(true);
                                        setIsFormVisible(true);

                                        let foundGroup = studyGroups.find((study) => study.id === group.id);
                                        if(foundGroup) {
                                            setSelectedGroup(foundGroup);
                                        }else {
                                            console.error("Нихуя мы не нашли, чебурашка");
                                            setIsEdit(false);
                                            setSelectedGroup(null);
                                        }
                                    }}
                                    >
                                        Редактировать
                                    </button>
                                    <button onClick={() => handleDelete(group.id)}>Удалить</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Элементы управления пагинацией */}
                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Назад
                        </button>
                        <span>Страница {currentPage} из {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Вперед
                        </button>
                    </div>
                </>
            )}

            <Modal isOpen={isFormVisible} onClose={handleFormClose}>
                <GroupForm
                    selectedGroup={selectedGroup}
                    onClose={handleFormClose}
                    onSubmit={isEdit ? handleEdit : handleSave}
                />
            </Modal>
        </div>
    );
}

export default GroupManaging;