import React, { useEffect, useState } from 'react';
import Modal from "../modal";
import authFetch from "../../../utils/netUitls";
import {
    DELETE_GROUP_BY_ADMIN,
    GET_LIST_AVERAGES,
    GET_PERSONS,
    GET_TOTAL_EXPELLED_STUDENTS,
    GROUP_UP_BY_FORM_OF_EDUCATION, UPDATE_GROUP_ADMIN
} from "../../../config";
import Notification from "../../notification-component/notification";

const FeaturesPanel = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [adminToDelGroup, setAdminToDelGroup] = useState(null);
    const [people, setPeople] = useState([]);
    const [notification, setNotification] = useState(null);
    const [averageMarks, setAverageMarks] = useState([]); // Состояние для хранения уникальных значений averageMark
    const [totalExpelledStudents, setTotalExpelledStudents] = useState(0);
    const [adminToUpdateGroup, setAdminToUpdateGroup] = useState(null);



    // Функция для открытия модального окна с контентом
    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const handleNotification = (message, type) => {
        setNotification({ message, type });
    };
    // Функция для отображения таблицы
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
                        <td>{item.count_by_form_of_education.value.split(',')[0].replace('(', '')}</td>
                        <td>{item.count_by_form_of_education.value.split(',')[1].replace(')', '')}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    // Обработчик для группировки по formOfEducation
    const handleGroupByFormOfEducation = () => {
        authFetch(`${GROUP_UP_BY_FORM_OF_EDUCATION}`, {
            method: "GET"
        })
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

    // Функция для фетчинга списка людей
    const fetchPeople = async () => {
        try {
            const response = await authFetch(GET_PERSONS);
            const data = await response.json();

            if (data.body && Array.isArray(data.body.content)) {
                setPeople(data.body.content);
            } else {
                console.error("Полученные данные не содержат ожидаемый массив content:", data);
                setPeople([]); // Устанавливаем пустой массив в случае ошибки
            }
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
            setPeople([]); // Устанавливаем пустой массив в случае ошибки
        }
    };

    // Используем useEffect для загрузки людей при монтировании компонента
    useEffect(() => {
        fetchPeople();

    }, []); // Пустой массив зависимостей, так что вызовется только один раз

    // Функция для рендеринга модального окна с текстом
    const renderDelete = () => {
        return (
            <div>
                <h1>Удаляем группу по админу</h1>
                <select
                    id="person-admin"
                    onChange={(e) => {
                        const selectedId = e.target.value;
                        console.log("до этого был под удаление: ",adminToDelGroup)
                        let chosenAdmin = people.find(person => person.id === Number(selectedId));
                        console.log("выбираем для удаления: ", chosenAdmin)
                        if (!chosenAdmin) {
                            chosenAdmin = people[0];
                        }
                        setAdminToDelGroup(chosenAdmin);
                        console.log("Выбрали админа: ", chosenAdmin);
                    }}
                >
                    {people.map((person) => (
                        <option key={person.id} value={person.id}>
                            {person.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleDeleteRequest}>Удалить</button>
            </div>
        );
    };

    const handleDeleteRequest = async () => {
        console.log("к хэндлу пришло: ", adminToDelGroup)

        if (!adminToDelGroup) {
            console.error("Не выбран админ для удаления");
            // alert("Пожалуйста, выберите админа для удаления!");
            return; // Останавливаем выполнение, если админ не выбран
        }

        try {
            // Здесь вызываем запрос на удаление
            const response = await authFetch(`${DELETE_GROUP_BY_ADMIN}/${adminToDelGroup.name}`, {
                method: "DELETE",
            });

            const data = await response.json();
            console.log("Результат удаления:", data);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    };

    // Обработчик для удаления админа
    const handleDeleteAdmin = () => {
        // await fetchPeople();
        // console.log("при нажатии ВХОДА",adminToDelGroup);
        // setAdminToDelGroup(people[0])
        // console.log("засетили дефолтного",adminToDelGroup)
        openModal(renderDelete());
    };


    // const renderUniqueValue = (
    //     <h1>hi</h1>
    // )
    //
    // const handleUniqueValueOfAverageMark = () => {
    //
    //     openModal(renderUniqueValue)
    // }
    const handleUniqueValueOfAverageMark = async () => {
        try {
            const response = await authFetch(`${GET_LIST_AVERAGES}`,{
                method: "GET"
            }); // Замените на URL для запроса уникальных значений
            const data = await response.json();

            if (data.body) {
                setAverageMarks(data.body); // Обновляем состояние значениями, полученными с бэкенда
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
                                    <td>{mark}</td> {/* Значение averageMark */}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                );
                openModal(renderUniqueValue); // Открываем модальное окно с отрендеренными значениями
            } else {
                openModal(<p>Данные не найдены</p>); // Если данные не пришли
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
            openModal(<p>Ошибка при загрузке данных</p>);
        }
    };


    const handleGettingTotalExpelledStudents = async () =>  {
        try{
            const response = await authFetch(`${GET_TOTAL_EXPELLED_STUDENTS}`, {method: "GET"})
            const data = await response.json();
            const expelledCount = data.body; // Получаем значение из ответа
            if(data.body){
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
                )
                openModal(renderExpelledBlock);

            }
            else{
                openModal(<h1>юра, мы все проебали(</h1>)
            }
        }catch (error) {
            console.error(error);
        }
    }


    const actions = [
        {
            name: "Удалить группу по админу",
            description: "Удаляет один объект, у которого поле эквивалентно заданному значению.",
            buttonText: "Удалить",
            onClick: handleDeleteAdmin
        },
        {
            name: "Сгруппировать по formOfEducation",
            description: "Группирует объекты по значению поля formOfEducation и возвращает количество объектов в каждой группе.",
            buttonText: "Сгруппировать",
            onClick: handleGroupByFormOfEducation
        },
        {
            name: "Получить уникальные значения averageMark",
            description: "Возвращает массив уникальных значений поля averageMark по всем объектам.",
            buttonText: "Получить значения",
            onClick: handleUniqueValueOfAverageMark
        },
        {
            name: "Посчитать число отчисленных студентов",
            description: "Подсчитывает общее число отчисленных студентов во всех группах.",
            buttonText: "Посчитать",
            onClick: handleGettingTotalExpelledStudents
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
                            <button onClick={action.onClick}>{action.buttonText}</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Модальное окно */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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