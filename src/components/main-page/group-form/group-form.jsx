import React, { useEffect, useState } from 'react';
import { CREATE_NEW_GROUP, GET_PERSONS } from "../../../config";
import "./group-form.css";
import authFetch from "../../../utils/netUitls";

const GroupForm = ({ group, onClose}) => {
    const [groupName, setGroupName] = useState("");
    const [studentsCount, setStudentsCount] = useState(0);
    const [groupPotentialAdmin, setGroupPotentialAdmin] = useState([]);
    const [chosenAdmin, setChosenAdmin] = useState(null);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [expelledStudentsCount, setExlledStudentsCount] = useState(0);
    const [transferredStudents, setTransferredStudents] = useState(0);
    const [formOfEducation, setFormOfEducation] = useState("FULL_TIME_EDUCATION");
    const [shouldBeExpelled, setShouldBeExpelled] = useState(0);
    const [averageMark, setAverageMark] = useState(1);
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

    useEffect(()=>{
        fetchPeople()
    },[])

    useEffect(() => {
        if (groupPotentialAdmin.length > 0 && !chosenAdmin) {
            setChosenAdmin(groupPotentialAdmin[0]);
            console.log("дефолтно выбранный админ: ", groupPotentialAdmin[0]);
        }
    }, [groupPotentialAdmin, chosenAdmin]);

    const fetchPeople = async () => {
        try {
            const response = await authFetch(`${GET_PERSONS}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setGroupPotentialAdmin(data); // Сохраняем массив людей
            } else {
                console.error("Полученные данные не являются массивом:", data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = 'POST';

        const url = `${CREATE_NEW_GROUP}`;

        const newGroup = {
            name: groupName,
            coordinates: coordinates,
            studentsCount: studentsCount,
            expelledStudents: expelledStudentsCount,
            transferredStudents: transferredStudents,
            formOfEducation: formOfEducation,
            shouldBeExpelled: shouldBeExpelled,
            averageMark: averageMark,
            semesterEnum: semester,
            groupAdmin: chosenAdmin//groupPotentialAdmin.filter(admin => admin.selected),
        };
        console.log("sending: ", newGroup);
        try {
            await authFetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGroup),
            });
            console.log("Группа успешно сохранена");
        } catch (error) {
            console.error("Ошибка при сохранении группы:", error);
        }
    };

    return (
        <div className="group-form">
            <h2>{group ? 'Редактировать группу' : 'Добавить группу'}</h2>
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
                            onChange={(e) => setCoordinates({ ...coordinates, x: e.target.value })}
                            required
                        />
                    </label>

                    <label>
                        Координаты y:
                        <input
                            type="number"
                            value={coordinates.y}
                            onChange={(e) => setCoordinates({ ...coordinates, y: e.target.value })}
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

                <label>
                    Средняя оценка группы:
                    <input
                        type="number"
                        value={averageMark}
                        min={1}
                        max={5}
                        onChange={(e) => setAverageMark(Number(e.target.value))}
                        required
                    />
                </label>

                <label>
                    Текущий семестр
                    <select id="current-semester" value={semester}
                            onChange={(e) => {
                                setSemester(e.target.value)}
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
                            if(!chosenAdmin) {
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
};

export default GroupForm;