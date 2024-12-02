import React, { useEffect, useState } from 'react';
import Modal from "../modal";
import authFetch from "../../../utils/netUitls";
import {
    DELETE_GROUP_BY_ADMIN,
    GET_LIST_AVERAGES,
    GET_PERSONS,
    GET_TOTAL_EXPELLED_STUDENTS,
    GROUP_UP_BY_FORM_OF_EDUCATION,
    UPDATE_GROUP_ADMIN
} from "../../../config";
import Notification from "../../notification-component/notification";
import DeleteFeature from "./delete-feature";

const FeaturesPanel = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDelete, setIsModalDelete] = useState(false);

    const [modalContent, setModalContent] = useState(null);
    const [adminToDelGroup, setAdminToDelGroup] = useState('затычка');
    const [people, setPeople] = useState([]);
    const [notification, setNotification] = useState(null);
    const [averageMarks, setAverageMarks] = useState([]); // Состояние для хранения уникальных значений averageMark
    const [totalExpelledStudents, setTotalExpelledStudents] = useState(0);
    const [adminToUpdateGroup, setAdminToUpdateGroup] = useState(null);
    const [isUserAdmin, setIsUserAdmin] = useState(false);


    useEffect(() => {
        const role = localStorage.getItem('role')
        setIsUserAdmin(role && role !== 'ROLE_ADMIN');
    }, []);

    // Функция для открытия модального окна с контентом
    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const handleNotification = (message, type) => {
        setNotification({ message, type });
    };

    // Функция для отображения таблицы группировки по formOfEducation
    const renderGroupByFormTable = (data) => (
        <div>
            <h1>Результат группировки по formOfEducation</h1>
            <table>
                <thead>
                <tr>
                    <th>Форма обучения</th>
                    <th>Количество</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{Object.keys(item)[0]}</td>
                        <td>{item[Object.keys(item)[0]]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
    // Обработчик для группировки по formOfEducation
    const handleGroupByFormOfEducation = () => {
        authFetch(`${GROUP_UP_BY_FORM_OF_EDUCATION}`, { method: "GET" })
            .then(response => response.json())
            .then(data => {
                if (data.body) {
                    openModal(renderGroupByFormTable(data.body));
                } else {
                    openModal(<p>Данные не найдены</p>);
                }
            })
            .catch(err => {
                console.log(err);
                openModal(<p>Ошибка при загрузке данных</p>);
            });
    };

    // Функция для получения списка людей (для удаления)
    const fetchPeople = async () => {
        try {
            const response = await authFetch(GET_PERSONS);
            const data = await response.json();
            setPeople(data.body.content);
            setAdminToDelGroup(data.body.content[0]); // Задаем adminToDelGroup после загрузки
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
            setPeople([]); // Устанавливаем пустой массив в случае ошибки
        }
    };

    useEffect(() => {
        fetchPeople();
    }, []);

    const handleDeleteAdmin = () => {
        setIsModalOpen(true);
        setIsModalDelete(true)
    };

    const handleUniqueValueOfAverageMark = async () => {
        try {
            const response = await authFetch(`${GET_LIST_AVERAGES}`, { method: "GET" });
            const data = await response.json();

            if (data.body) {
                setAverageMarks(data.body);
                const renderUniqueValue = (
                    <div>
                        <h1>Уникальные значения Average Mark</h1>
                        <table>
                            <thead>
                            <tr>
                                <th>Средний балл</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.body.map((mark, index) => (
                                <tr key={index}>
                                    <td>{mark}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                );
                openModal(renderUniqueValue);
            } else {
                openModal(<p>Данные не найдены</p>);
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
            openModal(<p>Ошибка при загрузке данных</p>);
        }
    };

    // Обработчик для подсчета отчисленных студентов
    const handleGettingTotalExpelledStudents = async () => {
        try {
            const response = await authFetch(`${GET_TOTAL_EXPELLED_STUDENTS}`, { method: "GET" });
            const data = await response.json();
            const expelledCount = data.body;
            if (data.body) {
                const renderExpelledBlock = (
                    <div>
                        <table>
                            <thead>
                            <tr>
                                <th>Отчисленных студентов</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{expelledCount}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                );
                openModal(renderExpelledBlock);
            } else {
                openModal(<h1>Отсутствуют созданные группы</h1>);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const actions = [
        {
            name: "Удалить группу по админу",
            description: "Удаляет один объект, у которого поле эквивалентно заданному значению.",
            buttonText: !isUserAdmin ? "Удалить" : "У вас нет прав",
            styles: {
                backgroundColor: isUserAdmin ? "#ccc" : "#007bff",
                color: isUserAdmin ? "#999" : "#fff",
                cursor: isUserAdmin ? "not-allowed" : "pointer",
                opacity: isUserAdmin ? 0.6 : 1,
                border: "1px solid #ddd",
                padding: "10px 20px",
                borderRadius: "4px",
                transition: "all 0.2s ease"
            },
            onClick: handleDeleteAdmin,
            disable: isUserAdmin
        },
        {
            name: "Сгруппировать по formOfEducation",
            description: "Группирует объекты по значению поля formOfEducation и возвращает количество объектов в каждой группе.",
            buttonText: "Сгруппировать",
            onClick: handleGroupByFormOfEducation,
            disable: false
        },
        {
            name: "Получить уникальные значения averageMark",
            description: "Возвращает массив уникальных значений поля averageMark по всем объектам.",
            buttonText: "Получить значения",
            onClick: handleUniqueValueOfAverageMark,
            disable: false
        },
        {
            name: "Посчитать число отчисленных студентов",
            description: "Подсчитывает общее число отчисленных студентов во всех группах.",
            buttonText: "Посчитать",
            onClick: handleGettingTotalExpelledStudents,
            disable: false
        },
    ];

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>Действие</th>
                    <th>Описание</th>
                    <th>Кнопка</th>
                </tr>
                </thead>
                <tbody>
                {actions.map((action, index) => (
                    <tr key={index}>
                        <td>{action.name}</td>
                        <td>{action.description}</td>
                        <td>
                            <button style={action.styles} disabled={action.disable} onClick={action.onClick}>{action.buttonText}</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/*модалка исключительно чтобы окно удаление открывать*/}
            <Modal
                isOpen={isModalOpen && isModalDelete}
                onClose={() => {setIsModalOpen(false); setIsModalDelete(false)}}
            >
                <DeleteFeature onClose={() => {setIsModalOpen(false); setIsModalDelete(false)}}/>
            </Modal>
            {/* Модальное окно */}
            <Modal
                isOpen={!isModalDelete && isModalOpen}
                onClose={() => setIsModalOpen(false)}>
                {modalContent}
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

export default FeaturesPanel;