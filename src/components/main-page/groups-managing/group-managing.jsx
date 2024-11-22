import React, {useEffect, useRef, useState} from 'react';
import './group-managing.css';
import {
    CREATE_NEW_GROUP,
    DELETE_GROUP,
    GET_ALL_GROUPS,
    GET_FILTERED_GROUPS, GET_PERSONS,
    UPDATE_GROUP,
    UPDATE_GROUP_ADMIN,
} from '../../../config';
import GroupForm from "../group-form/group-form";
import Modal from "../modal";
import authFetch from "../../../utils/netUitls";
import Notification from "../../notification-component/notification";

const GroupManaging = () => {
    const [studyGroups, setStudyGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [notification, setNotification] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isEditOnlyAdmin, setIsEditOnlyAdmin] = useState(false);
    const [sortColumn, setSortColumn] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [filterParams, setFilterParams] = useState({});
    const [people, setPeople] = useState([])
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");

    useEffect(() => {
        const date = new Date();
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();

        const minYear = yyyy - 80;
        const maxYear = yyyy - 18;

        const min = `${minYear}-${mm}-${dd}`;
        const max = `${maxYear}-${mm}-${dd}`;

        setMinDate(min);
        setMaxDate(max);
    }, []);


    const formsOfEducation = {
        DISTANCE_EDUCATION: "дистанционное обучение",
        FULL_TIME_EDUCATION: "очное обучение",
        EVENING_CLASSES: "заочное обучение"
    };

    const currentSemester = {
        SECOND: "Второй",
        THIRD: "Третий",
        FIFTH: "Пятый",
        EIGHT: "Восьмой"
    };

    useEffect(() => {
        fetchGroups();
    }, [currentPage, pageSize, sortColumn, sortDirection]);

    // useEffect(() => {

        // console.log(updatedGroups);
        // setStudyGroups(updatedGroups);
    // }, []);

    useEffect(() => {
        fetchPeople()
    }, [])

    // const fetchGroups = async () => {
    //     setIsLoading(true);
    //     let message = ': ';
    // }
    //
    const fetchGroups = async () => {
        setIsLoading(true); // Показываем индикатор загрузки
        let message = ": ";
        try {
            // Запрос данных
            const response = await authFetch(`${GET_ALL_GROUPS}?page=${currentPage - 1}&size=${pageSize}&sortBy=${sortColumn}&sortDirection=${sortDirection}`);
            const data = await response.json();

            console.log("Полученные данные:", data);

            message += data.message; // Добавляем сообщение

            // Обновляем общее количество страниц
            setTotalPages(data.body.totalPages);

            // Логика для заполнения массива updatedGroups
            const username = localStorage.getItem('username') || '';
            const role = localStorage.getItem('role') || '';
            let isAdmin = false;
            if(role !== ''){
                isAdmin = 'ROLE_ADMIN' === localStorage.getItem('role');
                console.log(isAdmin);
            }

            const updatedGroups = data.body.content.map((group) => {
                // Используйте нужный creator (выберите groupAdmin или верхний уровень creator)
                const creatorUsernameOfCurrentGroup = group.creator?.username || ''; // Если нужен creator из group
                let canEdit;
                if(!isAdmin) {
                    canEdit = creatorUsernameOfCurrentGroup === username;
                } else {
                    canEdit = true;
                }

                return {
                    ...group,
                    canEdit,
                };
            });
            // Обновляем состояние studyGroups
            setStudyGroups(updatedGroups);
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
            handleNotification("Ошибка при получении данных " + (message.length > 2 ? message : ''), "error");
        } finally {
            setIsLoading(false); // Скрываем индикатор загрузки
        }
    };

    // const processArray = async (array) => {
    //     for()
    // }

    const applyFilter = async () => {
        setIsLoading(true);
        let messageFromServer = 'data';


        const queryParams = new URLSearchParams({
            ...filterParams,
            page: currentPage - 1,
            size: pageSize,
            sortBy: sortColumn,
            sortDirection: sortDirection,
        });

        await authFetch(`${GET_FILTERED_GROUPS}?${queryParams.toString()}`).then((data) => data.json()).then((data) => {
            messageFromServer = data.message;
            // setStudyGroups(data.body.content)



            const username = localStorage.getItem('username') || '';
            const role = localStorage.getItem('role') || '';
            let isAdmin = false;
            if(role !== ''){
                isAdmin = 'ROLE_ADMIN' === localStorage.getItem('role');
                console.log(isAdmin);
            }

            const updatedGroups = data.body.content.map((group) => {
                // Используйте нужный creator (выберите groupAdmin или верхний уровень creator)
                const creatorUsernameOfCurrentGroup = group.creator?.username || ''; // Если нужен creator из group
                let canEdit;
                if(!isAdmin) {
                    canEdit = creatorUsernameOfCurrentGroup === username;
                }else{
                    canEdit = true;
                }

                return {
                    ...group,
                    canEdit,
                };
            });
            setStudyGroups(updatedGroups);
            setTotalPages(data.body.totalPages)
            handleNotification("фильтрация завершена", "success")




            setIsLoading(false);
        }).catch(() => {
            handleNotification(messageFromServer || "ошибка фильтрации", "error")
            setIsLoading(false);
        })

    };

    const fetchPeople = async () => {
        let message = ": ";
        try {
            const response = await authFetch(GET_PERSONS);
            const data = await response.json();

            if (data.body && Array.isArray(data.body.content)) { // Проверка, что data.body.content — массив
                setPeople(data.body.content);

            } else {
                console.error("Полученные данные не содержат ожидаемый массив content:", data);
                handleNotification("Ошибка при получении данных", "error")
                setPeople([]);
            }
        } catch (error) {
            handleNotification("Ошибка при получении данных", "error");
            setPeople([]);
        }
    };

    const handleNotification = (message, type) => {
        setNotification({message, type});
    };

    const handleDelete = async (id) => {
        try {
            const response = await authFetch(`${DELETE_GROUP}/${id}`, {method: 'DELETE'});
            const data = await response.json();
            if (response.ok) {
                handleNotification(data.message, "success");
                fetchGroups();
            } else {
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
            headers: {"content-type": "application/json"},
            body: JSON.stringify(newGroup),
        });
    };

    const handleEdit = async (group) => {
        return await authFetch(`${UPDATE_GROUP}/${group.id}`, {
            method: 'PATCH',
            headers: {"content-type": "application/json"},
            body: JSON.stringify(group),
        });
    };

    const handleEditAdminOnly = async (group, newAdmin) => {
        return await authFetch(`${UPDATE_GROUP_ADMIN}?groupId=${group.id}&adminId=${newAdmin.id}`, {
            method: 'PATCH',
            headers: {"content-type": "application/json"},
            body: JSON.stringify(group)
        });
    };

    const handleFilterChange = (e) => {
        setFilterParams({...filterParams, [e.target.name]: e.target.value});
    };

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

    const handleSort = (column) => {
        setSortDirection(sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc');
        setSortColumn(column);
        fetchGroups();
    };

    const handleModalOpen = () => isEdit ? (isEditOnlyAdmin ? handleEditAdminOnly : handleEdit) : handleSave;

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

            <div className="filter-form">
                <input type="text" placeholder="Имя" name="name" value={filterParams.name || ''}
                       onChange={handleFilterChange}/>
                <input type="number" placeholder="Количество студентов" name="studentsCount"
                       value={filterParams.studentsCount || ''} onChange={handleFilterChange}/>
                <select id="education-form" name="formOfEducation" value={filterParams.formOfEducation}
                        onChange={handleFilterChange}>
                    <option>Выберите форму обучения</option>

                    {Object.keys(formsOfEducation).map((form) => (
                        <option name="formOfEducation" key={form} value={form}>{formsOfEducation[form]}</option>
                    ))}
                </select>
                <select
                    id="semester"
                    name="semester"
                    value={filterParams.currentSemester}
                    onChange={handleFilterChange}>
                    <option>Выберите семестр</option>
                    {Object.keys(currentSemester).map((form) => (
                        <option name="semester" key={form} value={form}>{currentSemester[form]}</option>
                    ))}
                </select>
                <input id="createdAfter"
                       type="date"
                       name="createdAfter"
                       min={minDate}
                       max={maxDate}
                       value={filterParams.createdAfter || ''} onChange={handleFilterChange}
                />

                <input
                    id="filterShouldBeExpelled"
                    type="number"
                    name="shouldBeExpelled"
                    placeholder="к отчислению"
                    value={filterParams.shouldBeExpelled}
                    onChange={handleFilterChange}/>
                <input
                    id="filterAverageMark"
                    type="number"
                    name="averageMark"
                    placeholder={"Средняя оценка"}
                    onChange={handleFilterChange}
                />
                <input
                    id="filterExpelledStudents"
                    type="number"
                    name="ExpelledStudents"
                    placeholder={"Отчисленные студенты"}
                    onChange={handleFilterChange}
                />
                <input
                    id="filterTransferredStudents"
                    type="number"
                    name="transferredStudents"
                    placeholder={"Переведенные студенты"}
                    onChange={handleFilterChange}
                />

                <select
                    id="admin"
                    name="admin"
                    value={filterParams.admin || ''}
                    onChange={handleFilterChange}
                >
                    <option value="">Выберите админа</option>
                    {people.map(person => (
                        <option key={person.id} value={person.id}>
                            {person.name}
                        </option>
                    ))}
                </select>


                <button onClick={applyFilter}>Применить фильтр</button>
            </div>

            <button onClick={() => {
                setIsFormVisible(true);
                setSelectedGroup(null);
            }}>Добавить группу
            </button>

            {isLoading ? (
                <p>Загрузка...</p>
            ) : (
                <>
                    <div className="group-table-div">
                        <table className={"group-table"}>
                            <thead>
                            <tr>
                                {['id', 'name', 'coordinates', 'creationDate', 'studentsCount', 'expelledStudents', 'transferredStudents', 'formOfEducation', 'shouldBeExpelled', 'averageMark', 'semesterEnum'].map(col => (
                                    <th key={col}>
                                        <button onClick={() => handleSort(col)}>{col}</button>
                                    </th>
                                ))}
                                <th>Создатель</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {studyGroups.map(group => (
                                <tr key={group.id}>
                                    <td>{group.id}</td>
                                    <td>{group.name}</td>
                                    <td>{group.coordinates?.x}</td>
                                    <td>{group.creationDate}</td>
                                    <td>{group.studentsCount}</td>
                                    <td>{group.expelledStudents}</td>
                                    <td>{group.transferredStudents}</td>
                                    <td>{group.formOfEducation}</td>
                                    <td>{group.shouldBeExpelled}</td>
                                    <td>{group.averageMark}</td>
                                    <td>{group.semesterEnum}</td>
                                    <td>{group.groupAdmin?.name}</td>
                                    <td>
                                        {group.canEdit ? (
                                            <>
                                        <button
                                            onClick={() => {
                                            setIsEdit(true);
                                            setIsFormVisible(true);
                                            setSelectedGroup(group);
                                        }}>Редактировать
                                        </button>
                                        <button
                                            onClick={() => {
                                            setIsEdit(true);
                                            setIsEditOnlyAdmin(true);
                                            setIsFormVisible(true);
                                            setSelectedGroup(group);
                                        }}>Сменить админа
                                        </button>
                                        <button onClick={() => handleDelete(group.id)}>Удалить</button>
                                            </> ):( <>У вас не достаточно прав на взаимодействие с этой группой</>)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

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
            {notification && <Notification type={notification.type} message={notification.message}
                                           onClose={() => setNotification(null)}/>}
        </div>
    );
};

export default GroupManaging;