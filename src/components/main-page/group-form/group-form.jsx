import React, {useEffect, useState} from 'react';
import {CREATE_NEW_GROUP, GET_PERSONS} from "../../../config";
import "./group-form.css";
import authFetch from "../../../utils/netUitls";

const GroupForm = ({selectedGroup, onSubmit, onClose, editOnlyAdmin, showNotification}) => {
    const [groupName, setGroupName] = useState("");
    const [studentsCount, setStudentsCount] = useState(1);
    const [groupPotentialAdmin, setGroupPotentialAdmin] = useState([]);
    const [chosenAdmin, setChosenAdmin] = useState(null);
    const [coordinates, setCoordinates] = useState({x: 0, y: 0});
    const [expelledStudentsCount, setExlledStudentsCount] = useState(1);
    const [transferredStudents, setTransferredStudents] = useState(1);
    const [formOfEducation, setFormOfEducation] = useState("FULL_TIME_EDUCATION");
    const [shouldBeExpelled, setShouldBeExpelled] = useState(1);
    const [averageMark, setAverageMark] = useState(1.1);
    const [semester, setSemester] = useState("SECOND");


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
        if (selectedGroup) {
            setGroupName(selectedGroup.name || '');
            setStudentsCount(selectedGroup.studentsCount || 0);
            setChosenAdmin(selectedGroup.chosenAdmin || null);
            setCoordinates(selectedGroup.coordinates || {x: 0, y: 0});
            setExlledStudentsCount(selectedGroup.expelledStudents || 0);
            setTransferredStudents(selectedGroup.transferredStudents || 0);
            setFormOfEducation(selectedGroup.formOfEducation || null);
            setShouldBeExpelled(selectedGroup.shouldBeExpelled || 0);
            setAverageMark(selectedGroup.averageMark || 0);
            setSemester(selectedGroup.semester || "SECOND");
        }
        fetchPeople()
    }, [])

    useEffect(() => {
        console.log("значение только эдита: ", editOnlyAdmin);
        if (groupPotentialAdmin.length > 0 && !chosenAdmin) {
            setChosenAdmin(groupPotentialAdmin[0]);
            console.log("дефолтно выбранный админ: ", groupPotentialAdmin[0]);
        }
    }, [groupPotentialAdmin, chosenAdmin]);

    const fetchPeople = async () => {
        try {
            const response = await authFetch(GET_PERSONS);
            const data = await response.json();

            if (data.body && Array.isArray(data.body.content)) {
                setGroupPotentialAdmin(data.body.content);
            } else {
                setGroupPotentialAdmin([]);
            }
        } catch (error) {
            setGroupPotentialAdmin([]);
        }
    };

    const handleChange = (e) => {
        let newValue = e.target.value;


        newValue = newValue.replace(',', '.');
        const pattern = /^-?\d*\.?\d{0,2}$/;
        if (pattern.test(newValue) || newValue === '') {
            setAverageMark(newValue);
        } else {
            console.error("ошибка присвоения")
            // setAverageMark(newValue);
        }
    };

    const handleBlur = () => {
        // Автоматическая замена запятой на точку при потере фокуса, если требуется
        setAverageMark((prevValue) => prevValue.replace(',', '.'));
    };
//
// Функция для преобразования с русской десятичной запятой в английскую точку
    function parseRuToEnFloat() {
        // return parseFloat(averageMark.replace(',', '.'));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newGroup = {
            ...(selectedGroup?.id && {
                id: selectedGroup.id,
            }),
            name: groupName,
            coordinates: coordinates,
            studentsCount: studentsCount,
            expelledStudents: expelledStudentsCount,
            transferredStudents: transferredStudents,
            formOfEducation: formOfEducation,
            shouldBeExpelled: shouldBeExpelled,
            averageMark: averageMark,
            semesterEnum: semester,
            groupAdmin: chosenAdmin
        };
        console.log("sending: ", newGroup);

        const submitValue = onSubmit(newGroup, chosenAdmin);
        console.log(submitValue.json);
        if (!submitValue) {
            console.log("непраивльное значение submit averageMarkValue")
            return;
        }

        try {
            const res = await submitValue;
            const responseData = await res.json();

            if (res.status === 200 || res.status === 201) {
                const message = responseData.message || "Успех";
                console.log(message);
                showNotification(message, "success"); // Передаем message в уведомление
                onClose();
            } else {
                const errorMessage = responseData.message || "Ошибка выполнения запроса";
                console.error("Проблемы с отправкой:", errorMessage);
                showNotification(`Ошибка: ${errorMessage}`, "error");
            }
        } catch (error) {
            console.error("Ошибка запроса:", error);
            // showNotification("Не удалось выполнить запрос", "error");
        }
    }



    const notEditOnlyAdmin = (
        <div className="group-form">
            <h2>{selectedGroup ? 'Редактировать группу' : 'Добавить группу'}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Имя группы:
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                </label>

                <div className="group-coordinates">
                    <p>Координаты группы: </p>
                    <label>
                        координата x:
                        <input
                            type="number"
                            value={coordinates.x}
                            onChange={(e) => setCoordinates({...coordinates, x: e.target.value})}
                            required
                        />
                    </label>

                    <label>
                        Координаты y:
                        <input
                            type="number"
                            value={coordinates.y}
                            onChange={(e) => setCoordinates({...coordinates, y: e.target.value})}
                            required
                        />
                    </label>
                </div>

                <label>
                    Количество студентов:
                    <input
                        type="number"
                        value={studentsCount}
                        onChange={(e) => setStudentsCount(Number(e.target.value))}
                        required
                    />
                </label>

                <label>
                    Количество отчисленных студентов:
                    <input
                        type="number"
                        value={expelledStudentsCount}
                        onChange={(e) => setExlledStudentsCount(Number(e.target.value))}
                        required
                    />
                </label>

                <label>
                    Количество студентов к отчислению:
                    <input
                        type="number"
                        value={shouldBeExpelled}
                        onChange={(e) => setShouldBeExpelled(Number(e.target.value))}
                        required
                    />
                </label>

                <label>
                    Количество переведенных студентов:
                    <input
                        type="number"
                        value={transferredStudents}
                        onChange={(e) => setTransferredStudents(Number(e.target.value))}
                        required
                    />
                </label>

                <label>
                    Форма образования
                    <select id="education-form" value={formOfEducation}
                            onChange={(e) => setFormOfEducation(e.target.value)}>
                        {Object.keys(formsOfEducation).map((form) => (
                            <option key={form} value={form}>{formsOfEducation[form]}</option>
                        ))}
                    </select>
                </label>

                {/*<label>*/}
                Средняя оценка группы:
                <input
                    name="averageMark"
                    value={averageMark}
                    onChange={handleChange}
                    // onBlur={handleBlur} // Преобразуем запятую в точку при потере фокуса
                    placeholder="Введите число"
                />
                {/*<input*/}
                {/*    type="float"*/}
                {/*    averageMarkValue={averageMark}*/}
                {/*    min={1}*/}
                {/*    max={5}*/}

                {/*    onChange={(e) => setAverageMark(e.target.averageMarkValue)}*/}
                {/*    required*/}
                {/*/>*/}

                <label>
                    Текущий семестр
                    <select id="current-semester" value={semester}
                            onChange={(e) => {
                                setSemester(e.target.value)
                            }
                            }
                    >
                        {Object.keys(currentSemester).map((sem) => (
                            <option key={sem} value={sem}>{currentSemester[sem]}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Выбрать админа группы:
                    <select
                        id="person-admin"
                        onChange={(e) => {
                            const selectedId = e.target.value;

                            let chosenAdmin = groupPotentialAdmin.find(person => person.id === Number(selectedId));
                            if (!chosenAdmin) {
                                chosenAdmin = groupPotentialAdmin[0];
                            }
                            setChosenAdmin(chosenAdmin);
                        }}
                    >
                        {groupPotentialAdmin.map((person) => (
                            <option key={person.id} value={person.id}>
                                {person.name}
                            </option>
                        ))}
                    </select>
                </label>

                <button type="submit">Сохранить</button>
            </form>
        </div>
    );

    const onlyAdmin = (
        <form onSubmit={handleSubmit}>
            <label>
                Выбрать нового админа группы:
                <select
                    id="person-admin"
                    onChange={(e) => {
                        const selectedId = e.target.value;

                        let chosenAdmin = groupPotentialAdmin.find(person => person.id === Number(selectedId));
                        if (!chosenAdmin) {
                            chosenAdmin = groupPotentialAdmin[0];
                        }
                        setChosenAdmin(chosenAdmin);
                    }}
                >
                    {groupPotentialAdmin.map((person) => (
                        <option key={person.id} value={person.id}>
                            {person.name}
                        </option>
                    ))}
                </select>
            </label>
            <button type="submit">Сохранить</button>

        </form>
    )


    if (!editOnlyAdmin)
        return notEditOnlyAdmin;
    else
        return (onlyAdmin)
};

export default GroupForm;